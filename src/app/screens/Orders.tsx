import { useState, useEffect } from "react";
import { ArrowLeft, Search, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVendorOrders, updateOrderStatus } from "../lib/api";

const statusColors: Record<string, string> = {
  DELIVERED: "text-[var(--status-accepted)] bg-[var(--status-accepted)]/10 border-[var(--status-accepted)]/20",
  PROCESSING: "text-[var(--status-pending)] bg-[var(--status-pending)]/10 border-[var(--status-pending)]/20",
  SHIPPED: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  PENDING: "text-muted-foreground bg-muted border-border",
  CANCELLED: "text-[var(--status-rejected)] bg-[var(--status-rejected)]/10 border-[var(--status-rejected)]/20",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const vendorActions = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getVendorOrders();
      setOrders(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch {
      // silent
    }
  };

  const filteredOrders = orders.filter((o: any) => {
    const customerName = o.customer?.name || '';
    const orderId = `ORD-${o.orderId}`;
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <span>Status: {statusFilter === "All" ? "All" : statusLabels[statusFilter] || statusFilter}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {["All", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${statusFilter === s ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  {s === "All" ? "All" : statusLabels[s] || s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /></td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-sm text-muted-foreground text-center">No orders found</td></tr>
              ) : filteredOrders.map((order: any) => (
                <tr key={order.orderId} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{`ORD-${order.orderId}`}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.orderItems?.map((i: any) => i.product?.productName).filter(Boolean).join(', ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    Rs. {Number(order.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {order.status === "PENDING" && (
                        <button onClick={() => handleStatusUpdate(order.orderId, 'PROCESSING')} className="px-2 py-1 text-xs font-medium bg-[var(--status-pending)]/10 text-[var(--status-pending)] rounded border border-[var(--status-pending)]/20 hover:bg-[var(--status-pending)]/20 transition-colors">
                          Process
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button onClick={() => handleStatusUpdate(order.orderId, 'SHIPPED')} className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                          Ship
                        </button>
                      )}
                      {order.status === "SHIPPED" && (
                        <button onClick={() => handleStatusUpdate(order.orderId, 'DELIVERED')} className="px-2 py-1 text-xs font-medium bg-[var(--status-accepted)]/10 text-[var(--status-accepted)] rounded border border-[var(--status-accepted)]/20 hover:bg-[var(--status-accepted)]/20 transition-colors">
                          Deliver
                        </button>
                      )}
                      {!["DELIVERED", "CANCELLED"].includes(order.status) && (
                        <button onClick={() => handleStatusUpdate(order.orderId, 'CANCELLED')} className="px-2 py-1 text-xs font-medium bg-[var(--status-rejected)]/10 text-[var(--status-rejected)] rounded border border-[var(--status-rejected)]/20 hover:bg-[var(--status-rejected)]/20 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
