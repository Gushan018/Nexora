import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Store, ShoppingBag, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Services = ({ isDashboard = false }) => {
  return (
    <div className={cn("pb-20 min-h-screen bg-background relative overflow-hidden", !isDashboard ? "pt-40" : "pt-6")}>
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Platform <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Nexora is built for three distinct types of users. Discover what our platform can do for you.
          </motion.p>
        </div>

        <div className="space-y-24 mb-24">
          
          {/* Service 1: Customers */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/2 space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <CalendarDays className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white">For Event Planners</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Whether you're planning a massive corporate gala or an intimate backyard wedding, our tools give you absolute control. Build custom itineraries, manage budgets in real-time, and hire verified vendors seamlessly.
              </p>
              <ul className="space-y-3 pt-4">
                {['Smart AI Vendor Matching', 'Real-time Budget Tracking', 'Collaborative Guest Lists'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <Zap className="w-5 h-5 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video rounded-3xl overflow-hidden bg-surface border border-white/10 p-2">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" alt="Planners" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Service 2: Vendors */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-12 items-center"
          >
            <div className="md:w-1/2 space-y-6">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-white">For Service Vendors</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Photographers, Caterers, DJs, and Decorators: scale your business with a premium digital storefront. Manage inquiries, accept secure payments, and build a verified reputation.
              </p>
              <ul className="space-y-3 pt-4">
                {['Automated Booking Calendar', 'Tiered Package Creation', 'Secure Payment Escrow'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <ShieldCheck className="w-5 h-5 text-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video rounded-3xl overflow-hidden bg-surface border border-white/10 p-2">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" alt="Vendors" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Service 3: Sellers */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/2 space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">For Product Sellers</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                List physical goods in our dedicated event marketplace. From bulk cutlery and silk linens to custom lighting rigs, reach customers exactly when they are buying for their events.
              </p>
              <ul className="space-y-3 pt-4">
                {['Inventory Stock Management', 'Integrated Shipping Tools', 'Deep Analytics Dashboard'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <HeartHandshake className="w-5 h-5 text-green-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video rounded-3xl overflow-hidden bg-surface border border-white/10 p-2">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Sellers" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
