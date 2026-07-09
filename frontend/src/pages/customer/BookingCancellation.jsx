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
          <Link to="/customer/booking-details" className="text-sm text-textPrimary/60 hover:text-textPrimary flex items-center gap-1 w-fit mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Booking Details
          </Link>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Request Cancellation</h1>
          <p className="text-textPrimary/60">Booking #NXR-8492</p>
        </div>

        <Card className="border-red-500/20 mb-6">
          <CardHeader className="bg-red-500/5 border-b border-red-500/10">
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Cancellation Policy Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm text-textPrimary/80">
            <p>
              You are requesting to cancel a confirmed booking with <strong className="text-textPrimary">Lumiere Photography</strong> scheduled for <strong className="text-textPrimary">Oct 14, 2026</strong>.
            </p>
            
            <div className="bg-surface/50 border border-white/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Total Booking Value:</span>
                <span className="font-bold text-textPrimary">LKR 3,200.00</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-textPrimary">LKR 640.00 (Deposit)</span>
              </div>
              <div className="flex justify-between text-red-400 font-bold pt-2 border-t border-white/5">
                <span>Estimated Refund:</span>
                <span>LKR 0.00 (Non-refundable deposit)</span>
              </div>
            </div>

            <p className="text-xs text-textPrimary/50 italic">
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
              <label className="text-sm font-medium text-textPrimary/80">Reason for Cancellation</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-red-500/50 transition-colors cursor-pointer"
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
              <label className="text-sm font-medium text-textPrimary/80">Message to Vendor</label>
              <textarea 
                rows="4" 
                placeholder="Provide any additional context for the vendor. This is especially important if you are requesting a refund exception." 
                className="w-full bg-surface border border-white/10 rounded-xl p-4 text-textPrimary focus:outline-none focus:border-red-500/50 transition-colors resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-red-500 focus:ring-red-500/50 cursor-pointer" 
                />
              </div>
              <span className="text-sm text-textPrimary/60 group-hover:text-textPrimary/80 transition-colors">
                I understand that this action will formally cancel my booking and release the date back to the vendor. I have reviewed the refund estimation above.
              </span>
            </label>

            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-textPrimary border-none" 
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
