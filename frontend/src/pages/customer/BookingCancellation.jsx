import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Calendar, Building, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const BookingCancellation = () => {
  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <div className="mb-8">
          <Link to="/customer/booking-details" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 w-fit mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Booking Details
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Request Cancellation</h1>
          <p className="text-slate-600">Booking #NXR-8492</p>
        </div>

        <Card className="border-red-500/20 mb-6">
          <CardHeader className="bg-red-500/5 border-b border-red-500/10">
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Cancellation Policy Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm text-slate-800">
            <p>
              You are requesting to cancel a confirmed booking with <strong className="text-slate-900">Lumiere Photography</strong> scheduled for <strong className="text-slate-900">Oct 14, 2026</strong>.
            </p>
            
            <div className="bg-surface/50 border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Total Booking Value:</span>
                <span className="font-bold text-slate-900">LKR 3,200.00</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900">LKR 640.00 (Deposit)</span>
              </div>
              <div className="flex justify-between text-red-400 font-bold pt-2 border-t border-slate-200">
                <span>Estimated Refund:</span>
                <span>LKR 0.00 (Non-refundable deposit)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              According to the vendor's policy, deposits are non-refundable if cancelled within 90 days of the event. Exceptions may apply for extenuating circumstances at the vendor's discretion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-800">Reason for Cancellation</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-500/50 transition-colors cursor-pointer"
              >
                <option value="" disabled>Select a reason...</option>
                <option value="date_change">Event Date Changed</option>
                <option value="budget">Budget Constraints</option>
                <option value="found_other">Found Another Vendor</option>
                <option value="event_cancelled">Event Cancelled Entirely</option>
                <option value="other">Other / Personal Reasons</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-800">Message to Vendor</label>
              <textarea 
                rows="4" 
                placeholder="Provide any additional context for the vendor. This is especially important if you are requesting a refund exception." 
                className="w-full bg-surface border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-400 text-red-500 focus:ring-red-500/50 cursor-pointer" 
                />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                I understand that this action will formally cancel my booking and release the date back to the vendor. I have reviewed the refund estimation above.
              </span>
            </label>

            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-slate-900 border-none" 
              disabled={!reason || !isConfirmed}
            >
              Confirm Cancellation
            </Button>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
