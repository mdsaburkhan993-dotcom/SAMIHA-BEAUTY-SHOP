import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.js';
import {
  Package,
  PlusCircle,
  Search,
  AlertTriangle,
  Archive,
  Edit2,
  DollarSign,
  Tag,
  Check,
  Edit3
} from 'lucide-react';
import { Product } from '../../types/index.js';
import { EditProductModal } from '../modals/EditProductModal.js';

interface ProductsViewProps {
  onOpenNewProduct: () => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onOpenNewProduct }) => {
  const { products, t, language, archiveProduct, updateProduct } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const activeProducts = products.filter(p => !p.isArchived);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(activeProducts.map(p => p.category)))];

  const filtered = activeProducts.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameBn && p.nameBn.includes(searchTerm)) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStockSave = async (product: Product) => {
    if (tempStockValue < 0) return;
    await updateProduct(product.id, { stockQuantity: tempStockValue });
    setEditingStockId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-600" />
            <span>{t.products.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.products.subtitle} ({activeProducts.length} {language === 'bn' ? 'টি আইটেম' : 'products'})
          </p>
        </div>

        <button
          onClick={onOpenNewProduct}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.products.addProduct}</span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
              }`}
            >
              {cat === 'all' ? t.common.all : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => {
          const isLowStock = product.stockQuantity <= product.lowStockThreshold;
          const isOutOfStock = product.stockQuantity === 0;
          const profit = product.sellingPrice - product.purchasePrice;
          const margin = product.sellingPrice > 0 ? ((profit / product.sellingPrice) * 100).toFixed(0) : '0';

          return (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs hover:border-pink-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: SKU, Category, Stock Status Badge */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                    {product.sku}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    {product.category}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                  {language === 'bn' && product.nameBn ? product.nameBn : product.name}
                </h3>
                {language === 'bn' && product.nameBn && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{product.name}</p>
                )}

                {product.description && (
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price Details */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'bn' ? 'কেনা দাম' : 'Cost'}
                    </span>
                    <span className="font-semibold text-slate-700">
                      ৳{product.purchasePrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'bn' ? 'বিক্রয় মূল্য' : 'Sell Price'}
                    </span>
                    <span className="font-bold text-pink-700">
                      ৳{product.sellingPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {language === 'bn' ? 'মুনাফা' : 'Margin'}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      +{margin}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: Stock Adjust & Archive */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {editingStockId === product.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={tempStockValue}
                        onChange={e => setTempStockValue(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border border-pink-400 rounded-lg outline-hidden"
                      />
                      <button
                        onClick={() => handleStockSave(product)}
                        className="p-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                        title="Save Stock"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingStockId(product.id);
                        setTempStockValue(product.stockQuantity);
                      }}
                      className="cursor-pointer group flex items-center gap-1.5"
                      title="Click to quick-edit stock"
                    >
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-700'
                          : isLowStock
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOutOfStock ? (
                          t.products.outOfStock
                        ) : isLowStock ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            {product.stockQuantity} {t.products.lowStock}
                          </>
                        ) : (
                          `${product.stockQuantity} ${language === 'bn' ? 'মজুদ' : 'in stock'}`
                        )}
                      </span>
                      <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-pink-600 transition-colors" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setProductToEdit(product)}
                    className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                    title={language === 'bn' ? 'পণ্য সম্পাদনা' : 'Edit Product'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত এই পণ্যটি আর্কাইভ করতে চান?' : 'Archive this product?')) {
                        archiveProduct(product.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Archive Product"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        product={productToEdit}
        isOpen={!!productToEdit}
        onClose={() => setProductToEdit(null)}
      />
    </div>
  );
};
