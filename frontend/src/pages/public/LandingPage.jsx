import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, MapPin, Calendar, CheckCircle2, SearchCode, CalendarCheck, GlassWater, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSearch = () => {
    navigate(`/vendor-directory?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="w-full relative overflow-hidden pb-24">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-20">
        {/* Advanced Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000" 
              alt="Event Background" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Floating Glowing Orbs */}
          <motion.div 
            animate={{ y: [0, -50, 0], x: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 blur-[150px] rounded-full mix-blend-screen z-10 pointer-events-none" 
          />
          <motion.div 
            animate={{ y: [0, 50, 0], x: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent/40 blur-[150px] rounded-full mix-blend-screen z-10 pointer-events-none" 
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full flex flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={itemVariants} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-md mb-6 inline-block shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              The Premium Event Marketplace
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight max-w-4xl mx-auto drop-shadow-2xl">
              Extraordinary Events, <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">Engineered Perfectly.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium drop-shadow-lg">
              Discover, book, and manage world-class venues, caterers, and entertainers for your next unforgettable moment.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
            className="w-full max-w-4xl bg-surface/60 border border-white/10 rounded-3xl p-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex-1 flex items-center bg-black/40 rounded-2xl px-4 py-4 border border-white/5 hover:bg-black/60 transition-colors relative z-10">
              <Search className="w-5 h-5 text-primary mr-3" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="What are you looking for?" className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40" />
            </div>
            <div className="flex-1 flex items-center bg-black/40 rounded-2xl px-4 py-4 border border-white/5 hover:bg-black/60 transition-colors relative z-10">
              <MapPin className="w-5 h-5 text-primary mr-3" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40" />
            </div>
            <div className="flex-1 flex items-center bg-black/40 rounded-2xl px-4 py-4 border border-white/5 hover:bg-black/60 transition-colors relative z-10">
              <Calendar className="w-5 h-5 text-primary mr-3" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent w-full text-white focus:outline-none placeholder:text-white/40 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
            </div>
            <Button size="lg" className="md:w-auto w-full px-8 rounded-2xl shadow-lg shadow-primary/20 relative z-10" onClick={handleSearch}>
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-surface/30 border border-white/10 hover:border-primary/50 rounded-[2rem] p-8 text-center backdrop-blur-md relative group overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-20 h-20 mx-auto bg-black/50 border border-white/10 group-hover:border-primary/50 rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative z-10 transition-colors duration-500">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
              <p className="text-white/60 leading-relaxed relative z-10">{step.desc}</p>
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
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative h-56 sm:h-72 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary/50 transition-colors shadow-2xl"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-xl drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">{cat.name}</span>
              </div>
            </motion.div>
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
