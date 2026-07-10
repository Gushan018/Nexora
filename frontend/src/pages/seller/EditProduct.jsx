import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, X, Tag, List, Layers, DollarSign, Upload, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProduct = () => {
<<<<<<< HEAD
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    categoryId: '',
    quantity: '',
    price: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data;
        setFormData({
          productName: product.productName,
          description: product.description || '',
          categoryId: product.categoryId?.toString() || '',
          quantity: product.quantity.toString(),
          price: product.price.toString(),
          imageUrl: product.imageUrl || ''
        });
        setPreviewUrl(product.imageUrl || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product details');
        navigate('/seller/seller-product-management');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image if a new file is selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url;
      }

      const productData = {
        ...formData,
        imageUrl: finalImageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      };

      await api.put(`/products/${id}`, productData);
      alert('Product updated successfully!');
      navigate('/seller/seller-product-management');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-textPrimary/60">Loading product details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
          <h1 className="text-2xl font-bold text-textPrimary">Edit Product</h1>
          <p className="text-textPrimary/60">Update details for #PRD-{id}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 sm:flex-none"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 sm:flex-none" 
            isLoading={isSaving}
            leftIcon={!isSaving && <Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input 
                label="Product Name" 
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Premium Gold Cutlery Set" 
                leftIcon={<Tag className="w-5 h-5" />}
                required
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textPrimary/90">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6" 
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Describe your product in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-textPrimary/90 flex items-center gap-2">
                    <List className="w-4 h-4 text-textPrimary/60" /> Category
                  </label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <Input 
                  label="Available Stock" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  type="number"
                  placeholder="0" 
                  leftIcon={<Layers className="w-5 h-5" />}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="Regular Price (LKR)" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="0.00" 
                  leftIcon={<DollarSign className="w-5 h-5" />}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={cn(
                  "border-2 border-dashed border-white/20 rounded-xl h-48 flex flex-col items-center justify-center bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden",
                  previewUrl && "border-solid border-primary/50"
                )}
                onClick={() => document.getElementById('product-image-edit').click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-textPrimary" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <Upload className="w-6 h-6 text-textPrimary/40 group-hover:text-primary" />
                    </div>
                    <p className="text-sm text-textPrimary/60 font-medium text-center px-4">Click to upload image</p>
                  </>
                )}
                <input 
                  id="product-image-edit"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textPrimary/40 uppercase font-bold tracking-wider mb-2">Product Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-textPrimary font-medium">Active</span>
                </div>
                <p className="text-[10px] text-textPrimary/40 mt-2">This product is live and visible to customers.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
=======
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
        <p className="text-slate-600">Update your preferences and details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Make sure your data is up to date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-800">First Name</label>
              <input type="text" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-800">Last Name</label>
              <input type="text" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-800">Email Address</label>
            <input type="email" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-800">Description</label>
            <textarea rows="4" className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-primary"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-4 border-t border-slate-200">
            <Button variant="outline">Cancel</Button>
            <Button leftIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
  );
};
