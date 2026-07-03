import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Globe, Facebook, Instagram, Twitter, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, uploadImage } from "../lib/api";

export function CompanyProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    registrationNumber: "",
    establishedYear: "",
    description: "",
    email: "",
    contactNumber: "",
    address: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    website: "",
    bannerImage: "",
    logoImage: "",
    location: "",
    vendorType: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          businessName: data.businessName || "",
          registrationNumber: data.registrationNumber || "",
          establishedYear: data.establishedYear ? String(data.establishedYear) : "",
          description: data.description || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          socialFacebook: data.socialFacebook || "",
          socialInstagram: data.socialInstagram || "",
          socialTwitter: data.socialTwitter || "",
          website: data.website || "",
          bannerImage: data.bannerImage || "",
          logoImage: data.logoImage || "",
          location: data.location || "",
          vendorType: data.vendorType || "",
        });
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        businessName: form.businessName,
        registrationNumber: form.registrationNumber,
        establishedYear: form.establishedYear,
        description: form.description,
        email: form.email,
        contactNumber: form.contactNumber,
        address: form.address,
        location: form.location,
        socialFacebook: form.socialFacebook,
        socialInstagram: form.socialInstagram,
        socialTwitter: form.socialTwitter,
        website: form.website,
        bannerImage: form.bannerImage,
        logoImage: form.logoImage,
        vendorType: form.vendorType,
      });
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage(file, 'banner');
      setForm((prev) => ({ ...prev, bannerImage: result.url }));
      await updateProfile({ ...form, bannerImage: result.url });
      setMessage({ type: 'success', text: 'Banner updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Banner upload failed.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage(file, 'logo');
      setForm((prev) => ({ ...prev, logoImage: result.url }));
      await updateProfile({ ...form, logoImage: result.url });
      setMessage({ type: 'success', text: 'Logo updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Logo upload failed.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information and branding</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div
            className="h-48 bg-gradient-to-r from-primary/30 to-primary/5 relative"
            style={form.bannerImage ? { backgroundImage: `url(${form.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <label className="absolute bottom-4 right-4 p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <Camera className="w-5 h-5 text-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
            </label>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
              <div className="w-32 h-32 rounded-xl bg-muted border-4 border-card flex items-center justify-center relative overflow-hidden">
                {form.logoImage ? (
                  <img src={form.logoImage} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary">E</span>
                )}
                <label className="absolute bottom-2 right-2 p-1.5 bg-card border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Camera className="w-4 h-4 text-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
              <div className="pt-16 sm:pt-0">
                <h2 className="text-2xl font-bold text-foreground">{form.businessName || "Your Company"}</h2>
                <p className="text-muted-foreground">{form.description?.slice(0, 60) || "Event Management Company"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Business Information</h3>
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={handleChange('businessName')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={form.registrationNumber}
                    onChange={handleChange('registrationNumber')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Established Year</label>
                  <input
                    type="text"
                    value={form.establishedYear}
                    onChange={handleChange('establishedYear')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={handleChange('description')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={handleChange('contactNumber')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={handleChange('address')}
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Social Media Links</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Facebook className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={form.socialFacebook}
                    onChange={handleChange('socialFacebook')}
                    className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Instagram className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={form.socialInstagram}
                    onChange={handleChange('socialInstagram')}
                    className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Twitter className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={form.socialTwitter}
                    onChange={handleChange('socialTwitter')}
                    className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={form.website}
                    onChange={handleChange('website')}
                    className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {message && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {message.text}
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
