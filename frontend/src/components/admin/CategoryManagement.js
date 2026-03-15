import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Tags, 
  Layers, Package, ChevronRight, 
  PlusCircle, X, Check
} from 'lucide-react';

const CategoryManagement = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editCat, setEditCat] = useState({ name: '', description: '' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddCategory(newCat);
    setNewCat({ name: '', description: '' });
    setIsAdding(false);
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditCat({ name: cat.name, description: cat.description });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateCategory(editingId, editCat);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Taxonomy Control</h3>
          <p className="text-sm font-medium text-gray-500">Manage platform clothing categories and classification</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} /> Add Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Form Card */}
        {isAdding && (
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-black text-indigo-900">New Category</h4>
                <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-indigo-100 rounded-lg text-indigo-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-1.5 ml-1">Name</label>
                  <input 
                    autoFocus
                    required
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    placeholder="e.g. Streetwear"
                    className="w-full px-4 py-3 bg-white border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold text-gray-800 text-sm shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-1.5 ml-1">Description</label>
                  <textarea 
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                    placeholder="Brief definition..."
                    className="w-full px-4 py-3 bg-white border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-gray-800 text-sm shadow-sm transition-all h-24 resize-none"
                  />
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                  Confirm Addition
                </button>
              </form>
            </div>
            {/* Background Blob */}
            <div className="absolute -bottom-12 -right-12 h-48 w-48 bg-indigo-200/50 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* Existing Categories */}
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 group hover:shadow-xl hover:shadow-gray-100 transition-all flex flex-col justify-between">
            {editingId === cat.id ? (
              <form onSubmit={handleEditSubmit} className="space-y-4 h-full">
                 <input 
                    autoFocus
                    required
                    value={editCat.name}
                    onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-indigo-100 rounded-xl outline-none font-bold text-gray-900 text-lg"
                  />
                  <textarea 
                    value={editCat.description}
                    onChange={(e) => setEditCat({ ...editCat, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-indigo-100 rounded-xl outline-none font-medium text-gray-600 text-sm h-24 resize-none"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                  </div>
              </form>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <Layers size={20} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => onDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{cat.name}</h4>
                  <p className="text-sm font-medium text-gray-500 line-clamp-3 leading-relaxed mb-6">
                    {cat.description || 'No description provided for this category.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Package size={12} /> Live Inventory
                  </span>
                  <ChevronRight size={16} className="text-gray-200" />
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && !isAdding && (
          <div className="col-span-full py-40 text-center">
            <Tags size={64} className="mx-auto text-gray-100 mb-6" />
            <h4 className="text-xl font-bold text-gray-300">No categories defined yet</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
