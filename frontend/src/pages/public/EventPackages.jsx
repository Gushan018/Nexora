import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

const PACKAGES = [
  {
    id: 1,
    name: 'Basic Elegance',
    price: '$2,500',
    description: 'Perfect for intimate gatherings and small parties.',
    features: [
      'Up to 50 guests',
      'Basic venue decoration',
      'Standard catering menu',
      '4 hours photography',
      'Event coordination'
    ],
    popular: false
  },
  {
    id: 2,
    name: 'Premium Gala',
    price: '$7,800',
    description: 'Our most popular package for weddings and corporate events.',
    features: [
      'Up to 200 guests',
      'Premium floral arrangements',
      'Gourmet 3-course catering',
      'Full day photo & video',
      'DJ & Lighting setup',
      'Dedicated event manager'
    ],
    popular: true
  },
  {
    id: 3,
    name: 'Luxury Platinum',
    price: '$15,000+',
    description: 'Bespoke event planning with no limits on creativity.',
    features: [
      'Unlimited guests capability',
      'Custom luxury venue design',
      'Michelin-star catering options',
      'Celebrity entertainment booking',
      'VIP concierge services',
      'Multi-day event support'
    ],
    popular: false
  }
];

export const EventPackages = () => {
  return (
    <div className="pt-40 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Curated Event <span className="text-gradient">Packages</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Choose from our pre-designed, vendor-bundled packages to simplify your planning process. Transparent pricing, premium service.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2",
                pkg.popular 
                  ? "glass-card border-primary/50 shadow-[0_0_40px_rgba(91,124,250,0.15)]" 
                  : "bg-surface/50 border border-white/10"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-premium text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-white/60 text-sm h-10">{pkg.description}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">{pkg.price}</span>
                {pkg.price !== 'Custom' && <span className="text-white/40 font-medium"> / event</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={cn("w-5 h-5 shrink-0", pkg.popular ? "text-primary" : "text-white/40")} />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={pkg.popular ? 'primary' : 'outline'} 
                className="w-full py-6 text-lg rounded-xl"
              >
                {pkg.price === 'Custom' ? 'Contact Sales' : 'Book Package'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
