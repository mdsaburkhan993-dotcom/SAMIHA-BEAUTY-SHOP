import { Router, Request, Response } from 'express';
import { dbManager } from './db.js';
import { processChatWithGemini } from './gemini.js';
import { UserProfile } from '../types/index.js';

export const apiRouter = Router();

// Current User Profile
const CURRENT_USER: UserProfile = {
  id: 'usr-admin-1',
  name: 'Md Sabur Khan (Admin)',
  email: 'mdsaburkhan993@gmail.com',
  role: 'admin',
  shopName: 'SAMIHA BEAUTY SHOP',
};

// Middleware: Authenticate & check RBAC
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  res.json({
    user: CURRENT_USER,
    status: 'authenticated',
    mode: 'secure_local_storage',
    cloudFirestoreReady: true,
  });
});

// Business Summary
apiRouter.get('/business/summary', (req: Request, res: Response) => {
  try {
    const summary = dbManager.getBusinessSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Products CRUD ---
apiRouter.get('/products', (req: Request, res: Response) => {
  try {
    const products = dbManager.getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/products', (req: Request, res: Response) => {
  try {
    const newProduct = dbManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const success = dbManager.archiveProduct(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Orders CRUD & Stock State Transitions ---
apiRouter.get('/orders', (req: Request, res: Response) => {
  try {
    const orders = dbManager.getOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const newOrder = dbManager.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updatedOrder = dbManager.updateOrderStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Customers ---
apiRouter.get('/customers', (req: Request, res: Response) => {
  try {
    const customers = dbManager.getCustomers();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/customers', (req: Request, res: Response) => {
  try {
    const customer = dbManager.addCustomer(req.body);
    res.status(201).json(customer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/customers/:id', (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateCustomer(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Suppliers ---
apiRouter.get('/suppliers', (req: Request, res: Response) => {
  try {
    const suppliers = dbManager.getSuppliers();
    res.json(suppliers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/suppliers', (req: Request, res: Response) => {
  try {
    const supplier = dbManager.addSupplier(req.body);
    res.status(201).json(supplier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Returns ---
apiRouter.get('/returns', (req: Request, res: Response) => {
  try {
    const returns = dbManager.getReturns();
    res.json(returns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/returns', (req: Request, res: Response) => {
  try {
    const returnRecord = dbManager.createReturn(req.body);
    res.status(201).json(returnRecord);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/returns/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = dbManager.updateReturnStatus(req.params.id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Tasks & Planner ---
apiRouter.get('/tasks', (req: Request, res: Response) => {
  try {
    const tasks = dbManager.getTasks();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/tasks', (req: Request, res: Response) => {
  try {
    const task = dbManager.addTask(req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/tasks/:id', (req: Request, res: Response) => {
  try {
    const success = dbManager.deleteTask(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Channels & Messaging ---
apiRouter.get('/channels', (req: Request, res: Response) => {
  try {
    const channels = dbManager.getChannels();
    res.json(channels);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/channels/:id', (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateChannel(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/messages', (req: Request, res: Response) => {
  try {
    const messages = dbManager.getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/messages/:id/reply', (req: Request, res: Response) => {
  try {
    const { replyText } = req.body;
    const msg = dbManager.replyMessage(req.params.id, replyText);
    res.json(msg);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- AI Assistant Chat ---
apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const result = await processChatWithGemini(message, history || [], language || 'bn');
    res.json(result);
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    res.status(500).json({
      error: 'AI service encountered an issue. Please try again.',
      details: err.message,
    });
  }
});

// --- Automated Tests Runner ---
apiRouter.get('/tests/run', (req: Request, res: Response) => {
  try {
    const testResults = dbManager.runAutomatedTests();
    const allPassed = testResults.every(t => t.passed);
    res.json({
      allPassed,
      total: testResults.length,
      passedCount: testResults.filter(t => t.passed).length,
      results: testResults,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CSV Report Export ---
apiRouter.get('/export/sales-csv', (req: Request, res: Response) => {
  try {
    const orders = dbManager.getOrders();
    const rows = [
      ['Order ID', 'Order Number', 'Date', 'Customer Name', 'Phone', 'Total (BDT)', 'Payment Status', 'Order Status'],
    ];

    orders.forEach(o => {
      rows.push([
        o.id,
        o.orderNumber,
        o.createdAt.slice(0, 10),
        `"${o.customerName.replace(/"/g, '""')}"`,
        o.customerPhone,
        o.totalAmount.toString(),
        o.paymentStatus,
        o.orderStatus,
      ]);
    });

    const csvContent = rows.map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="samiha_beauty_sales_report.csv"');
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
