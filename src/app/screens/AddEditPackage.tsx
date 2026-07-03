import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackage, createPackage, updatePackage, uploadImage } from "../lib/api";
import { formatPrice } from "../lib/format";

const categories = ["Wedding", "Corporate", "Anniversary", "Birthday", "Engagement", "Conference"];

export function AddEditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [saving, setSaving] = useState(false);
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("Full Day");
  const [maxGuests, setMaxGuests] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [services, setServices] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);

  useEffect(() => {
    if (!isEdit) return;
    getPackage(Number(id))
      .then((data) => {
        setPackageName(data.packageName || "");
        setDescription(data.description || "");
        setPrice(String(Number(data.price)) || "");
        setDuration(data.duration || "Full Day");
        setMaxGuests(data.maxGuests ? String(data.maxGuests) : "");
        setCategory(data.category || "Wedding");
        setServices(data.services?.length ? data.services.map((s: any) => s.name) : [""]);
        setImages(data.images?.length ? data.images.map((i: any) => i.url) : [""]);
      })
      .catch(() => navigate("/packages"));
  }, [id]);

  const addService = () => setServices([...services, ""]);
  const removeService = (index: number) => {
    if (services.length > 1) setServices(services.filter((_, i) => i !== index));
  };
  const updateService = (index: number, value: string) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };

  const addImage = () => setImages([...images, ""]);
  const removeImage = (index: number) => {
    if (images.length > 1) setImages(images.filter((_, i) => i !== index));
  };
  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage(file, 'package');
      const updated = [...images];
      updated[index] = result.url;
      setImages(updated);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const addImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await uploadImage(file, 'package');
        setImages([...images, result.url]);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        packageName,
        description,
        price: parseFloat(price) || 0,
        duration,
        maxGuests: parseInt(maxGuests) || 0,
        category,
        services: services.filter((s) => s.trim()),
        images: images.filter((u) => u.trim()),
      };
      if (isEdit) {
        await updatePackage(Number(id), payload);
      } else {
        await createPackage(payload);
      }
      navigate("/packages");
    } catch (err) {
      console.error("Failed to save package", err);
      alert(err?.response?.data?.error || err?.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/packages")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isEdit ? "Edit Package" : "Add New Package"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? "Update package details and services" : "Create a new event package for your clients"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Basic Information</h3>
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Package Name</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Enter package name"
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this package offers..."
                    className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price (LKR)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>2 Hours</option>
                      <option>4 Hours</option>
                      <option>5 Hours</option>
                      <option>6 Hours</option>
                      <option>Full Day</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Max Guests</label>
                    <input
                      type="number"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Included Services</h3>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(index, e.target.value)}
                    placeholder="Enter service name"
                    className="flex-1 px-4 py-2.5 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={() => removeService(index)}
                    className="p-2.5 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
              <button
                onClick={addService}
                className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Package Images</h3>
            <div className="space-y-3">
              {images.map((url, index) => (
                <div key={index} className="flex items-center gap-3">
                  {url ? (
                    <div className="flex-1 flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <img src={url} alt="Preview" className="w-12 h-12 rounded object-cover" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{url.split('/').pop()}</span>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-input-background border border-input border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                    </label>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2.5 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
              <button
                onClick={addImageFromFile}
                className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="text-foreground font-medium">{formatPrice(Number(price || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground font-medium">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="text-foreground font-medium">{maxGuests || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Services</span>
                <span className="text-foreground font-medium">{services.filter(s => s).length} items</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : isEdit ? "Update Package" : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
