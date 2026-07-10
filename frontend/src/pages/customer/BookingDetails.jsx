import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Download, CheckCircle2, AlertCircle, XCircle, ChevronLeft, Building, User, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';

export const BookingDetails = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return res.data;
    }
  });

  const booking = bookings.find(b => b.bookingId === parseInt(bookingId));

  if (isLoading) return <PageLoader text="Loading booking details..." />;
  
  if (!booking) {
    return (
<<<<<<< HEAD
      <div className="text-center text-textPrimary/60 py-20">
=======
      <div className="text-center text-slate-600 py-20">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        Booking not found.
        <br/>
        <Link to="/customer/event-dashboard" className="text-primary hover:underline mt-4 inline-block">Return to My Events</Link>
      </div>
    );
  }

  const name = booking.service?.serviceName || booking.package?.packageName || 'Event Booking';
  const type = booking.service?.category?.name || 'Event';
  const amount = Number(booking.service?.price || booking.package?.price || 0);
  const vendorName = booking.service?.vendor?.businessName || booking.package?.vendor?.businessName || 'Unknown Vendor';
  const contactName = vendorName; // Usually the business name or we can use vendorName
  const contactEmail = booking.service?.vendor?.email || booking.package?.vendor?.email || 'vendor@example.com';
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/customer/event-dashboard" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to My Events
          </Link>
<<<<<<< HEAD
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            Booking #NXR-{booking.bookingId}
          </h1>
          <div className="flex items-center gap-2 text-sm text-textPrimary/60">
=======
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Booking #NXR-{booking.bookingId}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-600">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            <span>Placed on {new Date(booking.bookingDate).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
              {booking.status === 'ACCEPTED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />} 
              <span className={booking.status === 'PENDING' ? 'text-yellow-400' : ''}>{booking.status}</span>
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {booking.status === 'ACCEPTED' && <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Invoice</Button>}
          <Button variant="primary">Contact Vendor</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 bg-surface/50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
<<<<<<< HEAD
                      <h4 className="text-sm font-medium text-textPrimary/40 mb-1">Date & Time</h4>
                      <p className="text-textPrimary font-bold">{new Date(booking.eventDate).toLocaleDateString()}</p>
                      <p className="text-textPrimary/60 text-sm">Time TBD</p>
=======
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Date & Time</h4>
                      <p className="text-slate-900 font-bold">{new Date(booking.eventDate).toLocaleDateString()}</p>
                      <p className="text-slate-600 text-sm">Time TBD</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
<<<<<<< HEAD
                      <h4 className="text-sm font-medium text-textPrimary/40 mb-1">Location</h4>
                      <p className="text-textPrimary font-bold">{booking.location || 'Location Not Specified'}</p>
=======
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Location</h4>
                      <p className="text-slate-900 font-bold">{booking.location || 'Location Not Specified'}</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-surface/50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
<<<<<<< HEAD
                      <h4 className="text-sm font-medium text-textPrimary/40 mb-1">Point of Contact</h4>
                      <p className="text-textPrimary font-bold">{contactName}</p>
                      <p className="text-textPrimary/60 text-sm">{vendorName}<br/>{contactEmail}</p>
=======
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Point of Contact</h4>
                      <p className="text-slate-900 font-bold">{contactName}</p>
                      <p className="text-slate-600 text-sm">{vendorName}<br/>{contactEmail}</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                    <Building className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
<<<<<<< HEAD
                      <h4 className="text-sm font-medium text-textPrimary/40 mb-1">Event Type</h4>
                      <p className="text-textPrimary font-bold">{type}</p>
                      <p className="text-textPrimary/60 text-sm">{name}</p>
=======
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Event Type</h4>
                      <p className="text-slate-900 font-bold">{type}</p>
                      <p className="text-slate-600 text-sm">{name}</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
<<<<<<< HEAD
                <h4 className="font-bold text-textPrimary">Additional Notes for Vendor</h4>
                <div className="bg-white/5 p-4 rounded-xl text-sm text-textPrimary/70 italic border border-white/5">
=======
                <h4 className="font-bold text-slate-900">Additional Notes for Vendor</h4>
                <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-700 italic border border-slate-200">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  "{booking.notes || 'No notes provided during booking.'}"
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
<<<<<<< HEAD
                  <tr className="border-b border-white/5 text-sm font-medium text-textPrimary/40 bg-white/[0.02]">
=======
                  <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 bg-slate-50">
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                    <th className="p-4 pl-6">Item</th>
                    <th className="p-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
<<<<<<< HEAD
                      <p className="font-bold text-textPrimary">{name}</p>
                      <p className="text-textPrimary/50 text-xs mt-1">Primary booked service.</p>
                    </td>
                    <td className="p-4 text-right text-textPrimary">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
=======
                      <p className="font-bold text-slate-900">{name}</p>
                      <p className="text-slate-500 text-xs mt-1">Primary booked service.</p>
                    </td>
                    <td className="p-4 text-right text-slate-900">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3 text-sm">
<<<<<<< HEAD
                <div className="flex justify-between text-textPrimary/60">
                  <span>Subtotal</span>
                  <span className="text-textPrimary">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-textPrimary/60">
                  <span>Service Fee (5%)</span>
                  <span className="text-textPrimary">LKR {(amount * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
=======
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee (5%)</span>
                  <span className="text-slate-900">LKR {(amount * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 space-y-2">
                <div className="flex justify-between items-end">
<<<<<<< HEAD
                  <span className="font-bold text-textPrimary">Total Amount</span>
                  <span className="text-xl font-bold text-textPrimary">LKR {(amount * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
=======
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-xl font-bold text-slate-900">LKR {(amount * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                </div>
              </div>

              {booking.status === 'PENDING' ? (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                  Payment will be required only after the vendor approves this booking request.
                </div>
              ) : booking.status === 'ACCEPTED' ? (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm mb-3">Your booking has been approved. Please complete the payment to finalize.</p>
                  <Link to={`/customer/payment-page?bookingId=${booking.bookingId}&amount=${amount * 1.05}&item=Booking`}>
                    <Button className="w-full">Pay Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="text-sm font-bold text-textPrimary">Payment Completed</p>
=======
                    <p className="text-sm font-bold text-slate-900">Payment Completed</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20" leftIcon={<XCircle className="w-4 h-4"/>}>
              Request Cancellation
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

