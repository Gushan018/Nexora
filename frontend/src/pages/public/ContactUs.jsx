import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const ContactUs = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Get in <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto"
          >
            Have a question about our platform, enterprise pricing, or need vendor support? Our team is here to help.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <p className="text-slate-600 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface border border-slate-300 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium mb-1">Phone</h4>
                  <p className="text-slate-600 text-sm">+94 77 123 4567</p>
                  <p className="text-slate-600 text-sm">+94 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface border border-slate-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium mb-1">Email</h4>
                  <p className="text-slate-600 text-sm">support@nexora.lk</p>
                  <p className="text-slate-600 text-sm">partners@nexora.lk</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface border border-slate-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium mb-1">Headquarters</h4>
                  <p className="text-slate-600 text-sm">123 Innovation Drive<br/>Colombo 03<br/>Sri Lanka</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card shadow-2xl p-2 sm:p-4">
              <CardContent className="p-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="First Name" placeholder="John" />
                    <Input label="Last Name" placeholder="Doe" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="Email Address" type="email" placeholder="john@example.com" />
                    <Input label="Phone Number" placeholder="+94 7X XXX XXXX" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Subject</label>
                    <select className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors appearance-none">
                      <option value="">Select an option</option>
                      <option value="support">General Support</option>
                      <option value="vendor">Vendor Onboarding</option>
                      <option value="billing">Billing Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Message</label>
                    <textarea 
                      rows="6" 
                      className="w-full bg-surface border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary transition-colors"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <Button className="w-full h-14 text-lg mt-4" leftIcon={<Send className="w-5 h-5" />}>
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
