import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, Calendar, Users, MapPin, DollarSign, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

export const BookingApproval = () => {
  const [isApproved, setIsApproved] = useState(false);

  if (isApproved) {
    return (
      <div className="pt-24 pb-20 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="container mx-auto px-6 max-w-lg text-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Request Approved!</h1>
          <p className="text-slate-600 mb-8">
            The booking has been confirmed and added to your calendar. A payment link for the deposit has been automatically dispatched to the customer.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/vendor/booking-management">
              <Button variant="outline">View All Bookings</Button>
            </Link>
            <Link to="/vendor/vendor-booking-calendar">
              <Button>View Calendar</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/vendor/incoming-requests" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Inbox
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Approve Booking</h1>
          <p className="text-slate-600">Review details and finalize the quote before accepting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Left Col: Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Sarah Jenkins</h3>
                  <p className="text-sm text-slate-500">Request ID: REQ-9921</p>
                </div>
                <div className="text-right">
                  <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                    Premium Full Day
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-surface/50 p-4 rounded-xl border border-slate-200">
                  <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Date</p>
                    <p className="text-sm text-slate-900 font-medium">Saturday, Oct 14, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface/50 p-4 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Location</p>
                    <p className="text-sm text-slate-900 font-medium">Grand Azure Resort, Malibu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface/50 p-4 rounded-xl border border-slate-200">
                  <Users className="w-5 h-5 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Guest Count</p>
                    <p className="text-sm text-slate-900 font-medium">150 Guests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-surface/50 p-4 rounded-xl border border-slate-200">
                  <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Event Type</p>
                    <p className="text-sm text-slate-900 font-medium">Wedding Reception</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">Customer Notes</label>
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 italic">
                  "We loved your portfolio! We are looking for lots of candid shots and drone coverage of the venue. The venue requires a certificate of insurance, which I assume you have."
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message to Customer (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                rows="4" 
                placeholder="Add a personal note along with the approval..."
                className="w-full bg-surface/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                defaultValue="Hi Sarah! I'm thrilled to capture your big day at Grand Azure. I've added a travel fee for the Malibu location as per my policies. I will send over the COI to your venue coordinator next week."
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Quote Editor & Action */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle>Finalize Quote</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Base Package</span>
                  <span className="font-medium text-slate-900">LKR 3,200.00</span>
                </div>
                
                {/* Editable Add-on */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-800">Add Travel Fee / Custom Charge</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Travel Fee" 
                      defaultValue="Travel Fee (Malibu)"
                      className="w-2/3 bg-surface/50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50"
                    />
                    <div className="relative w-1/3">
                      <DollarSign className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="number" 
                        defaultValue="150"
                        className="w-full bg-surface/50 border border-slate-300 rounded-lg pl-6 pr-2 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-slate-900">Total Quote</span>
                    <span className="text-xl font-bold text-slate-900">LKR 3,350.00</span>
                  </div>
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-primary font-medium">Deposit to Collect (20%)</span>
                    <span className="text-primary font-bold">LKR 670.00</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-slate-900 border-none h-12" 
            leftIcon={<CheckCircle2 className="w-5 h-5"/>}
            onClick={() => setIsApproved(true)}
          >
            Approve & Send Payment Link
          </Button>

          <Button 
            variant="outline" 
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20" 
            leftIcon={<XCircle className="w-4 h-4"/>}
          >
            Decline Request
          </Button>
        </div>

      </div>
    </div>
  );
};

