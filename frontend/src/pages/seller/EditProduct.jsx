import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, X, Tag, Layers, DollarSign, Upload, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api, getImageUrl } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
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
    const loadProductAndCategories = async () => {
      try {
        setIsFetching(true);
        setError('');

        // Fetch categories
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        // Fetch user products to locate this item
        const myProdRes = await api.get('/products/my-products');
        const existing = myProdRes.data.find(p => p.productId === parseInt(id));

        if (existing) {
          setFormData({
            productName: existing.productName || '',
            description: existing.description || '',
            categoryId: existing.categoryId ? existing.categoryId.toString() : '',
            quantity: existing.quantity !== undefined ? existing.quantity.toString() : '0',
            price: existing.price !== undefined ? existing.price.toString() : '0',
            imageUrl: existing.imageUrl || ''
          });

          if (existing.imageUrl) {
            setPreviewUrl(getImageUrl(existing.imageUrl));
          }
        } else {
          setError('Product not found in your inventory.');
        }
      } catch (err) {
        console.error('Error loading product for edit:', err);
        setError('Failed to load product details.');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadProductAndCategories();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productName.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Valid stock quantity is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await api.post('/upload', uploadData);
        finalImageUrl = uploadRes.data.imageUrl || uploadRes.data.fileUrl || uploadRes.data.url;
      }

      const updatePayload = {
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        imageUrl: finalImageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      };

      await api.put(`/products/${id}`, updatePayload);
      navigate('/seller/seller-product-management');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/seller/seller-product-management')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Management
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Edit Product #{id}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Update pricing, inventory, and product details.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => navigate('/seller/seller-product-management')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
            disabled={isLoading}
            leftIcon={!isLoading && <Save className="w-4 h-4" />}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-500 flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <button type="button" onClick={() => setError('')}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Product Name *"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                leftIcon={<Tag className="w-5 h-5" />}
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-800 dark:text-white/90">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-light-surface dark:bg-surface/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-800 dark:text-white/90">Description</label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-light-surface dark:bg-surface/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-slate-400"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Available Stock *"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  type="number"
                  min="0"
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
                  label="Regular Price (LKR) *"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
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
              <CardDescription>Update image if needed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl h-48 flex flex-col items-center justify-center bg-surface/30 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden",
                  previewUrl && "border-solid border-primary/50"
                )}
                onClick={() => document.getElementById('edit-product-image').click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium text-center px-4">Click to upload image</p>
                  </>
                )}
                <input
                  id="edit-product-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="pt-2 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">Or enter Image URL directly:</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      setPreviewUrl(e.target.value);
                    }
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-light-surface dark:bg-surface/50 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
