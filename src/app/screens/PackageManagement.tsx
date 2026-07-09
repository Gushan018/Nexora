import { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPackages, deletePackage } from "../lib/api";
import { formatPrice } from "../lib/format";

const categories = ["All", "Wedding", "Corporate", "Anniversary", "Birthday"];

export function PackageManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const data = await getPackages();
      setPackages(
        data.map((p: any) => ({
          id: p.packageId,
          name: p.packageName,
          category: p.category || "Other",
          price: Number(p.price),
          duration: p.duration || "",
          guests: p.maxGuests || 0,
          image: p.images?.[0]?.url || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePackage(id);
      fetchPackages();
    } catch (err) {
      console.error("Failed to delete package", err);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Package Management</h1>
          <p className="text-muted-foreground">Manage your event packages and services</p>
        </div>
        <Link
          to="/packages/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Package
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading packages...</div>
        ) : filteredPackages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No packages found</div>
        ) : filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all group">
            <div className="h-48 bg-muted flex items-center justify-center relative overflow-hidden">
              {pkg.image ? (
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              )}
              <span className="absolute top-3 right-3 px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full border border-primary/30">
                {pkg.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2">{pkg.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                <span className="text-sm text-muted-foreground">{pkg.duration}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Up to {pkg.guests} guests</span>
                <div className="flex gap-2">
                  <Link
                    to={`/packages/edit/${pkg.id}`}
                    className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-foreground" />
                  </Link>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
