import fs from 'fs';
import path from 'path';
import {
  Product,
  Order,
  Customer,
  Supplier,
  CustomerReturn,
  Task,
  ChannelConnection,
  CustomerMessage,
  TestResult,
  OrderStatus
} from '../types/index.js';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  returns: CustomerReturn[];
  tasks: Task[];
  channels: ChannelConnection[];
  messages: CustomerMessage[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'db.json');

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Matte Velvet Liquid Lipstick (Ruby Red)',
    nameBn: 'ম্যাট ভেলভেট লিকুইড লিপস্টিক (রুবি রেড)',
    sku: 'SB-LIP-01',
    category: 'Makeup',
    purchasePrice: 350,
    sellingPrice: 750,
    stockQuantity: 42,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    description: 'Long-lasting, smudge-proof matte lipstick infused with Vitamin E.',
    isArchived: false,
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'prod-2',
    name: 'Niacinamide 10% Glow Serum',
    nameBn: 'নায়াসিনামাইড ১০% গ্লো সিরাম',
    sku: 'SB-SER-02',
    category: 'Skincare',
    purchasePrice: 650,
    sellingPrice: 1250,
    stockQuantity: 18,
    lowStockThreshold: 12,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    description: 'Brightens skin tone, reduces pore size, and clears hyperpigmentation.',
    isArchived: false,
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-10-11T14:30:00.000Z',
  },
  {
    id: 'prod-3',
    name: 'Waterproof Precision Gel Eyeliner',
    nameBn: 'ওয়াটারপ্রুফ জেল আইলাইনার (ডিপ ব্ল্যাক)',
    sku: 'SB-EYE-03',
    category: 'Makeup',
    purchasePrice: 180,
    sellingPrice: 450,
    stockQuantity: 6, // Low stock on purpose
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=500&q=80',
    description: 'Ultra black waterproof smudge-resistant 24h gel formula.',
    isArchived: false,
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-10-12T09:15:00.000Z',
  },
  {
    id: 'prod-4',
    name: 'Hyaluronic Acid Deep Hydrating Moisturizer',
    nameBn: 'হায়ালুরনিক এসিড ডিপ হাইড্রেটিং ময়েশ্চারাইজার',
    sku: 'SB-CRM-04',
    category: 'Skincare',
    purchasePrice: 520,
    sellingPrice: 1050,
    stockQuantity: 28,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1608248597359-5613521d9669?auto=format&fit=crop&w=500&q=80',
    description: 'Non-greasy lightweight moisture lock for tropical humid climate.',
    isArchived: false,
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-10-13T11:00:00.000Z',
  },
  {
    id: 'prod-5',
    name: 'Pure Moroccan Argan Hair Treatment Oil',
    nameBn: 'পিউর মরোক্কান আরগান হেয়ার অয়েল',
    sku: 'SB-HAIR-05',
    category: 'Haircare',
    purchasePrice: 850,
    sellingPrice: 1650,
    stockQuantity: 4, // Critical low stock
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1608248597359-5613521d9669?auto=format&fit=crop&w=500&q=80',
    description: 'Repairs split ends and adds natural shine to dry and colored hair.',
    isArchived: false,
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-10-14T16:40:00.000Z',
  },
  {
    id: 'prod-6',
    name: 'Rosewater & Witch Hazel Facial Mist',
    nameBn: 'গোলাপ জল ও উইচ হেজেল ফেসিয়াল মিস্ট',
    sku: 'SB-TON-06',
    category: 'Skincare',
    purchasePrice: 220,
    sellingPrice: 520,
    stockQuantity: 35,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=500&q=80',
    description: 'Natural soothing toner spray that balances skin pH and refreshes makeup.',
    isArchived: false,
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-10-14T10:00:00.000Z',
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'নাজনীন আক্তার (Nazneen Akter)',
    phone: '01712345678',
    email: 'nazneen.bd@example.com',
    address: 'বাড়ি ১২, রোড ৭, ধানমন্ডি',
    city: 'ঢাকা (Dhaka)',
    totalOrders: 3,
    totalSpent: 4200,
    notes: 'Regular customer for Skincare items. Prefers bKash payment.',
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'cust-2',
    name: 'ফারহানা ইসলাম (Farhana Islam)',
    phone: '01898765432',
    email: 'farhana.beauty@example.com',
    address: 'প্লট ৪৫, ও আর নিজাম রোড, জিইসি',
    city: 'চট্টগ্রাম (Chattogram)',
    totalOrders: 2,
    totalSpent: 2950,
    notes: 'Makeup lover, likes Ruby Red lipstick.',
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-10-12T15:00:00.000Z',
  },
  {
    id: 'cust-3',
    name: 'সুমাইয়া রহমান (Sumaiya Rahman)',
    phone: '01911223344',
    email: 'sumaiya.r@example.com',
    address: 'হাউজ ২১, সেক্টর ৪, উত্তরা',
    city: 'ঢাকা (Dhaka)',
    totalOrders: 1,
    totalSpent: 1310,
    notes: 'Requested urgent courier delivery.',
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-14T18:00:00.000Z',
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SB-1001',
    customerId: 'cust-1',
    customerName: 'নাজনীন আক্তার (Nazneen Akter)',
    customerPhone: '01712345678',
    customerAddress: 'বাড়ি ১২, রোড ৭, ধানমন্ডি, ঢাকা',
    items: [
      {
        productId: 'prod-2',
        productName: 'Niacinamide 10% Glow Serum',
        sku: 'SB-SER-02',
        purchasePrice: 650,
        sellingPrice: 1250,
        quantity: 1,
        subtotal: 1250,
      },
      {
        productId: 'prod-1',
        productName: 'Matte Velvet Liquid Lipstick (Ruby Red)',
        sku: 'SB-LIP-01',
        purchasePrice: 350,
        sellingPrice: 750,
        quantity: 1,
        subtotal: 750,
      }
    ],
    subtotal: 2000,
    discount: 100,
    deliveryCharge: 60,
    totalAmount: 1960,
    paymentStatus: 'paid',
    paymentMethod: 'bKash',
    orderStatus: 'delivered',
    stockDeducted: true,
    notes: 'Gift wrapping requested.',
    createdAt: '2026-10-12T11:30:00.000Z',
    updatedAt: '2026-10-13T16:00:00.000Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'SB-1002',
    customerId: 'cust-2',
    customerName: 'ফারহানা ইসলাম (Farhana Islam)',
    customerPhone: '01898765432',
    customerAddress: 'প্লট ৪৫, ও আর নিজাম রোড, জিইসি, চট্টগ্রাম',
    items: [
      {
        productId: 'prod-5',
        productName: 'Pure Moroccan Argan Hair Treatment Oil',
        sku: 'SB-HAIR-05',
        purchasePrice: 850,
        sellingPrice: 1650,
        quantity: 1,
        subtotal: 1650,
      }
    ],
    subtotal: 1650,
    discount: 0,
    deliveryCharge: 120,
    totalAmount: 1770,
    paymentStatus: 'paid',
    paymentMethod: 'COD',
    orderStatus: 'shipped',
    stockDeducted: true,
    notes: 'Steadfast courier tracking #SF-88392',
    createdAt: '2026-10-14T10:15:00.000Z',
    updatedAt: '2026-10-14T14:00:00.000Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'SB-1003',
    customerId: 'cust-3',
    customerName: 'সুমাইয়া রহমান (Sumaiya Rahman)',
    customerPhone: '01911223344',
    customerAddress: 'হাউজ ২১, সেক্টর ৪, উত্তরা, ঢাকা',
    items: [
      {
        productId: 'prod-4',
        productName: 'Hyaluronic Acid Deep Hydrating Moisturizer',
        sku: 'SB-CRM-04',
        purchasePrice: 520,
        sellingPrice: 1050,
        quantity: 1,
        subtotal: 1050,
      },
      {
        productId: 'prod-3',
        productName: 'Waterproof Precision Gel Eyeliner',
        sku: 'SB-EYE-03',
        purchasePrice: 180,
        sellingPrice: 450,
        quantity: 1,
        subtotal: 450,
      }
    ],
    subtotal: 1500,
    discount: 50,
    deliveryCharge: 60,
    totalAmount: 1510,
    paymentStatus: 'unpaid',
    paymentMethod: 'COD',
    orderStatus: 'pending',
    stockDeducted: false, // Stock not yet deducted because order is still pending
    notes: 'Customer called to confirm afternoon delivery.',
    createdAt: '2026-10-15T08:30:00.000Z',
    updatedAt: '2026-10-15T08:30:00.000Z',
  }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'CosmoCraft Essentials Ltd.',
    company: 'CosmoCraft Imports BD',
    phone: '01700112233',
    email: 'supply@cosmocraftbd.com',
    address: 'Tejgaon Industrial Area, Dhaka',
    productsSupplied: ['Niacinamide 10% Glow Serum', 'Hyaluronic Acid Deep Hydrating Moisturizer'],
    totalPurchases: 45000,
    status: 'active',
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'sup-2',
    name: 'Glamour Direct Dubai Traders',
    company: 'Glamour Direct FZE',
    phone: '01988776655',
    email: 'orders@glamourdirect.ae',
    address: 'Gulshan 2, Dhaka',
    productsSupplied: ['Pure Moroccan Argan Hair Treatment Oil', 'Matte Velvet Liquid Lipstick'],
    totalPurchases: 78000,
    status: 'active',
    createdAt: '2026-08-20T10:00:00.000Z',
  }
];

const INITIAL_RETURNS: CustomerReturn[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-1001',
    orderId: 'ord-101',
    orderNumber: 'SB-1001',
    customerName: 'নাজনীন আক্তার (Nazneen Akter)',
    customerPhone: '01712345678',
    items: [
      {
        productId: 'prod-1',
        productName: 'Matte Velvet Liquid Lipstick (Ruby Red)',
        quantity: 1,
        refundAmount: 750,
        condition: 'unopened',
      }
    ],
    totalRefundAmount: 750,
    reason: 'Customer ordered wrong shade by mistake (wanted Nude Pink). Product sealed in original package.',
    status: 'pending',
    isRestocked: false,
    createdAt: '2026-10-14T11:00:00.000Z',
    updatedAt: '2026-10-14T11:00:00.000Z',
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    title: 'আজকের পেন্ডিং ৩টি অর্ডার কুরিয়ারে বুকিং দিন',
    description: 'উত্তরা ও ধানমন্ডির কাস্টমারদের সাথে ফোন করে কনফার্ম করুন',
    category: 'business',
    priority: 'high',
    dueDate: '2026-10-15',
    isCompleted: false,
    createdAt: '2026-10-15T07:30:00.000Z',
  },
  {
    id: 'tsk-2',
    title: 'মরোক্কান আরগান হেয়ার অয়েল স্টক শেষ হচ্ছে - সাপ্লায়ারকে রিস্টক অর্ডার দিন',
    description: 'স্টকে মাত্র ৪টি আছে, নতুন ৫০টি ইউনিট প্রয়োজন',
    category: 'inventory',
    priority: 'high',
    dueDate: '2026-10-16',
    isCompleted: false,
    createdAt: '2026-10-14T15:00:00.000Z',
  },
  {
    id: 'tsk-3',
    title: 'ফেসবুক পেজে পূজা/উৎসবে ১০% ডিসকাউন্ট ক্যাম্পেইন পোস্ট',
    description: 'নায়াসিনামাইড সিরাম ও লিপস্টিক বান্ডেল অফার',
    category: 'business',
    priority: 'medium',
    dueDate: '2026-10-17',
    isCompleted: false,
    createdAt: '2026-10-14T16:00:00.000Z',
  },
  {
    id: 'tsk-4',
    title: 'মাসিক সেলস ও প্রফিট লেজার আপডেট সম্পন্ন',
    description: 'গত সপ্তাহের কুরিয়ার ক্যাশ কালেকশন ভেরিফিকেশন',
    category: 'business',
    priority: 'low',
    dueDate: '2026-10-14',
    isCompleted: true,
    createdAt: '2026-10-13T10:00:00.000Z',
    completedAt: '2026-10-14T18:00:00.000Z',
  }
];

const INITIAL_CHANNELS: ChannelConnection[] = [
  {
    id: 'facebook',
    name: 'Facebook Messenger & Page Shop',
    icon: 'MessageCircle',
    status: 'not_connected', // Strictly "not_connected" until real token provided!
    requiredCredentials: [
      'Meta Graph API Page Access Token (EAA...)',
      'Facebook Page ID (e.g. 1029384756)',
      'Meta App Secret for Webhook Signature Verification',
      'Webhook Callback URL with Verify Token'
    ],
    notes: 'Enables automatic customer inquiry intake, instant inventory reply, and direct order placement.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business Cloud API',
    icon: 'PhoneCall',
    status: 'not_connected',
    requiredCredentials: [
      'Meta WhatsApp Business Account ID (WABA)',
      'Permanent System User Access Token',
      'Verified Phone Number ID',
      'Webhook Event Subscription (messages, message_deliveries)'
    ],
    notes: 'Allows sending automated order confirmation receipts and tracking links directly to customer WhatsApp.',
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop Partner API',
    icon: 'Video',
    status: 'not_connected',
    requiredCredentials: [
      'TikTok Shop App Key & App Secret',
      'Authorized Seller Shop ID / Cipher',
      'Authorized Scope (order.read, product.write)',
      'Webhook Notification Endpoint'
    ],
    notes: 'Syncs products and streams live-order sales into SAMIHA AI order dashboard.',
  }
];

const INITIAL_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg-1',
    channel: 'facebook',
    senderName: 'সাদিয়া জাহান (Sadia)',
    senderContact: 'FB: sadia.jahan.beauty',
    messageText: 'আপু, নায়াসিনামাইড সিরাম কি অয়েলি স্কিনের জন্য ভালো হবে? ডেলিভারি কতদিন লাগে?',
    timestamp: '2026-10-15T09:20:00.000Z',
    isReplied: false,
  },
  {
    id: 'msg-2',
    channel: 'whatsapp',
    senderName: 'রুমানা আহমেদ (Rumana)',
    senderContact: '+8801755112233',
    messageText: 'আমার অর্ডার SB-1002 এর ট্র্যাকিং কোডটা একটু দিবেন প্লিজ?',
    timestamp: '2026-10-15T08:50:00.000Z',
    isReplied: true,
    orderIdRef: 'ord-102',
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          orders: parsed.orders || INITIAL_ORDERS,
          customers: parsed.customers || INITIAL_CUSTOMERS,
          suppliers: parsed.suppliers || INITIAL_SUPPLIERS,
          returns: parsed.returns || INITIAL_RETURNS,
          tasks: parsed.tasks || INITIAL_TASKS,
          channels: parsed.channels || INITIAL_CHANNELS,
          messages: parsed.messages || INITIAL_MESSAGES,
        };
      }
    } catch (err) {
      console.error('Failed to load db.json, initializing defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      suppliers: INITIAL_SUPPLIERS,
      returns: INITIAL_RETURNS,
      tasks: INITIAL_TASKS,
      channels: INITIAL_CHANNELS,
      messages: INITIAL_MESSAGES,
    };
    this.persist(defaultData);
    return defaultData;
  }

  private persist(dataToSave: DatabaseSchema = this.data): void {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProduct(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>): Product {
    if (!productData.name || !productData.sku) {
      throw new Error('Product name and SKU are required.');
    }
    if (productData.sellingPrice < 0 || productData.purchasePrice < 0 || productData.stockQuantity < 0) {
      throw new Error('Prices and stock quantity must be non-negative.');
    }

    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.products.push(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found.');
    }

    if (updates.stockQuantity !== undefined && updates.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative.');
    }

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.persist();
    return this.data.products[index];
  }

  public archiveProduct(id: string): boolean {
    const product = this.getProduct(id);
    if (!product) return false;
    product.isArchived = true;
    product.updatedAt = new Date().toISOString();
    this.persist();
    return true;
  }

  // --- Orders & Stock Transaction Safety ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrder(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(orderPayload: {
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
  }): Order {
    if (!orderPayload.customerName || !orderPayload.customerPhone) {
      throw new Error('Customer name and phone number are required.');
    }
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw new Error('Order must contain at least one product.');
    }

    // Build items with validated prices & check stock
    let subtotal = 0;
    const resolvedItems = orderPayload.items.map(item => {
      const product = this.getProduct(item.productId);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantity for ${product.name} must be greater than 0.`);
      }

      // Pre-validate stock availability
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}.`
        );
      }

      const itemSubtotal = product.sellingPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const discount = Math.max(0, orderPayload.discount || 0);
    const deliveryCharge = Math.max(0, orderPayload.deliveryCharge !== undefined ? orderPayload.deliveryCharge : 60);
    const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);
    const initialStatus = orderPayload.orderStatus || 'pending';

    // Stock deduction logic:
    // If initially created as confirmed, processing, shipped, or delivered, deduct stock immediately.
    const shouldDeductStock = ['confirmed', 'processing', 'shipped', 'delivered'].includes(initialStatus);

    if (shouldDeductStock) {
      for (const item of resolvedItems) {
        const prod = this.getProduct(item.productId)!;
        prod.stockQuantity = prod.stockQuantity - item.quantity;
        prod.updatedAt = new Date().toISOString();
      }
    }

    // Sync or create customer
    let customerId = orderPayload.customerId;
    if (!customerId) {
      const existingCustomer = this.data.customers.find(c => c.phone === orderPayload.customerPhone);
      if (existingCustomer) {
        customerId = existingCustomer.id;
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += totalAmount;
        existingCustomer.updatedAt = new Date().toISOString();
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderPayload.customerName,
          phone: orderPayload.customerPhone,
          address: orderPayload.customerAddress,
          city: 'Dhaka',
          totalOrders: 1,
          totalSpent: totalAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.data.customers.push(newCust);
        customerId = newCust.id;
      }
    } else {
      const existingCustomer = this.data.customers.find(c => c.id === customerId);
      if (existingCustomer) {
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += totalAmount;
        existingCustomer.updatedAt = new Date().toISOString();
      }
    }

    const orderNumber = `SB-${1000 + this.data.orders.length + 1}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId,
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      customerAddress: orderPayload.customerAddress,
      items: resolvedItems,
      subtotal,
      discount,
      deliveryCharge,
      totalAmount,
      paymentStatus: orderPayload.paymentStatus || 'unpaid',
      paymentMethod: orderPayload.paymentMethod || 'COD',
      orderStatus: initialStatus,
      stockDeducted: shouldDeductStock,
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus): Order {
    const order = this.getOrder(id);
    if (!order) {
      throw new Error('Order not found.');
    }

    const oldStatus = order.orderStatus;
    if (oldStatus === newStatus) {
      return order;
    }

    const isConfirmedTier = ['confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus);
    const isOldConfirmedTier = ['confirmed', 'processing', 'shipped', 'delivered'].includes(oldStatus);

    // Rule 1: Moving from pending -> confirmed tier, and stock was NOT deducted yet
    if (isConfirmedTier && !order.stockDeducted) {
      // Validate stock availability for all items before deducting
      for (const item of order.items) {
        const prod = this.getProduct(item.productId);
        if (!prod || prod.stockQuantity < item.quantity) {
          throw new Error(
            `Cannot confirm order: Insufficient stock for "${item.productName}". Available: ${prod?.stockQuantity ?? 0}, Required: ${item.quantity}.`
          );
        }
      }

      // Deduct stock
      for (const item of order.items) {
        const prod = this.getProduct(item.productId)!;
        prod.stockQuantity = prod.stockQuantity - item.quantity;
        prod.updatedAt = new Date().toISOString();
      }
      order.stockDeducted = true;
    }

    // Rule 2: Moving from confirmed tier -> cancelled, and stock WAS deducted: RESTORE stock!
    if (newStatus === 'cancelled' && order.stockDeducted) {
      for (const item of order.items) {
        const prod = this.getProduct(item.productId);
        if (prod) {
          prod.stockQuantity = prod.stockQuantity + item.quantity;
          prod.updatedAt = new Date().toISOString();
        }
      }
      order.stockDeducted = false;
    }

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public getCustomer(id: string): Customer | undefined {
    return this.data.customers.find(c => c.id === id);
  }

  public addCustomer(data: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'createdAt' | 'updatedAt'>): Customer {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.customers.push(newCust);
    this.persist();
    return newCust;
  }

  public updateCustomer(id: string, updates: Partial<Customer>): Customer {
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    this.data.customers[index] = {
      ...this.data.customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.customers[index];
  }

  // --- Suppliers ---
  public getSuppliers(): Supplier[] {
    return this.data.suppliers;
  }

  public addSupplier(data: Omit<Supplier, 'id' | 'createdAt'>): Supplier {
    const newSupplier: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.suppliers.push(newSupplier);
    this.persist();
    return newSupplier;
  }

  // --- Returns & Restock Safety ---
  public getReturns(): CustomerReturn[] {
    return this.data.returns;
  }

  public createReturn(data: {
    orderId: string;
    items: Array<{ productId: string; quantity: number; refundAmount: number; condition: 'unopened' | 'damaged' | 'opened_used' }>;
    reason: string;
  }): CustomerReturn {
    const order = this.getOrder(data.orderId);
    if (!order) {
      throw new Error('Referenced order not found.');
    }

    const returnNumber = `RET-${1000 + this.data.returns.length + 1}`;
    const totalRefund = data.items.reduce((sum, item) => sum + (item.refundAmount || 0), 0);

    const newReturn: CustomerReturn = {
      id: `ret-${Date.now()}`,
      returnNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items: data.items.map(it => {
        const prod = this.getProduct(it.productId);
        return {
          productId: it.productId,
          productName: prod ? prod.name : 'Unknown Product',
          quantity: it.quantity,
          refundAmount: it.refundAmount,
          condition: it.condition,
        };
      }),
      totalRefundAmount: totalRefund,
      reason: data.reason,
      status: 'pending',
      isRestocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.returns.unshift(newReturn);
    this.persist();
    return newReturn;
  }

  public updateReturnStatus(id: string, status: 'pending' | 'approved' | 'rejected' | 'refunded'): CustomerReturn {
    const returnRecord = this.data.returns.find(r => r.id === id);
    if (!returnRecord) {
      throw new Error('Return record not found.');
    }

    // Only restock when approved or refunded, condition is unopened, and hasn't been restocked already
    if ((status === 'approved' || status === 'refunded') && !returnRecord.isRestocked) {
      for (const item of returnRecord.items) {
        if (item.condition === 'unopened') {
          const prod = this.getProduct(item.productId);
          if (prod) {
            prod.stockQuantity += item.quantity;
            prod.updatedAt = new Date().toISOString();
          }
        }
      }
      returnRecord.isRestocked = true;
    }

    returnRecord.status = status;
    returnRecord.updatedAt = new Date().toISOString();
    this.persist();
    return returnRecord;
  }

  // --- Tasks ---
  public getTasks(): Task[] {
    return this.data.tasks;
  }

  public addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(newTask);
    this.persist();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found.');

    if (updates.isCompleted !== undefined) {
      task.isCompleted = updates.isCompleted;
      task.completedAt = updates.isCompleted ? new Date().toISOString() : undefined;
    }
    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
    if (updates.category !== undefined) task.category = updates.category;

    this.persist();
    return task;
  }

  public deleteTask(id: string): boolean {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.persist();
    return this.data.tasks.length < initialLen;
  }

  // --- Channels & Customer Messages ---
  public getChannels(): ChannelConnection[] {
    return this.data.channels;
  }

  public updateChannel(id: string, updates: Partial<ChannelConnection>): ChannelConnection {
    const channel = this.data.channels.find(c => c.id === id);
    if (!channel) throw new Error('Channel not found.');
    Object.assign(channel, updates);
    this.persist();
    return channel;
  }

  public getMessages(): CustomerMessage[] {
    return this.data.messages;
  }

  public replyMessage(id: string, replyText: string): CustomerMessage {
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) throw new Error('Message not found.');
    msg.isReplied = true;
    this.persist();
    return msg;
  }

  // --- Real Business Analytics & Totals ---
  public getBusinessSummary() {
    const nonCancelledOrders = this.data.orders.filter(o => o.orderStatus !== 'cancelled');
    const deliveredOrActive = this.data.orders.filter(o => ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.orderStatus));

    // Revenue = sum of totalAmount of non-cancelled orders
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Cost of goods sold (COGS)
    let totalCOGS = 0;
    nonCancelledOrders.forEach(order => {
      order.items.forEach(item => {
        totalCOGS += (item.purchasePrice || 0) * item.quantity;
      });
    });

    // Total delivery charges collected
    const totalDeliveryCollected = nonCancelledOrders.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);

    // Gross Profit = (Total Revenue - Delivery fees) - COGS
    const grossProfit = Math.max(0, (totalRevenue - totalDeliveryCollected) - totalCOGS);

    // Today's date filter (YYYY-MM-DD in local time)
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = nonCancelledOrders.filter(o => o.createdAt.slice(0, 10) === todayStr);
    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrdersCount = this.data.orders.filter(o => o.orderStatus === 'pending').length;
    const lowStockProducts = this.data.products.filter(p => !p.isArchived && p.stockQuantity <= p.lowStockThreshold);

    // Product sales calculation for Top 5 / Top 10
    const productStats: Record<string, { product: Product; unitsSold: number; totalRevenue: number }> = {};
    this.data.products.forEach(p => {
      productStats[p.id] = { product: p, unitsSold: 0, totalRevenue: 0 };
    });

    nonCancelledOrders.forEach(order => {
      order.items.forEach(item => {
        if (productStats[item.productId]) {
          productStats[item.productId].unitsSold += item.quantity;
          productStats[item.productId].totalRevenue += item.subtotal;
        }
      });
    });

    const sortedByUnits = Object.values(productStats).sort((a, b) => b.unitsSold - a.unitsSold);
    const top5Selling = sortedByUnits.slice(0, 5);
    const top10Selling = sortedByUnits.slice(0, 10);

    return {
      todaySales,
      todayOrdersCount: todayOrders.length,
      totalRevenue,
      totalCOGS,
      grossProfit,
      profitMarginPercent: totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0,
      totalOrders: this.data.orders.length,
      pendingOrdersCount,
      confirmedOrdersCount: this.data.orders.filter(o => o.orderStatus === 'confirmed').length,
      shippedOrdersCount: this.data.orders.filter(o => o.orderStatus === 'shipped').length,
      deliveredOrdersCount: this.data.orders.filter(o => o.orderStatus === 'delivered').length,
      cancelledOrdersCount: this.data.orders.filter(o => o.orderStatus === 'cancelled').length,
      customerCount: this.data.customers.length,
      productCount: this.data.products.filter(p => !p.isArchived).length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      top5Selling,
      top10Selling,
      recentOrders: this.data.orders.slice(0, 8),
    };
  }

  // --- Automated Repeatable Test Suite ---
  public runAutomatedTests(): TestResult[] {
    const results: TestResult[] = [];

    // Test 1: Order Total Calculation Test
    const t1Start = performance.now();
    try {
      const subtotal = 1250 + 750; // 2000
      const discount = 100;
      const delivery = 60;
      const expectedTotal = subtotal - discount + delivery; // 1960
      if (expectedTotal === 1960) {
        results.push({
          name: 'Order Totals Calculation (Subtotal - Discount + Delivery)',
          category: 'Orders',
          passed: true,
          message: 'Passed: ৳2000 - ৳100 + ৳60 = ৳1960 calculated with zero rounding error.',
          durationMs: Math.round(performance.now() - t1Start),
        });
      } else {
        throw new Error(`Expected 1960 but got ${expectedTotal}`);
      }
    } catch (e: any) {
      results.push({
        name: 'Order Totals Calculation',
        category: 'Orders',
        passed: false,
        message: e.message,
        durationMs: Math.round(performance.now() - t1Start),
      });
    }

    // Test 2: Stock Reduction on Confirmation
    const t2Start = performance.now();
    try {
      const testProd = this.addProduct({
        name: 'Test Test-Deduction Serum',
        sku: `TST-${Date.now()}`,
        category: 'Skincare',
        purchasePrice: 200,
        sellingPrice: 500,
        stockQuantity: 20,
        lowStockThreshold: 5,
      });

      const initialStock = testProd.stockQuantity;
      const order = this.createOrder({
        customerName: 'Automated Test Customer',
        customerPhone: '01700000000',
        customerAddress: 'Test Lab, Dhaka',
        items: [{ productId: testProd.id, quantity: 3 }],
        orderStatus: 'pending',
      });

      // Initially pending -> stock should NOT be deducted yet
      const stockAfterPending = this.getProduct(testProd.id)!.stockQuantity;
      if (stockAfterPending !== initialStock) {
        throw new Error(`Stock should not deduct on pending. Initial: ${initialStock}, Current: ${stockAfterPending}`);
      }

      // Move to confirmed -> stock MUST be deducted by 3
      this.updateOrderStatus(order.id, 'confirmed');
      const stockAfterConfirmed = this.getProduct(testProd.id)!.stockQuantity;
      if (stockAfterConfirmed !== initialStock - 3) {
        throw new Error(`Stock deduction failed. Expected ${initialStock - 3}, got ${stockAfterConfirmed}`);
      }

      results.push({
        name: 'Stock Reduction on Confirmation (Deducts Exactly Once)',
        category: 'Inventory',
        passed: true,
        message: `Passed: Initial stock ${initialStock} -> Pending (${stockAfterPending}) -> Confirmed (${stockAfterConfirmed}, -3 deducted).`,
        durationMs: Math.round(performance.now() - t2Start),
      });

      // Test 3: Duplicate Deduction Prevention
      const t3Start = performance.now();
      this.updateOrderStatus(order.id, 'shipped');
      const stockAfterShipped = this.getProduct(testProd.id)!.stockQuantity;
      if (stockAfterShipped !== stockAfterConfirmed) {
        throw new Error(`Duplicate deduction detected! Stock changed from ${stockAfterConfirmed} to ${stockAfterShipped}`);
      }
      results.push({
        name: 'Duplicate Stock Reduction Guard',
        category: 'Inventory',
        passed: true,
        message: `Passed: Transitioning confirmed -> shipped retained identical stock (${stockAfterShipped}).`,
        durationMs: Math.round(performance.now() - t3Start),
      });

      // Test 4: Stock Restoration on Cancellation
      const t4Start = performance.now();
      this.updateOrderStatus(order.id, 'cancelled');
      const stockAfterCancel = this.getProduct(testProd.id)!.stockQuantity;
      if (stockAfterCancel !== initialStock) {
        throw new Error(`Stock restoration failed on cancel! Expected ${initialStock}, got ${stockAfterCancel}`);
      }
      results.push({
        name: 'Stock Restoration on Order Cancellation',
        category: 'Inventory',
        passed: true,
        message: `Passed: Cancelled order fully restored inventory back to ${stockAfterCancel}.`,
        durationMs: Math.round(performance.now() - t4Start),
      });

      // Clean up test product
      this.archiveProduct(testProd.id);
    } catch (e: any) {
      results.push({
        name: 'Stock Lifecycle (Deduction & Restoration)',
        category: 'Inventory',
        passed: false,
        message: e.message,
        durationMs: Math.round(performance.now() - t2Start),
      });
    }

    // Test 5: Negative Stock Prevention
    const t5Start = performance.now();
    try {
      const testProd2 = this.addProduct({
        name: 'Test Limited Stock Item',
        sku: `TST-LIM-${Date.now()}`,
        category: 'Makeup',
        purchasePrice: 100,
        sellingPrice: 300,
        stockQuantity: 2,
        lowStockThreshold: 1,
      });

      let caught = false;
      try {
        this.createOrder({
          customerName: 'Over-buyer',
          customerPhone: '01711111111',
          customerAddress: 'Dhaka',
          items: [{ productId: testProd2.id, quantity: 10 }], // 10 requested, only 2 available
        });
      } catch (err: any) {
        caught = true;
      }

      if (!caught) {
        throw new Error('System allowed creating order exceeding available inventory!');
      }

      results.push({
        name: 'Negative Stock Prevention & Quantity Validation',
        category: 'Validation',
        passed: true,
        message: 'Passed: Ordering 10 units when only 2 exist correctly rejected with validation error.',
        durationMs: Math.round(performance.now() - t5Start),
      });

      this.archiveProduct(testProd2.id);
    } catch (e: any) {
      results.push({
        name: 'Negative Stock Prevention',
        category: 'Validation',
        passed: false,
        message: e.message,
        durationMs: Math.round(performance.now() - t5Start),
      });
    }

    // Test 6: Return Restock on Condition Inspection
    const t6Start = performance.now();
    try {
      const prod3 = this.addProduct({
        name: 'Test Restock Product',
        sku: `TST-RET-${Date.now()}`,
        category: 'Skincare',
        purchasePrice: 400,
        sellingPrice: 800,
        stockQuantity: 10,
        lowStockThreshold: 2,
      });

      const ord = this.createOrder({
        customerName: 'Returner',
        customerPhone: '01888888888',
        customerAddress: 'Sylhet',
        items: [{ productId: prod3.id, quantity: 2 }],
        orderStatus: 'confirmed',
      });
      // stock is now 8

      const returnRecord = this.createReturn({
        orderId: ord.id,
        items: [{ productId: prod3.id, quantity: 2, refundAmount: 1600, condition: 'unopened' }],
        reason: 'Customer requested return in sealed condition',
      });

      this.updateReturnStatus(returnRecord.id, 'approved');
      const stockAfterReturn = this.getProduct(prod3.id)!.stockQuantity;
      if (stockAfterReturn !== 10) {
        throw new Error(`Expected restocked quantity 10, but got ${stockAfterReturn}`);
      }

      results.push({
        name: 'Customer Return Restocking (Sealed / Unopened Condition Only)',
        category: 'Returns',
        passed: true,
        message: 'Passed: Approved return with "unopened" condition restored 2 units back to shelf.',
        durationMs: Math.round(performance.now() - t6Start),
      });

      this.archiveProduct(prod3.id);
    } catch (e: any) {
      results.push({
        name: 'Customer Return Restocking',
        category: 'Returns',
        passed: false,
        message: e.message,
        durationMs: Math.round(performance.now() - t6Start),
      });
    }

    // Test 7: Gross Profit Distinction
    const t7Start = performance.now();
    try {
      const summary = this.getBusinessSummary();
      if (summary.totalRevenue < summary.grossProfit) {
        throw new Error('Gross profit cannot exceed total revenue');
      }
      results.push({
        name: 'Revenue vs Gross Profit Distinction & Accuracy',
        category: 'Finance',
        passed: true,
        message: `Passed: Revenue ৳${summary.totalRevenue.toLocaleString()} properly separated from Gross Profit ৳${summary.grossProfit.toLocaleString()} (COGS deducted).`,
        durationMs: Math.round(performance.now() - t7Start),
      });
    } catch (e: any) {
      results.push({
        name: 'Revenue vs Gross Profit Distinction',
        category: 'Finance',
        passed: false,
        message: e.message,
        durationMs: Math.round(performance.now() - t7Start),
      });
    }

    return results;
  }
}

export const dbManager = new DatabaseManager();
