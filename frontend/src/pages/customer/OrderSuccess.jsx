import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Receipt, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

export const OrderSuccess = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-white/60 max-w-md">
            Thank you for your payment. Your booking has been successfully processed and the vendor has been notified.
          </p>
        </motion.div>

        <Card className="mb-8 border-primary/20 bg-surface/50 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">Booking Reference</span>
                <span className="font-mono text-lg font-bold text-white">#NXR-8492-771</span>
              </div>
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4"/>}>Invoice</Button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Grand Azure Resort</h3>
                  <p className="text-sm text-white/60">Full Day Access • Standard Package</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Date & Time
                  </div>
                  <p className="text-sm font-medium text-white">Oct 14, 2026</p>
                  <p className="text-sm text-white/60">10:00 AM - 11:00 PM</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </div>
                  <p className="text-sm font-medium text-white">Malibu, CA</p>
                  <p className="text-sm text-primary hover:underline cursor-pointer">Get Directions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/customer/order-history" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">View My Bookings</Button>
          </Link>
          <Link to="/customer/event-dashboard" className="w-full sm:w-auto">
            <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4"/>}>Return to Event Dashboard</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
