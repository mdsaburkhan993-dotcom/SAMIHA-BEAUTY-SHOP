import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { DashboardView } from './components/views/DashboardView.js';
import { AiAssistantView } from './components/views/AiAssistantView.js';
import { OrdersView } from './components/views/OrdersView.js';
import { ProductsView } from './components/views/ProductsView.js';
import { InventoryView } from './components/views/InventoryView.js';
import { SalesView } from './components/views/SalesView.js';
import { TasksView } from './components/views/TasksView.js';
import { CustomersView } from './components/views/CustomersView.js';
import { SuppliersView } from './components/views/SuppliersView.js';
import { ReturnsView } from './components/views/ReturnsView.js';
import { MessagesView } from './components/views/MessagesView.js';
import { ChannelsView } from './components/views/ChannelsView.js';
import { AutomationView } from './components/views/AutomationView.js';
import { NotificationsView } from './components/views/NotificationsView.js';
import { SystemTestsView } from './components/views/SystemTestsView.js';
import { SettingsView } from './components/views/SettingsView.js';

import { NewOrderModal } from './components/modals/NewOrderModal.js';
import { NewProductModal } from './components/modals/NewProductModal.js';
import { NewTaskModal } from './components/modals/NewTaskModal.js';
import { NewCustomerModal } from './components/modals/NewCustomerModal.js';
import { NewSupplierModal } from './components/modals/NewSupplierModal.js';
import { NewReturnModal } from './components/modals/NewReturnModal.js';

import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, loading, error, notification, clearNotification, t } = useApp();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newSupplierModalOpen, setNewSupplierModalOpen] = useState(false);
  const [newReturnModalOpen, setNewReturnModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-18 right-4 z-50 max-w-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-xl shadow-lg border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : notification.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Info className="w-4 h-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={clearNotification}
              className="p-1 rounded-md hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header
        onToggleMobileNav={() => setMobileNavOpen(prev => !prev)}
        onOpenNewOrder={() => setNewOrderModalOpen(true)}
      />

      {/* App Body Layout: Sidebar + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          mobileNavOpen={mobileNavOpen}
          onCloseMobileNav={() => setMobileNavOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-8">
          {loading && !activeTab ? (
            <div className="flex items-center justify-center h-64 text-pink-600 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">{t.common.loading}</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  onOpenNewOrder={() => setNewOrderModalOpen(true)}
                  onOpenNewProduct={() => setNewProductModalOpen(true)}
                />
              )}
              {activeTab === 'aiAssistant' && <AiAssistantView />}
              {activeTab === 'orders' && (
                <OrdersView onOpenNewOrder={() => setNewOrderModalOpen(true)} />
              )}
              {activeTab === 'products' && (
                <ProductsView onOpenNewProduct={() => setNewProductModalOpen(true)} />
              )}
              {activeTab === 'inventory' && <InventoryView />}
              {activeTab === 'sales' && <SalesView />}
              {activeTab === 'reports' && <SalesView />}
              {activeTab === 'tasks' && (
                <TasksView onOpenNewTask={() => setNewTaskModalOpen(true)} />
              )}
              {activeTab === 'customers' && (
                <CustomersView onOpenNewCustomer={() => setNewCustomerModalOpen(true)} />
              )}
              {activeTab === 'suppliers' && (
                <SuppliersView onOpenNewSupplier={() => setNewSupplierModalOpen(true)} />
              )}
              {activeTab === 'returns' && (
                <ReturnsView onOpenNewReturn={() => setNewReturnModalOpen(true)} />
              )}
              {activeTab === 'messages' && <MessagesView />}
              {activeTab === 'channels' && <ChannelsView />}
              {activeTab === 'automation' && <AutomationView />}
              {activeTab === 'notifications' && <NotificationsView />}
              {activeTab === 'systemTests' && <SystemTestsView />}
              {activeTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <NewOrderModal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
      />
      <NewProductModal
        isOpen={newProductModalOpen}
        onClose={() => setNewProductModalOpen(false)}
      />
      <NewTaskModal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
      />
      <NewCustomerModal
        isOpen={newCustomerModalOpen}
        onClose={() => setNewCustomerModalOpen(false)}
      />
      <NewSupplierModal
        isOpen={newSupplierModalOpen}
        onClose={() => setNewSupplierModalOpen(false)}
      />
      <NewReturnModal
        isOpen={newReturnModalOpen}
        onClose={() => setNewReturnModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
