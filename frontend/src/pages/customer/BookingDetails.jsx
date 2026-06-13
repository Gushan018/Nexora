import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Download, CheckCircle2, AlertCircle, XCircle, ChevronLeft, Building, User, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const BookingDetails = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/customer/order-history" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to History
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Booking #NXR-8492
          </h1>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>Placed on Oct 01, 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4"/>}>Invoice</Button>
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
                <div className="flex-1 bg-surface/50 rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white/40 mb-1">Date & Time</h4>
                      <p className="text-white font-bold">Saturday, Oct 14, 2026</p>
                      <p className="text-white/60 text-sm">10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-white/5">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white/40 mb-1">Location</h4>
                      <p className="text-white font-bold">Grand Azure Resort</p>
                      <p className="text-white/60 text-sm">123 Coastal Highway<br/>Malibu, CA 90265</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-surface/50 rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white/40 mb-1">Point of Contact</h4>
                      <p className="text-white font-bold">Sarah Jenkins</p>
                      <p className="text-white/60 text-sm">+1 (555) 123-4567<br/>sarah.j@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-white/5">
                    <Building className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white/40 mb-1">Event Type</h4>
                      <p className="text-white font-bold">Wedding Reception</p>
                      <p className="text-white/60 text-sm">150 Expected Guests</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white">Additional Notes for Vendor</h4>
                <div className="bg-white/5 p-4 rounded-xl text-sm text-white/70 italic border border-white/5">
                  "Please ensure the string quartet is set up on the west terrace by 3:00 PM. We will have 3 guests with severe peanut allergies, please cross-reference with the catering team."
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
                  <tr className="border-b border-white/5 text-sm font-medium text-white/40 bg-white/[0.02]">
                    <th className="p-4 pl-6">Item</th>
                    <th className="p-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-white">Full Day Venue Access</p>
                      <p className="text-white/50 text-xs mt-1">Includes grand ballroom and west terrace.</p>
                    </td>
                    <td className="p-4 text-right text-white">$4,000.00</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-white">String Quartet Add-on</p>
                      <p className="text-white/50 text-xs mt-1">2 hours during ceremony and cocktail hour.</p>
                    </td>
                    <td className="p-4 text-right text-white">$500.00</td>
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
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">$4,500.00</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Service Fee (5%)</span>
                  <span className="text-white">$225.00</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Taxes</span>
                  <span className="text-white">$315.00</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="text-xl font-bold text-white">$5,040.00</span>
                </div>
                <div className="flex justify-between items-end text-sm">
                  <span className="text-white/60">Paid to date</span>
                  <span className="text-green-400 font-medium">-$5,040.00</span>
                </div>
                <div className="flex justify-between items-end text-sm pt-2 border-t border-white/5">
                  <span className="font-bold text-white">Balance Due</span>
                  <span className="text-white font-bold">$0.00</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Visa ending in 4242</p>
                  <p className="text-xs text-white/50">Processed on Oct 01, 2026</p>
                </div>
              </div>

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
