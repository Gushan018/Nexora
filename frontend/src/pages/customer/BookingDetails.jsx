import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Download, CheckCircle2, AlertCircle, XCircle, ChevronLeft, Building, User, CreditCard, Printer, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { PageLoader } from '../../components/common/PageLoader';
import { useAuth } from '../../context/AuthContext';

export const BookingDetails = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const { user } = useAuth();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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
      <div className="text-center text-slate-600 dark:text-slate-400 py-20">
        Booking not found.
        <br/>
        <Link to="/customer/event-dashboard" className="text-primary hover:underline mt-4 inline-block">Return to My Events</Link>
      </div>
    );
  }

  const name = booking.service?.serviceName || booking.package?.packageName || 'Event Booking';
  const type = booking.service?.category?.name || booking.package?.category || 'Event Service';
  const amount = Number(booking.service?.price || booking.package?.price || 0);
  const serviceFee = amount * 0.05;
  const totalAmount = amount + serviceFee;
  
  const vendorName = booking.service?.vendor?.businessName || booking.package?.vendor?.businessName || 'Event Vendor';
  const contactEmail = booking.service?.vendor?.email || booking.package?.vendor?.email || 'vendor@eventnest.lk';

  const isPaid = !!booking.payment || booking.status === 'COMPLETED' || booking.paymentStatus === 'COMPLETED' || booking.paymentStatus === 'PAID';

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900 dark:text-slate-100 pb-12">
      
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/customer/event-dashboard" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to My Events
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Booking #NXR-{booking.bookingId}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Placed on {new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">
              {booking.status === 'ACCEPTED' || booking.status === 'COMPLETED' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              )} 
              <span className={booking.status === 'PENDING' ? 'text-amber-500' : 'text-emerald-500'}>{booking.status}</span>
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            leftIcon={<Download className="w-4 h-4"/>}
            onClick={() => setIsInvoiceOpen(true)}
          >
            View Invoice
          </Button>
          <a href={`mailto:${contactEmail}`}>
            <Button variant="primary">Contact Vendor</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date & Time</h4>
                      <p className="text-slate-900 dark:text-white font-bold">{new Date(booking.eventDate || Date.now()).toLocaleDateString()}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Scheduled Event</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h4>
                      <p className="text-slate-900 dark:text-white font-bold">{booking.location || 'Location Not Specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Point of Contact</h4>
                      <p className="text-slate-900 dark:text-white font-bold">{vendorName}</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                    <Building className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Event Service</h4>
                      <p className="text-slate-900 dark:text-white font-bold">{type}</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Additional Notes</h4>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 italic border border-slate-200 dark:border-white/10">
                  "{booking.notes || 'No special requirements provided during booking.'}"
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Package Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                    <th className="p-4 pl-6">Item Description</th>
                    <th className="p-4 text-right pr-6">Price</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-200 dark:divide-white/10">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Booked Service Package from {vendorName}</p>
                    </td>
                    <td className="p-4 text-right pr-6 font-bold text-slate-900 dark:text-white">
                      LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151D2F]">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform Escrow Fee (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">LKR {serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">LKR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {booking.status === 'PENDING' ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium">
                  ⏳ Payment will be required only after the vendor approves this booking request.
                </div>
              ) : (booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED') && !isPaid ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-700 dark:text-amber-300 text-sm mb-3 font-semibold">
                    ✓ Vendor approved! Click Pay Now to complete payment and lock in your date.
                  </p>
                  <Link to={`/customer/payment-page?bookingId=${booking.bookingId}&amount=${totalAmount}&item=${encodeURIComponent('Booking: ' + name)}`}>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none">
                      Pay Now (LKR {totalAmount.toLocaleString()})
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Payment Completed</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Funds safely held in Escrow</p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:bg-red-500/10 border-red-500/30 justify-center" 
            leftIcon={<XCircle className="w-4 h-4"/>}
            onClick={() => alert('Cancellation request submitted. The vendor will process your request.')}
          >
            Request Cancellation
          </Button>
        </div>

      </div>

      {/* Invoice Modal */}
      <Modal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title="Official Tax Invoice">
        <div className="space-y-6 text-slate-900 dark:text-slate-100 p-2">
          
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">EVENT NEST PLATFORM</h3>
              <p className="text-xs text-slate-500">Official Booking Tax Invoice</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-amber-500">#INV-2026-{booking.bookingId}</span>
              <p className="text-xs text-slate-500">Date: {new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10">
              <p className="font-semibold text-slate-500 mb-1">BILLED FROM (VENDOR):</p>
              <p className="font-bold text-slate-900 dark:text-white">{vendorName}</p>
              <p className="text-slate-500">{contactEmail}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10">
              <p className="font-semibold text-slate-500 mb-1">BILLED TO (CUSTOMER):</p>
              <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'Valued Customer'}</p>
              <p className="text-slate-500">{user?.email || 'customer@eventnest.lk'}</p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800">
                <th className="p-2.5">Item Description</th>
                <th className="p-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-2.5 font-medium">{name} ({type})</td>
                <td className="p-2.5 text-right font-bold">LKR {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <td className="p-2.5 text-slate-500">Platform Escrow Fee (5%)</td>
                <td className="p-2.5 text-right font-bold">LKR {serviceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-amber-500/10 font-bold text-slate-900 dark:text-white">
                <td className="p-2.5 text-sm">TOTAL AMOUNT PAID</td>
                <td className="p-2.5 text-right text-sm text-amber-600 dark:text-amber-400">LKR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Escrow Protected & Verified
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsInvoiceOpen(false)}>Close</Button>
              <Button size="sm" className="bg-amber-500 text-slate-950 font-bold" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrintInvoice}>
                Print Invoice
              </Button>
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
};
