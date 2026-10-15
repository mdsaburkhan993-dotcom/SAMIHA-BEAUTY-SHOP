import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Order,
  Customer,
  Supplier,
  CustomerReturn,
  Task,
  ChannelConnection,
  CustomerMessage,
  Language,
  UserProfile,
  TestResult,
  OrderStatus
} from '../types/index.js';
import { translations } from '../locales/translations.js';
import { auth, googleProvider, testFirestoreConnection } from '../firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface BusinessSummary {
  todaySales: number;
  todayOrdersCount: number;
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  profitMarginPercent: number;
  totalOrders: number;
  pendingOrdersCount: number;
  confirmedOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  customerCount: number;
  productCount: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  top5Selling: Array<{ product: Product; unitsSold: number; totalRevenue: number }>;
  top10Selling: Array<{ product: Product; unitsSold: number; totalRevenue: number }>;
  recentOrders: Order[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.bn;
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  clearNotification: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Data
  summary: BusinessSummary | null;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  returns: CustomerReturn[];
  tasks: Task[];
  channels: ChannelConnection[];
  messages: CustomerMessage[];
  testResults: TestResult[];
  isRunningTests: boolean;

  // Actions
  refreshAll: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  archiveProduct: (id: string) => Promise<boolean>;

  createOrder: (orderPayload: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: Array<{ productId: string; quantity: number }>;
    discount?: number;
    deliveryCharge?: number;
    paymentStatus?: 'unpaid' | 'paid' | 'partially_paid';
    paymentMethod?: 'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
    orderStatus?: OrderStatus;
    notes?: string;
  }) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<boolean>;

  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<boolean>;
  createReturn: (data: {
    orderId: string;
    items: Array<{ productId: string; quantity: number; refundAmount: number; condition: 'unopened' | 'damaged' | 'opened_used' }>;
    reason: string;
  }) => Promise<boolean>;
  updateReturnStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'refunded') => Promise<boolean>;

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => Promise<boolean>;
  toggleTask: (id: string, currentStatus: boolean) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;

  updateChannel: (id: string, updates: Partial<ChannelConnection>) => Promise<boolean>;
  replyMessage: (id: string, replyText: string) => Promise<boolean>;
  runTests: () => Promise<void>;

  // Firebase
  firebaseConnected: boolean;
  firebaseUser: User | null;
  loginWithGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('samiha_lang') as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('samiha_lang', lang);
  };

  const t = translations[language];

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [user, setUser] = useState<UserProfile>({
    id: 'usr-admin-1',
    name: 'Md Sabur Khan (Admin)',
    email: 'mdsaburkhan993@gmail.com',
    role: 'admin',
    shopName: 'SAMIHA BEAUTY SHOP',
  });

  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const [summary, setSummary] = useState<BusinessSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [returns, setReturns] = useState<CustomerReturn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [channels, setChannels] = useState<ChannelConnection[]>([]);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Initialize and check Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, u => {
      setFirebaseUser(u);
      if (u) {
        setUser({
          id: u.uid,
          name: u.displayName || 'Authorized User',
          email: u.email || 'mdsaburkhan993@gmail.com',
          role: u.email === 'mdsaburkhan993@gmail.com' ? 'admin' : 'staff',
          avatar: u.photoURL || undefined,
          shopName: 'SAMIHA BEAUTY SHOP',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification(language === 'bn' ? 'ফায়ারবেস গুগুল লগইন সফল হয়েছে!' : 'Firebase Google Sign-in successful!', 'success');
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      showNotification(err.message || 'Authentication error', 'error');
    }
  };

  const logoutFirebase = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser({
        id: 'usr-admin-1',
        name: 'Md Sabur Khan (Admin)',
        email: 'mdsaburkhan993@gmail.com',
        role: 'admin',
        shopName: 'SAMIHA BEAUTY SHOP',
      });
      showNotification(language === 'bn' ? 'লগআউট সম্পন্ন হয়েছে' : 'Signed out from Firebase', 'info');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        sumRes,
        prodRes,
        ordRes,
        custRes,
        supRes,
        retRes,
        tskRes,
        chanRes,
        msgRes
      ] = await Promise.all([
        fetch('/api/business/summary'),
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/customers'),
        fetch('/api/suppliers'),
        fetch('/api/returns'),
        fetch('/api/tasks'),
        fetch('/api/channels'),
        fetch('/api/messages'),
      ]);

      if (sumRes.ok) setSummary(await sumRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (supRes.ok) setSuppliers(await supRes.json());
      if (retRes.ok) setReturns(await retRes.json());
      if (tskRes.ok) setTasks(await tskRes.json());
      if (chanRes.ok) setChannels(await chanRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (err: any) {
      console.error('Failed to load application data:', err);
      setError(err.message || 'Failed to connect to data store');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add product');
      }
      showNotification(language === 'bn' ? 'পণ্য সফলভাবে যুক্ত হয়েছে!' : 'Product added successfully!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update product');
      }
      showNotification(language === 'bn' ? 'পণ্য আপডেট হয়েছে!' : 'Product updated successfully!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const archiveProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to archive product');
      showNotification(language === 'bn' ? 'পণ্য আর্কাইভ করা হয়েছে।' : 'Product archived.', 'info');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const createOrder = async (orderPayload: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }
      showNotification(
        language === 'bn' ? 'নতুন অর্ডার সফলভাবে তৈরি হয়েছে!' : 'Order created successfully!',
        'success'
      );
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update order status');
      }
      
      let msg = language === 'bn' ? `অর্ডার স্ট্যাটাস "${newStatus}" এ পরিবর্তন করা হয়েছে।` : `Order status updated to "${newStatus}".`;
      if (['confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus)) {
        msg += language === 'bn' ? ' (ইনভেন্টরি থেকে স্টক সমন্বয় করা হয়েছে)' : ' (Inventory stock adjusted)';
      } else if (newStatus === 'cancelled') {
        msg += language === 'bn' ? ' (অর্ডারের পণ্যসমূহ স্টকে ফেরত দেওয়া হয়েছে)' : ' (Items restored to inventory)';
      }

      showNotification(msg, 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const addCustomer = async (data: any) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add customer');
      showNotification(language === 'bn' ? 'গ্রাহক যুক্ত হয়েছে!' : 'Customer added!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const addSupplier = async (data: any) => {
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add supplier');
      showNotification(language === 'bn' ? 'সাপ্লায়ার যুক্ত হয়েছে!' : 'Supplier added!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const createReturn = async (data: any) => {
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to record return');
      showNotification(language === 'bn' ? 'রিটার্ন রিকোয়েস্ট গ্রহণ করা হয়েছে!' : 'Return recorded!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const updateReturnStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`/api/returns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update return');
      showNotification(language === 'bn' ? 'রিটার্ন স্ট্যাটাস আপডেট হয়েছে!' : 'Return status updated!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const addTask = async (data: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add task');
      showNotification(language === 'bn' ? 'নতুন টাস্ক সংরক্ষিত হয়েছে!' : 'Task saved!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const updateChannel = async (id: string, updates: Partial<ChannelConnection>) => {
    try {
      const res = await fetch(`/api/channels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update channel');
      showNotification(language === 'bn' ? 'চ্যানেল কনফিগারেশন সংরক্ষিত হয়েছে।' : 'Channel config updated.', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const replyMessage = async (id: string, replyText: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText }),
      });
      if (!res.ok) throw new Error('Failed to reply message');
      showNotification(language === 'bn' ? 'উত্তর পাঠানো হয়েছে!' : 'Reply sent!', 'success');
      await refreshAll();
      return true;
    } catch (err: any) {
      showNotification(err.message, 'error');
      return false;
    }
  };

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      const res = await fetch('/api/tests/run');
      if (res.ok) {
        const data = await res.json();
        setTestResults(data.results || []);
        showNotification(
          data.allPassed
            ? (language === 'bn' ? 'সবগুলো অটোমেটেড টেস্ট সফলভাবে পাস করেছে!' : 'All automated test suites passed!')
            : 'Some tests failed verification.',
          data.allPassed ? 'success' : 'error'
        );
      }
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        activeTab,
        setActiveTab,
        loading,
        error,
        notification,
        clearNotification,
        showNotification,
        summary,
        products,
        orders,
        customers,
        suppliers,
        returns,
        tasks,
        channels,
        messages,
        testResults,
        isRunningTests,
        refreshAll,
        addProduct,
        updateProduct,
        archiveProduct,
        createOrder,
        updateOrderStatus,
        addCustomer,
        addSupplier,
        createReturn,
        updateReturnStatus,
        addTask,
        toggleTask,
        deleteTask,
        updateChannel,
        replyMessage,
        runTests,
        firebaseConnected,
        firebaseUser,
        loginWithGoogle,
        logoutFirebase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
