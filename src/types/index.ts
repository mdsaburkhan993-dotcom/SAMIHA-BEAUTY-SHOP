export type Language = 'bn' | 'en';

export type UserRole = 'admin' | 'manager' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  shopName: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  image?: string;
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'partially_paid';
export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  stockDeducted: boolean; // Tracks whether stock has already been reduced
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  address: string;
  productsSupplied: string[];
  totalPurchases: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type ReturnCondition = 'unopened' | 'damaged' | 'opened_used';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  refundAmount: number;
  condition: ReturnCondition;
}

export interface CustomerReturn {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: ReturnItem[];
  totalRefundAmount: number;
  reason: string;
  status: ReturnStatus;
  isRestocked: boolean; // Whether stock was restored
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'business' | 'personal' | 'inventory' | 'customer';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: Language;
  toolInvocations?: Array<{
    toolName: string;
    resultSummary: string;
  }>;
}

export type ChannelType = 'facebook' | 'whatsapp' | 'tiktok';

export interface ChannelConnection {
  id: ChannelType;
  name: string;
  icon: string;
  status: 'not_connected' | 'connected' | 'error';
  accountName?: string;
  accountId?: string;
  lastSync?: string;
  requiredCredentials: string[];
  notes: string;
}

export interface CustomerMessage {
  id: string;
  channel: ChannelType;
  senderName: string;
  senderContact: string;
  messageText: string;
  timestamp: string;
  isReplied: boolean;
  orderIdRef?: string;
}

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
  durationMs: number;
}
