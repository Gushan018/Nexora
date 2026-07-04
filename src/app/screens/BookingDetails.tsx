import { useState, useEffect } from "react";
import { ArrowLeft, Check, X, MapPin, Calendar, Users, Phone, Mail, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById, updateBookingStatus } from "../lib/api";

const statusLabels: Record<string, string> = {
  PENDING: "Pending", ACCEPTED: "Accepted", REJECTED: "Rejected", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

export function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (id) getBookingById(Number(id)).then(setBooking).catch(() => navigate("/bookings"));
  }, [id]);

  const handleAction = async (status: string) => {
    if (!id) return;
    try {
      await updateBookingStatus(Number(id), status);
      setBooking((prev: any) => ({ ...prev, status }));
    } catch {}
  };

  if (!booking) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  const initials = (booking.customer?.name || 'NA').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const packageName = booking.package?.packageName || booking.service?.serviceName || 'N/A';
  const packagePrice = booking.package?.price || booking.service?.price || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <button onClick={() => navigate("/bookings")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Details</h1>
        <p className="text-muted-foreground">View and manage booking information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">{initials}</div>
                <div>
                  <h4 className="font-medium text-foreground">{booking.customer?.name || 'N/A'}</h4>
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 bg-muted text-foreground border-border">
                    {statusLabels[booking.status] || booking.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{booking.customer?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{booking.customer?.contactNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
            <div className="space-y-3">
              {booking.status === "PENDING" && (
                <>
                  <button onClick={() => handleAction('ACCEPTED')} className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--status-accepted)]/10 text-[var(--status-accepted)] rounded-lg font-medium hover:bg-[var(--status-accepted)]/20 transition-colors border border-[var(--status-accepted)]/20">
                    <Check className="w-5 h-5" /> Accept Booking
                  </button>
                  <button onClick={() => handleAction('REJECTED')} className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--status-rejected)]/10 text-[var(--status-rejected)] rounded-lg font-medium hover:bg-[var(--status-rejected)]/20 transition-colors border border-[var(--status-rejected)]/20">
                    <X className="w-5 h-5" /> Reject Booking
                  </button>
                </>
              )}
              {booking.status === "ACCEPTED" && (
                <button onClick={() => handleAction('COMPLETED')} className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--status-completed)]/10 text-[var(--status-completed)] rounded-lg font-medium hover:bg-[var(--status-completed)]/20 transition-colors border border-[var(--status-completed)]/20">
                  <Check className="w-5 h-5" /> Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Event Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Event Date</p>
                  <p className="text-sm font-medium text-foreground">{new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{booking.location || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Package Information</h3>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{packageName}</p>
                <p className="text-sm text-muted-foreground">{booking.package?.category || booking.service?.serviceName || 'Standard'}</p>
              </div>
              <span className="text-lg font-bold text-primary">Rs. {Number(packagePrice).toLocaleString()}</span>
            </div>
          </div>

          {booking.payment && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Info</h3>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{booking.payment.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Bank Slip'}</p>
                  <p className="text-sm text-muted-foreground">Status: {booking.payment.status}</p>
                </div>
                <span className="text-lg font-bold text-primary">Rs. {Number(booking.payment.amount).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
