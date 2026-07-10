import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Image as ImageIcon, MapPin, DollarSign, Upload, Info, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { api } from '../../utils/api';

export const CreateService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    description: '',
    price: '',
    pricingModel: 'fixed',
    serviceArea: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/vendors/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newGalleryImages = [...galleryImages, ...files].slice(0, 10);
    setGalleryImages(newGalleryImages);

    newGalleryImages.forEach((file, index) => {
      if (!galleryPreviews[index]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => {
            const updated = [...prev];
            updated[index] = reader.result;
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('file', file);

    try {
      const response = await api.post('/upload', formDataImg, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl || response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.serviceName.trim()) {
      setError('Service name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setLoading(true);

    try {
      let coverImageUrl = null;
      if (coverImage) {
        coverImageUrl = await uploadImage(coverImage);
      }

      const serviceData = {
        serviceName: formData.serviceName.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryId: parseInt(formData.category),
        pricingModel: formData.pricingModel,
        serviceArea: formData.serviceArea.trim(),
        imageUrl: coverImageUrl
      };

      const response = await api.post('/vendors/services', serviceData);

      setSuccess('Service created successfully!');
      setTimeout(() => {
        navigate('/vendor/service-listing');
      }, 1500);
    } catch (err) {
      console.error('Create service error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      setError(serverMsg || err.message || 'An error occurred while creating the service. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/service-listing" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Create New Service
          </h1>
          <p className="text-slate-600">Define a new service offering to showcase to customers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button leftIcon={<Plus className="w-4 h-4"/>}>Publish Service</Button>
        </div>
      </div>

      {error && (
        <motion.div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <Input label="Service Title" placeholder="e.g. Premium Wedding Videography" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Category</label>
                <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                  <option value="" disabled selected>Select a category...</option>
                  <option value="photography">Photography & Videography</option>
                  <option value="venues">Venues & Spaces</option>
                  <option value="catering">Catering & Food</option>
                  <option value="entertainment">Entertainment & Music</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Detailed Description</label>
                <textarea 
                  rows="6" 
                  placeholder="Describe what makes this service special..."
                  className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Cover Photo</label>
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group bg-surface/30">
                  <Upload className="w-8 h-8 text-slate-500 mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm text-slate-900 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">1920x1080px (16:9) recommended</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800 flex justify-between">
                  <span>Gallery Images</span>
                  <span className="text-slate-500">0/10</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-slate-400 cursor-pointer bg-surface/30 transition-colors">
                      <Plus className="w-6 h-6 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Starting Price (Base Rate)" leftIcon={<DollarSign className="w-4 h-4"/>} placeholder="1500" type="number" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">Pricing Model</label>
                  <select className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer">
                    <option value="fixed">Fixed Package</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="custom">Custom Quote Required</option>
                  </select>
                </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Service Area (Locations)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. Los Angeles, San Diego, Orange County"
                    className="w-full bg-surface/50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Separate multiple locations with commas.</p>
              </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media & Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-textPrimary/90">Cover Photo</label>
                  <label className="w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-surface/50 cursor-pointer transition-all group bg-surface/30">
                    {coverImagePreview ? (
                      <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-textPrimary/40 mb-3 group-hover:text-primary transition-colors" />
                        <p className="text-sm text-textPrimary font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-textPrimary/40 mt-1">1920x1080px (16:9) recommended</p>
                      </>
                    )}
                    <input
                      type="file"
                      onChange={handleCoverImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-textPrimary/90 flex justify-between">
                    <span>Gallery Images</span>
                    <span className="text-textPrimary/40">{galleryImages.length}/10</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryPreviews.map((preview, i) => (
                      <div key={i} className="relative aspect-square">
                        <img src={preview} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-textPrimary hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {galleryImages.length < 10 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-white/30 cursor-pointer bg-surface/30 transition-colors">
                        <Plus className="w-6 h-6 text-textPrimary/20" />
                        <input
                          type="file"
                          multiple
                          onChange={handleGalleryImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Starting Price (Base Rate) *"
                    leftIcon={<DollarSign className="w-4 h-4"/>}
                    placeholder="1500"
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-textPrimary/90">Pricing Model</label>
                    <select
                      name="pricingModel"
                      value={formData.pricingModel}
                      onChange={handleInputChange}
                      className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      <option value="fixed">Fixed Package</option>
                      <option value="hourly">Hourly Rate</option>
                      <option value="custom">Custom Quote Required</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-textPrimary/90">Service Area (Locations)</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40" />
                    <input
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleInputChange}
                      placeholder="e.g. Los Angeles, San Diego, Orange County"
                      className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-textPrimary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-textPrimary/40 mt-1">Separate multiple locations with commas.</p>
                </div>

              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vendor/service-listing')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={<Plus className="w-4 h-4"/>}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Publish Service'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar Help/Tips */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 sticky top-24">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" /> Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-slate-800 leading-relaxed">
                <p><strong className="text-slate-900">Use High-Quality Photos:</strong> Listings with at least 5 high-resolution photos receive 60% more inquiries.</p>
                <p><strong className="text-slate-900">Be Transparent with Pricing:</strong> Even if you require custom quotes, providing a realistic "Starting at" price helps filter qualified leads.</p>
                <p><strong className="text-slate-900">Write a Clear Description:</strong> Clearly state what is included in the base rate and what costs extra.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
