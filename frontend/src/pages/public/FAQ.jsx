import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'General',
    questions: [
      { q: "What is Nexora?", a: "Nexora is a unified Event Management and Marketplace Platform that connects event planners, service vendors, and product sellers in a single, seamless ecosystem." },
      { q: "Is Nexora free to use?", a: "Creating an account and browsing as a Customer is 100% free. Vendors and Sellers may have platform fees applied to transactions or opt-in to premium listing packages." },
    ]
  },
  {
    category: 'Customers',
    questions: [
      { q: "How do I book a vendor?", a: "Browse the Vendor Directory, review their portfolio and packages, and click 'Book Vendor'. You will submit an event brief and the vendor will respond to your booking request." },
      { q: "Are my payments secure?", a: "Yes, all payments are processed through industry-standard encrypted gateways. Funds are held securely until services are delivered according to our platform policy." },
      { q: "Can I manage multiple events?", a: "Yes, your Customer Dashboard allows you to create and manage multiple concurrent events, each with their own timelines, vendors, and budgets." },
    ]
  },
  {
    category: 'Vendors & Sellers',
    questions: [
      { q: "How do I get verified?", a: "During onboarding, you will need to upload business registration documents. Our Admin team reviews these within 48 hours to grant you 'Verified' status." },
      { q: "When do I get paid?", a: "Earnings are cleared and become available for withdrawal 3 days after the successful completion of an event or delivery of a product." },
    ]
  }
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentCategory = FAQS.find(c => c.category === activeCategory);

  return (
    <div className="pt-40 pb-20 min-h-screen bg-background relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textPrimary/60 text-lg max-w-2xl mx-auto"
          >
            Everything you need to know about the product and billing. Can't find the answer you're looking for? Please chat to our friendly team.
          </motion.p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {FAQS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => {
                setActiveCategory(cat.category);
                setOpenIndex(null);
              }}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all duration-300 border",
                activeCategory === cat.category 
                  ? "bg-primary/20 border-primary text-textPrimary shadow-[0_0_20px_rgba(91,124,250,0.2)]" 
                  : "bg-surface border-white/10 text-textPrimary/60 hover:bg-white/5"
              )}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4 mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentCategory.questions.map((faq, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "mb-4 rounded-2xl border transition-all duration-300 overflow-hidden",
                    openIndex === i ? "bg-surface/80 border-primary/50" : "bg-surface/30 border-white/10 hover:border-white/20"
                  )}
                >
                  <button 
                    onClick={() => toggleQuestion(i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-lg font-medium text-textPrimary pr-8">{faq.q}</h3>
                    <ChevronDown className={cn("w-5 h-5 text-textPrimary/40 shrink-0 transition-transform duration-300", openIndex === i && "rotate-180 text-primary")} />
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-textPrimary/60 leading-relaxed border-t border-white/5 mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Still have questions? */}
        <div className="rounded-3xl bg-surface/50 border border-white/10 p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-textPrimary mb-2">Still have questions?</h3>
          <p className="text-textPrimary/60 mb-8 max-w-md mx-auto">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Link to="/contact-us">
            <Button size="lg" className="px-8">Get in Touch</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
