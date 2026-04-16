'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  items: MenuItem[];
}

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [showAddItem, setShowAddItem] = useState<number | null>(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem & { category_id: number } | null>(null);

  const { register: regItem, handleSubmit: handleItemSubmit, reset: resetItem } = useForm<Omit<MenuItem, 'id'>>();
  const { register: regCat, handleSubmit: handleCatSubmit, reset: resetCat } = useForm<{ name: string; description: string }>();
  const { register: regEdit, handleSubmit: handleEditSubmit, reset: resetEdit, setValue: setEditValue } = useForm<Omit<MenuItem, 'id'>>();

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addCategory = async (data: { name: string; description: string }) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'category', ...data }),
      });
      const cat = await res.json();
      setCategories(prev => [...prev, { ...cat, items: [] }]);
      toast.success('Category added');
      resetCat();
      setShowAddCat(false);
    } catch { toast.error('Failed'); }
  };

  const addItem = async (data: Omit<MenuItem, 'id'>, categoryId: number) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', category_id: categoryId, ...data, price: Number(data.price) }),
      });
      const item = await res.json();
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, items: [...(c.items || []), item] } : c));
      toast.success('Item added');
      resetItem();
      setShowAddItem(null);
    } catch { toast.error('Failed'); }
  };

  const openEdit = (item: MenuItem, categoryId: number) => {
    setEditingItem({ ...item, category_id: categoryId });
    setEditValue('name', item.name);
    setEditValue('description', item.description || '');
    setEditValue('price', item.price);
    setEditValue('is_vegetarian', item.is_vegetarian);
    setEditValue('is_available', item.is_available);
    setEditValue('image_url', item.image_url || '');
  };

  const saveEdit = async (data: Omit<MenuItem, 'id'>) => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', ...data, price: Number(data.price) }),
      });
      const updated = await res.json();
      setCategories(prev => prev.map(c => c.id === editingItem.category_id
        ? { ...c, items: (c.items || []).map(i => i.id === editingItem.id ? updated : i) }
        : c
      ));
      toast.success('Item updated');
      setEditingItem(null);
      resetEdit();
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (itemId: number, catId: number) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await fetch(`/api/menu/${itemId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'item' }) });
      setCategories(prev => prev.map(c => c.id === catId ? { ...c, items: (c.items || []).filter(i => i.id !== itemId) } : c));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Menu</h1>
          <p className="text-white/40 text-sm">Manage categories and menu items</p>
        </div>
        <button onClick={() => setShowAddCat(true)} className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 glass-card rounded-xl shimmer" />)}</div>
      ) : (
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card rounded-2xl overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/2" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                <div className="flex items-center gap-3">
                  {expandedCat === cat.id ? <ChevronDown size={18} className="text-[#C9A84C]" /> : <ChevronRight size={18} className="text-white/40" />}
                  <h3 className="text-white font-semibold">{cat.name}</h3>
                  <span className="text-white/40 text-sm">{(cat.items || []).length} items</span>
                </div>
                <button onClick={e => { e.stopPropagation(); setShowAddItem(cat.id); }} className="flex items-center gap-1.5 text-[#C9A84C] text-xs border border-[#C9A84C]/30 px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10">
                  <Plus size={12} /> Add Item
                </button>
              </div>

              {/* Items list */}
              {expandedCat === cat.id && (
                <div className="border-t border-white/10">
                  {(!cat.items || cat.items.length === 0) ? (
                    <div className="px-6 py-4 text-white/30 text-sm">No items yet</div>
                  ) : (
                    cat.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/5 last:border-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{item.name}</span>
                            {item.is_vegetarian && <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded-full">V</span>}
                            {!item.is_available && <span className="text-red-400 text-xs bg-red-400/10 px-2 py-0.5 rounded-full">Unavailable</span>}
                          </div>
                          {item.description && <p className="text-white/40 text-xs truncate mt-0.5">{item.description}</p>}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[#C9A84C] text-sm font-semibold">KES {Number(item.price).toLocaleString()}</span>
                          <button onClick={() => openEdit(item, cat.id)} className="text-white/40 hover:text-[#C9A84C]"><Edit2 size={14} /></button>
                          <button onClick={() => deleteItem(item.id, cat.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCat && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Add Category</h3>
              <button onClick={() => { setShowAddCat(false); resetCat(); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCatSubmit(addCategory)} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Category Name *</label>
                <input {...regCat('name', { required: true })} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Description</label>
                <input {...regCat('description')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1 py-3 rounded-xl text-sm font-semibold">Add</button>
                <button type="button" onClick={() => { setShowAddCat(false); resetCat(); }} className="border border-white/20 px-5 py-3 rounded-xl text-white/60 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Add Menu Item</h3>
              <button onClick={() => { setShowAddItem(null); resetItem(); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleItemSubmit(data => addItem(data, showAddItem))} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Item Name *</label>
                <input {...regItem('name', { required: true })} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Description</label>
                <textarea {...regItem('description')} rows={2} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Price (KES) *</label>
                  <input {...regItem('price', { required: true, min: 0 })} type="number" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Image URL</label>
                  <input {...regItem('image_url')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20" placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input {...regItem('is_vegetarian')} type="checkbox" className="accent-[#C9A84C]" />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input {...regItem('is_available')} type="checkbox" defaultChecked className="accent-[#C9A84C]" />
                  Available
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1 py-3 rounded-xl text-sm font-semibold">Add Item</button>
                <button type="button" onClick={() => { setShowAddItem(null); resetItem(); }} className="border border-white/20 px-5 py-3 rounded-xl text-white/60 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Edit: {editingItem.name}</h3>
              <button onClick={() => { setEditingItem(null); resetEdit(); }} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit(saveEdit)} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Name</label>
                <input {...regEdit('name')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Description</label>
                <textarea {...regEdit('description')} rows={2} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Price (KES)</label>
                  <input {...regEdit('price')} type="number" className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Image URL</label>
                  <input {...regEdit('image_url')} className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-white/20" placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input {...regEdit('is_vegetarian')} type="checkbox" className="accent-[#C9A84C]" />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input {...regEdit('is_available')} type="checkbox" className="accent-[#C9A84C]" />
                  Available
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1 py-3 rounded-xl text-sm font-semibold">Save Changes</button>
                <button type="button" onClick={() => { setEditingItem(null); resetEdit(); }} className="border border-white/20 px-5 py-3 rounded-xl text-white/60 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
