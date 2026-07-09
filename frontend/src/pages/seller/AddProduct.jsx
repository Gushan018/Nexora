import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, Upload, Tag, DollarSign, List, Layers, Save, Loader2, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
  const [loadingCategories, setLoadingCategories] = useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.productName.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Valid stock quantity is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image if file exists
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.imageUrl || uploadRes.data.url;
      }

      const productData = {
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        imageUrl: finalImageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      };

      await api.post('/products', productData);
      navigate('/seller/seller-product-management');
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <PackagePlus className="w-7 h-7 text-primary" />
            Add New Product
          </h1>
          <p className="text-textPrimary/60">List a new physical item on your marketplace storefront.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
            disabled={isLoading || loadingCategories}
            leftIcon={!isLoading && <Save className="w-4 h-4" />}
          >
            {isLoading ? 'Publishing...' : 'Publish Product'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {loadingCategories ? (
        <div className="p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-textPrimary/40">Loading categories...</p>
        </div>
      ) : (
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
                  placeholder="e.g. Premium Gold Cutlery Set (100 Pieces)"
                  leftIcon={<Tag className="w-5 h-5" />}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-textPrimary/90">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-textPrimary/90 flex items-center gap-2">
                      <List className="w-4 h-4 text-textPrimary/60" /> Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Available Stock *"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    type="number"
                    min="0"
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
                    label="Regular Price (LKR) *"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    leftIcon={<DollarSign className="w-5 h-5" />}
                    required
                  />
                </div>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <p className="text-sm text-primary font-medium flex items-center justify-between">
                    Estimated Platform Fee (5%): <span>-LKR {(parseFloat(formData.price || 0) * 0.05).toFixed(2)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Upload a clear image of your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed border-white/20 rounded-xl h-48 flex flex-col items-center justify-center bg-surface/30 hover:bg-surface/50 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden",
                    previewUrl && "border-solid border-primary/50"
                  )}
                  onClick={() => document.getElementById('product-image').click()}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-8 h-8 text-textPrimary" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setPreviewUrl('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-textPrimary hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
                    id="product-image"
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
                <CardTitle>Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-xs text-textPrimary/60 space-y-2 list-disc pl-4">
                  <li>Images should be clear and well-lit.</li>
                  <li>Max file size: 5MB</li>
                  <li>Avoid using watermarks or text on images.</li>
                  <li>Provide accurate inventory counts.</li>
                  <li>Detailed descriptions help customers decide.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </form>
  );
};
