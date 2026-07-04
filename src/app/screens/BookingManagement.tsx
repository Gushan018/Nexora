import { useState, useEffect } from "react";
import { ArrowLeft, Search, Eye, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getVendorBookings, updateBookingStatus } from "../lib/api";

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING": return "bg-[var(--status-pending)]/10 text-[var(--status-pending)] border-[var(--status-pending)]/20";
    case "ACCEPTED": return "bg-[var(--status-accepted)]/10 text-[var(--status-accepted)] border-[var(--status-accepted)]/20";
    case "REJECTED": return "bg-[var(--status-rejected)]/10 text-[var(--status-rejected)] border-[var(--status-rejected)]/20";
    case "COMPLETED": return "bg-[var(--status-completed)]/10 text-[var(--status-completed)] border-[var(--status-completed)]/20";
    case "CANCELLED": return "bg-muted text-foreground border-border";
    default: return "bg-muted text-foreground border-border";
  }
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending", ACCEPTED: "Accepted", REJECTED: "Rejected", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

export function BookingManagement() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => { getVendorBookings().then(setBookings).catch(() => {}); }, []);

  const handleAccept = async (id: number) => {
    try { await updateBookingStatus(id, 'ACCEPTED'); setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: 'ACCEPTED' } : b)); } catch {}
  };

  const handleReject = async (id: number) => {
    try { await updateBookingStatus(id, 'REJECTED'); setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: 'REJECTED' } : b)); } catch {}
  };

  const filteredBookings = bookings.filter((booking: any) => {
    const name = booking.customer?.name || '';
    const pkg = booking.service?.serviceName || booking.package?.packageName || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Management</h1>
        <p className="text-muted-foreground">Manage and track all event bookings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${statusFilter === status ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
              {statusLabels[status] || status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Service/Package</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Event Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-sm text-muted-foreground text-center">No bookings found</td></tr>
              )}
              {filteredBookings.map((booking: any) => (
                <tr key={booking.bookingId} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{booking.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{booking.service?.serviceName || booking.package?.packageName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(booking.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{booking.location || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/bookings/${booking.bookingId}`} className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-foreground" />
                      </Link>
                      {booking.status === "PENDING" && (
                        <>
                          <button onClick={() => handleAccept(booking.bookingId)} className="p-2 bg-[var(--status-accepted)]/10 hover:bg-[var(--status-accepted)]/20 rounded-lg transition-colors" title="Accept">
                            <Check className="w-4 h-4 text-[var(--status-accepted)]" />
                          </button>
                          <button onClick={() => handleReject(booking.bookingId)} className="p-2 bg-[var(--status-rejected)]/10 hover:bg-[var(--status-rejected)]/20 rounded-lg transition-colors" title="Reject">
                            <X className="w-4 h-4 text-[var(--status-rejected)]" />
                          </button>
                        </>
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
