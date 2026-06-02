import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, MapPin, Calendar, CheckCircle2, SearchCode, CalendarCheck, GlassWater, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative overflow-hidden pb-24">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-20">
        {/* Background Video/Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000" 
            alt="Event Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-md mb-6 inline-block">
              The Premium Event Marketplace
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight max-w-4xl mx-auto drop-shadow-2xl">
              Extraordinary Events, <br className="hidden md:block"/> Engineered Perfectly.
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium drop-shadow-lg">
              Discover, book, and manage world-class venues, caterers, and entertainers for your next unforgettable moment.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl bg-surface/80 border border-white/20 rounded-2xl p-3 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/5">
              <Search className="w-5 h-5 text-white/40 mr-3" />
              <input type="text" placeholder="What are you looking for?" className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40" />
            </div>
            <div className="flex-1 flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/5">
              <MapPin className="w-5 h-5 text-white/40 mr-3" />
              <input type="text" placeholder="Location" className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40" />
            </div>
            <div className="flex-1 flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/5">
              <Calendar className="w-5 h-5 text-white/40 mr-3" />
              <input type="text" placeholder="Date" className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40" />
            </div>
            <Button size="lg" className="md:w-auto w-full px-8" onClick={() => navigate('/marketplace')}>
              Search
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Nexora Works</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">Planning an event has never been this seamless. Follow these three simple steps to bring your vision to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />
          
          {[
            { icon: <SearchCode className="w-8 h-8 text-primary" />, title: '1. Discover', desc: 'Browse our curated marketplace of premium vendors, venues, and pre-built event packages.' },
            { icon: <CalendarCheck className="w-8 h-8 text-accent" />, title: '2. Book & Plan', desc: 'Secure your dates instantly, manage contracts, and coordinate with all vendors from one dashboard.' },
            { icon: <GlassWater className="w-8 h-8 text-green-400" />, title: '3. Celebrate', desc: 'Enjoy your perfectly engineered event while we handle the payments and backend logistics.' }
          ].map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-surface/40 border border-white/5 rounded-3xl p-8 text-center backdrop-blur-sm relative"
            >
              <div className="w-16 h-16 mx-auto bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore Categories</h2>
            <p className="text-white/60 text-lg">Find the perfect professionals for your event.</p>
          </div>
          <Link to="/marketplace" className="text-primary hover:text-primary-light font-medium flex items-center gap-1 transition-colors">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Venues & Spaces', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80' },
            { name: 'Photography', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80' },
            { name: 'Catering', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80' },
            { name: 'Entertainment', img: 'https://images.unsplash.com/photo-1470229722913-7c090be5bb1a?w=500&q=80' },
          ].map((cat, i) => (
            <div key={i} className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary/50 transition-colors">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-6">
                <span className="text-white font-bold text-lg">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Packages</h2>
            <p className="text-white/60 text-lg">Turnkey event solutions curated by top vendors.</p>
          </div>
          <Link to="/event-packages" className="text-white hover:text-primary font-medium flex items-center gap-1 transition-colors">
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'The Grand Wedding', price: '$12,500', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', vendor: 'Elegance Events Co.' },
            { title: 'Corporate Gala Pro', price: '$8,200', img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80', vendor: 'Summit Productions' },
            { title: 'Luxury Birthday Bash', price: '$4,500', img: 'https://images.unsplash.com/photo-1530103862676-de8892b12bf6?w=800&q=80', vendor: 'Party Perfectionists' }
          ].map((pkg, i) => (
            <div key={i} className="bg-surface border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer shadow-xl">
              <div className="relative h-56 overflow-hidden">
                <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-bold text-sm">
                  {pkg.price}
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-medium mb-2">{pkg.vendor}</div>
                <h3 className="text-xl font-bold text-white mb-4">{pkg.title}</h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center text-white/60 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" /> 4.9 (120 reviews)
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Hosts & Vendors</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">Don't just take our word for it. See what our community has to say about the Nexora experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Jenkins', role: 'Bride-to-be', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', text: 'Nexora made planning my wedding completely stress-free. I found my dream venue and photographer within hours, and the contract process was entirely seamless.' },
            { name: 'Michael Chen', role: 'Corporate Event Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', text: 'The level of professionalism and the quality of vendors on this platform is unmatched. We now use Nexora exclusively for all our quarterly corporate retreats.' },
            { name: 'Elena Rodriguez', role: 'Premium Caterer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', text: 'Since listing my catering business on Nexora, my high-end bookings have skyrocketed. The AI booking management saves me hours of admin work every single week.' },
          ].map((testimonial, i) => (
            <div key={i} className="bg-surface/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative">
              <Star className="w-8 h-8 text-white/5 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <img src={testimonial.img} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-white/40 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="bg-gradient-to-br from-surface to-surface/50 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

          <div className="flex-1 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Grow your business <br/>on Nexora.</h2>
            <p className="text-lg text-white/60 mb-8 max-w-lg">
              Join thousands of premium vendors booking high-value clients. Get access to AI tools, secure payments, and a beautiful storefront.
            </p>
            <ul className="space-y-4 mb-8">
              {['Zero upfront listing fees', 'Guaranteed payouts', 'AI-powered booking management'].map((item, i) => (
                <li key={i} className="flex items-center text-white/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3" /> {item}
                </li>
              ))}
            </ul>
            <Button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(240,98,146,0.3)]" size="lg" onClick={() => navigate('/register')}>
              Become a Vendor
            </Button>
          </div>

          <div className="flex-1 relative z-10 hidden md:block">
            <div className="w-full aspect-[4/3] rounded-2xl border border-white/10 bg-black/50 overflow-hidden p-2 rotate-2 shadow-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000" 
                alt="Nexora Dashboard" 
                className="w-full h-full object-cover rounded-xl border border-white/5 opacity-80"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
