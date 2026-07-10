import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Users, Target } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6"
=======
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          >
            Revolutionizing <span className="text-gradient">Event Management</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
<<<<<<< HEAD
            className="text-textPrimary/60 text-lg max-w-2xl mx-auto"
=======
            className="text-slate-600 text-lg max-w-2xl mx-auto"
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
          >
            Event Nest is Sri Lanka's first unified marketplace platform connecting premium event vendors, product sellers, and customers in one seamless ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface border border-slate-300 relative z-10">
              <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80" alt="Team" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
<<<<<<< HEAD
            <h3 className="text-3xl font-bold text-textPrimary">Our Mission</h3>
            <p className="text-textPrimary/70 leading-relaxed">
              We started Nexora because we saw how fragmented and stressful event planning had become. Our mission is to eliminate the chaos by bringing transparency, premium design, and verified professionals into a single, unified marketplace.
=======
            <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-700 leading-relaxed">
              We started Event Nest because we saw how fragmented and stressful event planning had become. Our mission is to eliminate the chaos by bringing transparency, premium design, and verified professionals into a single, unified marketplace.
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-4xl font-extrabold text-primary mb-2">5K+</h4>
<<<<<<< HEAD
                <p className="text-textPrimary/60 text-sm">Events Managed</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-secondary mb-2">2K+</h4>
                <p className="text-textPrimary/60 text-sm">Verified Vendors</p>
=======
                <p className="text-slate-600 text-sm">Events Managed</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-secondary mb-2">2K+</h4>
                <p className="text-slate-600 text-sm">Verified Vendors</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-16">
<<<<<<< HEAD
          <h2 className="text-3xl font-bold text-textPrimary mb-4">Core Values</h2>
=======
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Values</h2>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Star className="w-8 h-8 text-yellow-400" />, title: "Excellence", desc: "We maintain the highest standards for our platform and our vendors." },
            { icon: <Shield className="w-8 h-8 text-green-400" />, title: "Trust", desc: "Every vendor is verified to ensure a safe marketplace." },
            { icon: <Users className="w-8 h-8 text-blue-400" />, title: "Community", desc: "Building strong relationships between planners and vendors." },
            { icon: <Target className="w-8 h-8 text-red-400" />, title: "Innovation", desc: "Constantly pushing the boundaries of event technology." }
          ].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="glass-card rounded-2xl p-8 border border-slate-200 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-surface border border-slate-300 rounded-2xl flex items-center justify-center mb-6">
                {val.icon}
              </div>
<<<<<<< HEAD
              <h4 className="text-xl font-bold text-textPrimary mb-3">{val.title}</h4>
              <p className="text-textPrimary/60 text-sm">{val.desc}</p>
=======
              <h4 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h4>
              <p className="text-slate-600 text-sm">{val.desc}</p>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
