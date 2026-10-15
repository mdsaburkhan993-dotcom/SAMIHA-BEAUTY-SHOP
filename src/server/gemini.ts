import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { dbManager } from './db.js';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const businessTools: FunctionDeclaration[] = [
  {
    name: 'get_business_summary',
    description: 'Fetch real-time sales overview, today sales, total revenue, gross profit, and pending order counts for SAMIHA BEAUTY SHOP.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        includeTopProducts: {
          type: Type.BOOLEAN,
          description: 'Whether to include top selling products list.',
        },
      },
    },
  },
  {
    name: 'get_low_stock_products',
    description: 'Fetch products that are below their low-stock threshold and need re-ordering from suppliers.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        thresholdLimit: {
          type: Type.NUMBER,
          description: 'Optional custom stock threshold.',
        },
      },
    },
  },
  {
    name: 'get_orders_by_status',
    description: 'Fetch list of orders filtered by status (e.g., pending, confirmed, shipped, delivered, cancelled).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          description: 'Filter by: pending, confirmed, processing, shipped, delivered, or cancelled',
        },
      },
    },
  },
  {
    name: 'get_tasks_list',
    description: 'Fetch the personal and business task planner list with completion status.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        completed: {
          type: Type.BOOLEAN,
          description: 'Filter by completed (true) or pending (false) tasks',
        },
      },
    },
  },
  {
    name: 'search_product_catalog',
    description: 'Search for cosmetics products in the catalog by name, category, or SKU.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Keyword, category, or product name',
        },
      },
      required: ['query'],
    },
  },
];

export async function processChatWithGemini(
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  language: 'bn' | 'en' = 'bn'
): Promise<{
  reply: string;
  toolsUsed: Array<{ toolName: string; resultSummary: string }>;
}> {
  const ai = getGenAI();
  const toolsUsed: Array<{ toolName: string; resultSummary: string }> = [];

  const systemInstruction = `You are "SAMIHA AI", the executive personal assistant and intelligent business manager for SAMIHA BEAUTY SHOP (সামিহা বিউটি শপ).
You assist the shop owner with:
1. Answering business questions accurately using real data (e.g., sales, stock, orders, profit).
2. Managing daily tasks, operational priorities, and beauty shop customer relations.
3. Communication in both Bengali (বাংলা) and English seamlessly. If the user asks in Bengali, respond in clear, professional, warm, and natural Bengali. If the user asks in English, reply in English.
4. Crucial rule: NEVER fabricate or hallucinate sales figures, orders, stock counts, or profits. Always utilize your tools to get actual data.
5. If the user asks about deleting records, refunds, or consequential actions, give clear instructions and remind them that confirmation is required in the dashboard.
6. Display amounts with ৳ (Taka/BDT) symbol when discussing money.`;

  if (!ai) {
    // If no API key configured, use local intelligent grounded assistant fallback
    return processLocalGroundedAssistant(userMessage, language);
  }

  try {
    // Convert history
    const contents: any[] = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        tools: [{ functionDeclarations: businessTools }],
      },
    });

    // Check for tool calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolCallResults: any[] = [];

      for (const fc of response.functionCalls) {
        const fnName = fc.name;
        const args = (fc.args as any) || {};

        let toolResultData: any = null;

        if (fnName === 'get_business_summary') {
          const summary = dbManager.getBusinessSummary();
          toolResultData = {
            todaySales: summary.todaySales,
            totalRevenue: summary.totalRevenue,
            grossProfit: summary.grossProfit,
            pendingOrdersCount: summary.pendingOrdersCount,
            lowStockCount: summary.lowStockCount,
            top5Selling: summary.top5Selling.map(s => ({
              product: s.product.name,
              unitsSold: s.unitsSold,
              revenue: s.totalRevenue,
            })),
          };
          toolsUsed.push({
            toolName: 'get_business_summary',
            resultSummary: `Today sales: ৳${summary.todaySales}, Gross profit: ৳${summary.grossProfit}, Pending orders: ${summary.pendingOrdersCount}`,
          });
        } else if (fnName === 'get_low_stock_products') {
          const summary = dbManager.getBusinessSummary();
          toolResultData = summary.lowStockProducts.map(p => ({
            name: p.name,
            sku: p.sku,
            currentStock: p.stockQuantity,
            threshold: p.lowStockThreshold,
          }));
          toolsUsed.push({
            toolName: 'get_low_stock_products',
            resultSummary: `Found ${summary.lowStockProducts.length} low stock products`,
          });
        } else if (fnName === 'get_orders_by_status') {
          const allOrders = dbManager.getOrders();
          const filtered = args.status
            ? allOrders.filter(o => o.orderStatus === args.status)
            : allOrders;
          toolResultData = filtered.slice(0, 10).map(o => ({
            orderNumber: o.orderNumber,
            customer: o.customerName,
            status: o.orderStatus,
            total: o.totalAmount,
            paymentStatus: o.paymentStatus,
          }));
          toolsUsed.push({
            toolName: 'get_orders_by_status',
            resultSummary: `Retrieved ${filtered.length} orders (status: ${args.status || 'all'})`,
          });
        } else if (fnName === 'get_tasks_list') {
          const allTasks = dbManager.getTasks();
          const filtered = args.completed !== undefined
            ? allTasks.filter(t => t.isCompleted === args.completed)
            : allTasks;
          toolResultData = filtered.map(t => ({
            title: t.title,
            priority: t.priority,
            isCompleted: t.isCompleted,
            dueDate: t.dueDate,
          }));
          toolsUsed.push({
            toolName: 'get_tasks_list',
            resultSummary: `Retrieved ${filtered.length} tasks`,
          });
        } else if (fnName === 'search_product_catalog') {
          const query = (args.query || '').toLowerCase();
          const matches = dbManager.getProducts().filter(p =>
            !p.isArchived &&
            (p.name.toLowerCase().includes(query) ||
             (p.nameBn && p.nameBn.includes(query)) ||
             p.category.toLowerCase().includes(query) ||
             p.sku.toLowerCase().includes(query))
          );
          toolResultData = matches.map(p => ({
            name: p.name,
            sku: p.sku,
            category: p.category,
            sellingPrice: p.sellingPrice,
            stockQuantity: p.stockQuantity,
          }));
          toolsUsed.push({
            toolName: 'search_product_catalog',
            resultSummary: `Found ${matches.length} matching products for "${args.query}"`,
          });
        }

        toolCallResults.push({
          toolCallId: fc.id || fnName,
          result: toolResultData,
        });
      }

      // Second turn with tool results
      const followupContents = [
        ...contents,
        response.candidates?.[0]?.content,
        {
          role: 'user',
          parts: [
            {
              text: `Here are the verified real-time database results:\n${JSON.stringify(toolCallResults, null, 2)}\n\nPlease summarize the answers clearly for the shop owner in ${language === 'bn' ? 'Bengali' : 'English'}.`,
            },
          ],
        },
      ];

      const followupResponse = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: followupContents,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return {
        reply: followupResponse.text || 'তথ্য প্রস্তুত করা হয়েছে।',
        toolsUsed,
      };
    }

    return {
      reply: response.text || 'আপনার অনুরোধ সফলভাবে প্রসেস করা হয়েছে।',
      toolsUsed,
    };
  } catch (error: any) {
    console.error('Gemini API call failed, activating graceful fallback:', error);
    // If quota reached or connection failure, provide fallback grounded response
    return processLocalGroundedAssistant(userMessage, language);
  }
}

// Deterministic grounded response handler if API quota is reached
function processLocalGroundedAssistant(
  userMessage: string,
  language: 'bn' | 'en'
): { reply: string; toolsUsed: Array<{ toolName: string; resultSummary: string }> } {
  const lower = userMessage.toLowerCase();
  const summary = dbManager.getBusinessSummary();
  const toolsUsed: Array<{ toolName: string; resultSummary: string }> = [];

  // 1. Sales today / কত বিক্রি
  if (lower.includes('বিক্রি') || lower.includes('sales') || lower.includes('বিক্রয়') || lower.includes('আজ')) {
    toolsUsed.push({
      toolName: 'get_business_summary',
      resultSummary: `Today sales: ৳${summary.todaySales}`,
    });

    if (language === 'bn') {
      return {
        reply: `📊 **আজকের বিক্রয় রিপোর্ট:**\n\n- আজ সর্বমোট বিক্রি হয়েছে: **৳${summary.todaySales.toLocaleString()}**\n- মোট রাজস্ব (Total Revenue): **৳${summary.totalRevenue.toLocaleString()}**\n- মোট লাভ (Gross Profit): **৳${summary.grossProfit.toLocaleString()}** (প্রফিট মার্জিন: ${summary.profitMarginPercent}%)\n- অপেক্ষমাণ পেন্ডিং অর্ডার: **${summary.pendingOrdersCount}টি**।\n\nআপনি চাইলে ড্যাশবোর্ডের "অর্ডারসমূহ" পেজে গিয়ে বিস্তারিত দেখতে পারেন।`,
        toolsUsed,
      };
    } else {
      return {
        reply: `📊 **Today's Sales Report:**\n\n- Sales recorded today: **৳${summary.todaySales.toLocaleString()}**\n- Total lifetime revenue: **৳${summary.totalRevenue.toLocaleString()}**\n- Realized Gross Profit: **৳${summary.grossProfit.toLocaleString()}** (Margin: ${summary.profitMarginPercent}%)\n- Pending orders waiting confirmation: **${summary.pendingOrdersCount}**.\n\nYou can review full line items in the Orders tab.`,
        toolsUsed,
      };
    }
  }

  // 2. Stock low / স্টক কম
  if (lower.includes('স্টক') || lower.includes('stock') || lower.includes('মজুদ')) {
    toolsUsed.push({
      toolName: 'get_low_stock_products',
      resultSummary: `${summary.lowStockProducts.length} low stock products found`,
    });

    if (summary.lowStockProducts.length === 0) {
      return {
        reply: language === 'bn'
          ? '✅ মাশাল্লাহ, এই মুহূর্তে কোনো পণ্যের স্টক সতর্কতার নিচে নেই। সব পণ্যের পর্যাপ্ত মজুদ রয়েছে।'
          : '✅ All products currently maintain adequate inventory above warning thresholds.',
        toolsUsed,
      };
    }

    const listStr = summary.lowStockProducts
      .map(p => `• **${p.name}** (SKU: ${p.sku}) — বর্তমানে স্টকে আছে: **${p.stockQuantity}টি** (সতর্কতা সীমা: ${p.lowStockThreshold})`)
      .join('\n');

    if (language === 'bn') {
      return {
        reply: `⚠️ **স্বল্প মজুদের পণ্য তালিকা (Low Stock Alert):**\n\n${listStr}\n\nসাপ্লায়ারদের সাথে যোগাযোগ করে দ্রুত নতুন স্টক অর্ডার করার পরামর্শ দেওয়া হচ্ছে।`,
        toolsUsed,
      };
    } else {
      return {
        reply: `⚠️ **Low Stock Alert Items:**\n\n${listStr}\n\nWe recommend initiating purchase orders with suppliers for these items.`,
        toolsUsed,
      };
    }
  }

  // 3. Top products / সেরা পণ্য
  if (lower.includes('top') || lower.includes('সেরা') || lower.includes('জনপ্রিয়') || lower.includes('best')) {
    toolsUsed.push({
      toolName: 'get_business_summary',
      resultSummary: `Top 5 products fetched`,
    });

    const topList = summary.top5Selling
      .map((s, idx) => `${idx + 1}. **${s.product.name}** — মোট বিক্রি: **${s.unitsSold}টি** (রাজস্ব: ৳${s.totalRevenue.toLocaleString()})`)
      .join('\n');

    if (language === 'bn') {
      return {
        reply: `🏆 **সামিহা বিউটি শপের শীর্ষ ৫টি বিক্রিত পণ্য:**\n\n${topList}\n\nএই পণ্যগুলো সবচেয়ে বেশি কাস্টমারদের পছন্দের তালিকায় রয়েছে।`,
        toolsUsed,
      };
    } else {
      return {
        reply: `🏆 **SAMIHA BEAUTY SHOP — Top 5 Best-Selling Products:**\n\n${topList}\n\nThese represent your shop's strongest customer demand items.`,
        toolsUsed,
      };
    }
  }

  // 4. Tasks / পরিকল্পনা / কাজ
  if (lower.includes('টাস্ক') || lower.includes('কাজ') || lower.includes('task') || lower.includes('plan')) {
    const tasks = dbManager.getTasks().filter(t => !t.isCompleted);
    toolsUsed.push({
      toolName: 'get_tasks_list',
      resultSummary: `${tasks.length} pending tasks`,
    });

    const taskList = tasks
      .map((t, idx) => `${idx + 1}. [${t.priority.toUpperCase()}] **${t.title}**${t.dueDate ? ` (তারিখ: ${t.dueDate})` : ''}`)
      .join('\n');

    if (language === 'bn') {
      return {
        reply: `📋 **আজকের জন্য অপেক্ষমাণ কাজসমূহ:**\n\n${taskList}\n\nকোনো টাস্ক সম্পন্ন হলে টাস্ক ম্যানেজারে গিয়ে টিক চিহ্ন দিন।`,
        toolsUsed,
      };
    } else {
      return {
        reply: `📋 **Current Pending Tasks:**\n\n${taskList}\n\nYou can manage or check them off in the Tasks tab.`,
        toolsUsed,
      };
    }
  }

  // General helpful response
  if (language === 'bn') {
    return {
      reply: `নমস্কার / আসসালামু আলাইকুম! আমি **সামিহা এআই**—আপনার ব্যক্তিগত সহকারী ও বিউটি শপ ম্যানেজার।\n\nআমি আপনার দোকানের আসল ডাটাবেস থেকে যেকোনো তথ্য বিশ্লেষণ করতে পারি:\n1. 💰 **বিক্রয় হিসাব:** "আজ কত বিক্রি হয়েছে?" বা "সর্বমোট লাভ কত?"\n2. 📦 **ইনভেন্টরি:** "কোন পণ্যের স্টক কম আছে?"\n3. 🏆 **শীর্ষ পণ্য:** "Top 5 selling products দেখাও"\n4. 📝 **পরিকল্পনা:** "আজকের জরুরি কাজগুলো কি কি?"\n\nআপনি কী জানতে চান বলুন?`,
      toolsUsed,
    };
  } else {
    return {
      reply: `Hello! I am **SAMIHA AI**—your personal business assistant & manager for SAMIHA BEAUTY SHOP.\n\nI can analyze your live store database:\n1. 💰 **Sales & Profit:** "How much did we sell today?" or "What is our gross profit?"\n2. 📦 **Inventory:** "Which products are running low on stock?"\n3. 🏆 **Top Sellers:** "Show me top 5 best-selling products"\n4. 📝 **Planner:** "What are my priority tasks for today?"\n\nHow can I help you today?`,
      toolsUsed,
    };
  }
}
