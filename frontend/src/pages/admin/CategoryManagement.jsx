import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit2, Trash2, CheckCircle2, RefreshCcw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';

export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCat(cat);
    setCategoryName(cat.categoryName);
    setIsEditing(true);
  };

  const handleStartAdd = () => {
    setSelectedCat(null);
    setCategoryName('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;
    setSaving(true);
    try {
      if (isEditing && selectedCat) {
        await api.put(`/categories/${selectedCat.categoryId}`, { categoryName: categoryName.trim() });
      } else {
        await api.post('/categories', { categoryName: categoryName.trim() });
      }
      setCategoryName('');
      setSelectedCat(null);
      setIsEditing(false);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const [catToDelete, setCatToDelete] = useState(null);

  const handleDelete = async (cat) => {
    try {
      await api.delete(`/categories/${cat.categoryId}`);
      if (selectedCat?.categoryId === cat.categoryId) {
        setSelectedCat(null);
        setCategoryName('');
        setIsEditing(false);
      }
      setCatToDelete(null);
      showToast(`Category "${cat.categoryName}" deleted.`, 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error deleting category', 'error');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Taxonomy & Category Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage real service categories stored in the database.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<RefreshCcw className="w-4 h-4"/>} onClick={fetchCategories}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Category List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..." 
                  className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors" 
                />
              </div>
            </div>

            <div className="p-4 space-y-3">
              {loading ? (
                <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading categories...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No categories found in the database.
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div 
                    key={cat.categoryId} 
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{cat.categoryName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Category ID: CAT-{cat.categoryId}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSelectCategory(cat)}
                        leftIcon={<Edit2 className="w-3.5 h-3.5"/>}
                      >
                        Edit
                      </Button>
                      <button 
                        onClick={() => setCatToDelete(cat)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Category Form */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</CardTitle>
              <CardDescription>
                {isEditing ? `Modifying Category #${selectedCat?.categoryId}` : 'Add a new category to the database.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Category Name</label>
                <input 
                  type="text" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Catering & Dining" 
                  className="w-full bg-light-surface dark:bg-surface border border-slate-300 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={saving || !categoryName.trim()} 
                  onClick={handleSave}
                  leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
                >
                  {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={handleStartAdd}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={() => catToDelete && handleDelete(catToDelete)}
        title="Delete Category"
        message={`Are you sure you want to delete category "${catToDelete?.categoryName}"?`}
        confirmText="Delete Category"
        isDanger={true}
      />
    </div>
  );
};
