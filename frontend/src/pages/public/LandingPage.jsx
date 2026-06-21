import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, CheckCircle2, SearchCode, CalendarCheck, GlassWater } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [guests, setGuests] = React.useState('');

  const handleSearch = () => {
    navigate(`/event-packages?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full relative overflow-hidden bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center pt-24 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000" 
            alt="Luxury Event Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient as seen in screenshot: dark blue tint */}
          <div className="absolute inset-0 bg-[#0A101D]/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A101D]/50 via-transparent to-background" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full flex flex-col items-center text-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="px-4 py-1 rounded-full border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm mb-8">
              Exclusive Event Management
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight max-w-4xl drop-shadow-2xl">
              Elevate Every Moment to the Extraordinary
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-16 font-light drop-shadow-lg">
              Discover, book, and seamlessly manage world-class venues and experiences with our premier marketplace platform.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl bg-[#1C2333]/80 border border-slate-300 rounded-2xl p-2 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex flex-col px-4 py-3 border-r border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Event Type</span>
              <div className="flex items-center">
                <Search className="w-4 h-4 text-primary mr-2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="e.g. Gala, Corporate" className="bg-transparent w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-500" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-4 py-3 border-r border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Location</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-primary mr-2" />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, NY" className="bg-transparent w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-500" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-4 py-3 border-r border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Date</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-500 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
              </div>
            </div>

            <div className="flex-1 flex flex-col px-4 py-3 border-r border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Guests</span>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-primary mr-2" />
                <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Number of guests" className="bg-transparent w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-500" />
              </div>
            </div>

            <Button size="lg" className="w-full md:w-auto h-full px-8 rounded-xl shrink-0" onClick={handleSearch} rightIcon={<ArrowRight className="w-4 h-4"/>}>
              Find Venues
            </Button>
          </motion.div>

          {/* Stats below search */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-10 mt-16"
          >
            {[
              { name: 'Luxury Villas', count: '142 VENUES' },
              { name: 'Yacht Charters', count: '89 EXPERIENCES' },
              { name: 'Private Estates', count: '64 VENUES' },
              { name: 'Historic Castles', count: '29 VENUES' },
              { name: 'Rooftop Lounges', count: '115 VENUES' },
              { name: 'Fine Dining', count: '230 EXPERIENCES' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-start text-left">
                <span className="text-slate-900 font-medium text-sm mb-1">{stat.name}</span>
                <span className="text-primary text-[10px] font-bold tracking-widest">{stat.count}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Curated Excellence Section */}
      <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 border-b border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-slate-900 mb-4">Curated Excellence</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Every venue and service is rigorously vetted to meet our uncompromising standards of luxury and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              tag: 'FROM $5,000/NIGHT', 
              title: 'Exclusive Estates', 
              desc: 'Access to private properties not available on the public market.',
              img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000'
            },
            { 
              tag: 'CUSTOM QUOTES', 
              title: 'Bespoke Decor', 
              desc: 'Award-winning designers to transform any space to your vision.',
              img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000'
            },
            { 
              tag: 'FROM $2,000/ACT', 
              title: 'Elite Entertainment', 
              desc: 'World-class performers, speakers, and musicians for your event.',
              img: 'https://images.unsplash.com/photo-1470229722913-7c090be5bb1a?q=80&w=1000'
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[28rem] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/40 to-transparent flex flex-col justify-end p-8">
                <span className="text-primary text-[10px] font-bold tracking-widest border border-primary/30 bg-black/40 backdrop-blur-md px-3 py-1 rounded-sm w-max mb-4">
                  {item.tag}
                </span>
                <h3 className="text-2xl font-serif text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">How Event Nest Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Planning an event has never been this seamless. Follow these three simple steps to bring your vision to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />
          
          {[
            { icon: <SearchCode className="w-8 h-8 text-primary" />, title: '1. Discover', desc: 'Browse our curated marketplace of premium vendors, venues, and pre-built event packages.' },
            { icon: <CalendarCheck className="w-8 h-8 text-accent" />, title: '2. Book & Plan', desc: 'Secure your dates instantly, manage contracts, and coordinate with all vendors from one dashboard.' },
            { icon: <GlassWater className="w-8 h-8 text-primary" />, title: '3. Celebrate', desc: 'Enjoy your perfectly engineered event while we handle the payments and backend logistics.' }
          ].map((step, i) => (
              <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-surface/30 border border-slate-300 hover:border-primary/50 rounded-[2rem] p-8 text-center backdrop-blur-md relative group overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-20 h-20 mx-auto bg-black/50 border border-slate-300 group-hover:border-primary/50 rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative z-10 transition-colors duration-500">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {step.icon}
              </div>
              <h3 className="text-xl font-serif text-slate-900 mb-3 relative z-10">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">Explore Categories</h2>
            <p className="text-slate-600 text-lg">Find the perfect professionals for your event.</p>
          </div>
          <Link to="/marketplace" className="text-primary hover:text-primaryHover font-medium flex items-center gap-1 transition-colors">
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
              className="group relative h-56 sm:h-72 rounded-3xl overflow-hidden cursor-pointer border border-slate-300 hover:border-primary/50 transition-colors shadow-2xl"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6">
                <span className="text-slate-900 font-bold text-xl drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Loved by Hosts & Vendors</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Don't just take our word for it. See what our community has to say about the Event Nest experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Jenkins', role: 'Bride-to-be', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', text: 'Event Nest made planning my wedding completely stress-free. I found my dream venue and photographer within hours, and the contract process was entirely seamless.' },
            { name: 'Michael Chen', role: 'Corporate Event Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', text: 'The level of professionalism and the quality of vendors on this platform is unmatched. We now use Event Nest exclusively for all our quarterly corporate retreats.' },
            { name: 'Elena Rodriguez', role: 'Premium Caterer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', text: 'Since listing my catering business on Event Nest, my high-end bookings have skyrocketed. The AI booking management saves me hours of admin work every single week.' },
          ].map((testimonial, i) => (
            <div key={i} className="bg-surface/50 border border-slate-300 rounded-3xl p-8 backdrop-blur-sm relative">
              <Star className="w-8 h-8 text-primary absolute top-6 right-6 opacity-30" />
              <div className="flex items-center gap-4 mb-6">
                <img src={testimonial.img} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                <div>
                  <h4 className="text-slate-900 font-bold">{testimonial.name}</h4>
                  <p className="text-primary text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-32 mb-32">
        <div className="bg-gradient-to-br from-surface to-surface/50 border border-primary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

          <div className="flex-1 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tighter mb-4 leading-tight">Grow your business <br/>on Event Nest.</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Join thousands of premium vendors booking high-value clients. Get access to AI tools, secure payments, and a beautiful storefront.
            </p>
            <ul className="space-y-4 mb-8">
              {['Zero upfront listing fees', 'Guaranteed payouts', 'AI-powered booking management'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3" /> {item}
                </li>
              ))}
            </ul>
            <Button className="bg-primary hover:bg-primaryHover text-[#131A26] shadow-[0_0_20px_rgba(212,175,55,0.3)]" size="lg" onClick={() => navigate('/register')}>
              Become a Vendor
            </Button>
          </div>

          <div className="flex-1 relative z-10 hidden md:block">
            <div className="w-full aspect-[4/3] rounded-2xl border border-slate-300 bg-black/50 overflow-hidden p-2 rotate-2 shadow-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000" 
                alt="Event Nest Dashboard" 
                className="w-full h-full object-cover rounded-xl border border-slate-200 opacity-80"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
