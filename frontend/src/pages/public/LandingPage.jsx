import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, CheckCircle2, SearchCode, CalendarCheck, GlassWater } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { api, resolveAssetUrl } from '../../utils/api';

const DEFAULT_CAT_IMAGES = {
  'Food & Catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
  'Catering & Dining': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
  'Catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
  'Decorations': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80',
  'Decor & Lighting': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80',
  'Decor': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80',
  'Music & Entertainment': 'https://images.unsplash.com/photo-1470229722913-7c090be5bb1a?w=500&q=80',
  'DJ & Entertainment': 'https://images.unsplash.com/photo-1470229722913-7c090be5bb1a?w=500&q=80',
  'Entertainment': 'https://images.unsplash.com/photo-1470229722913-7c090be5bb1a?w=500&q=80',
  'Photography & Video': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&q=80',
  'Venue & Hall': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80',
  'Bridal & Styling': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80',
};

const getCategoryImg = (name) => {
  if (!name) return 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80';
  if (DEFAULT_CAT_IMAGES[name]) return DEFAULT_CAT_IMAGES[name];
  const found = Object.keys(DEFAULT_CAT_IMAGES).find(k => k.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(k.toLowerCase()));
  return found ? DEFAULT_CAT_IMAGES[found] : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80';
};

const DEFAULT_PACKAGE_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000'
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [guests, setGuests] = React.useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['landingCategories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    }
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['landingPackages'],
    queryFn: async () => {
      const res = await api.get('/packages/public');
      return res.data;
    }
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['landingVendors'],
    queryFn: async () => {
      const res = await api.get('/vendors');
      return res.data;
    }
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['landingReviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/public');
      return res.data;
    }
  });

  const handleSearch = () => {
    navigate(`/event-packages?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  const featuredPackages = packages.slice(0, 3);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <div className="w-full relative overflow-hidden bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[95vh] flex flex-col justify-center items-center pt-28 pb-16 sm:pb-24 md:pb-32 px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000" 
            alt="Luxury Event Background" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000';
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-[#0A101D]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A101D]/60 via-transparent to-background" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-2 sm:px-4 w-full flex flex-col items-center text-center mt-6 sm:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <span className="px-3 sm:px-4 py-1 rounded-full border border-primary/30 text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm mb-6 sm:mb-8">
              Exclusive Event Management
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 sm:mb-6 leading-tight max-w-4xl drop-shadow-2xl">
              Elevate Every Moment to the Extraordinary
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 font-light drop-shadow-lg px-2">
              Discover, book, and seamlessly manage world-class venues and experiences with our premier marketplace platform.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl bg-[#1C2333]/90 border border-slate-300/30 rounded-2xl p-2.5 sm:p-3 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2"
          >
            <div className="flex-1 flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 border-b md:border-b-0 md:border-r border-slate-300/20">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-left">Event Type</span>
              <div className="flex items-center">
                <Search className="w-4 h-4 text-primary mr-2 shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="e.g. Gala, Corporate" className="bg-transparent w-full text-white text-sm focus:outline-none placeholder:text-slate-400" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 border-b md:border-b-0 md:border-r border-slate-300/20">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-left">Location</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-primary mr-2 shrink-0" />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, NY" className="bg-transparent w-full text-white text-sm focus:outline-none placeholder:text-slate-400" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 border-b md:border-b-0 md:border-r border-slate-300/20">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-left">Date</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary mr-2 shrink-0" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent w-full text-white text-sm focus:outline-none placeholder:text-slate-400 [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
              </div>
            </div>

            <div className="flex-1 flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 border-b md:border-b-0 md:border-r border-slate-300/20">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 text-left">Guests</span>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-primary mr-2 shrink-0" />
                <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Number of guests" className="bg-transparent w-full text-white text-sm focus:outline-none placeholder:text-slate-400" />
              </div>
            </div>

            <Button size="lg" className="w-full md:w-auto py-3.5 px-6 sm:px-8 rounded-xl shrink-0 font-medium" onClick={handleSearch} rightIcon={<ArrowRight className="w-4 h-4"/>}>
              Find Venues
            </Button>
          </motion.div>

          {/* Dynamic Stats below search */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-10 sm:mt-16 w-full max-w-4xl mx-auto px-2"
          >
            {[
              { name: 'Verified Providers', count: `${vendors.length} PROVIDERS` },
              { name: 'Event Categories', count: `${categories.length} CATEGORIES` },
              { name: 'Event Packages', count: `${packages.length} PACKAGES` },
              { name: 'Client Reviews', count: `${reviews.length} REVIEWS` },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-3 md:p-0 rounded-xl border border-white/10 md:border-none">
                <span className="text-white font-medium text-xs sm:text-sm mb-1 drop-shadow-md">{stat.name}</span>
                <span className="text-primary text-[10px] sm:text-xs font-bold tracking-widest drop-shadow">{stat.count}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Curated Excellence Section */}
      <section className="py-12 sm:py-16 md:py-24 relative z-10 max-w-7xl mx-auto px-4 border-b border-slate-200/40">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-3 sm:mb-4">Curated Event Packages</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Every package and service is provided by verified top-tier service providers and event companies on our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((item, i) => (
            <motion.div 
              key={item.packageId || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('/event-packages')}
              className="group relative h-[24rem] sm:h-[26rem] md:h-[28rem] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={resolveAssetUrl(item.images, DEFAULT_PACKAGE_IMAGES[i % DEFAULT_PACKAGE_IMAGES.length])} 
                alt={item.packageName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_PACKAGE_IMAGES[i % DEFAULT_PACKAGE_IMAGES.length];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <span className="text-primary text-[10px] font-bold tracking-widest border border-primary/30 bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm w-max mb-3 sm:mb-4">
                  FROM LKR {Number(item.price || 0).toLocaleString()}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white mb-2 drop-shadow-md">{item.packageName}</h3>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-2 drop-shadow">{item.description}</p>
                <p className="text-primary text-xs font-semibold mt-2">{item.vendor?.businessName || 'Verified Service Provider'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-12 sm:mt-16 md:mt-24">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-3 sm:mb-4">How Event Nest Works</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-lg">Planning an event has never been this seamless. Follow these three simple steps to bring your vision to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />
          
          {[
            { icon: <SearchCode className="w-8 h-8 text-primary" />, title: '1. Discover', desc: 'Browse our curated marketplace of service providers, venues, and pre-built event packages.' },
            { icon: <CalendarCheck className="w-8 h-8 text-accent" />, title: '2. Book & Plan', desc: 'Secure your dates instantly, manage contracts, and coordinate with all service providers from one dashboard.' },
            { icon: <GlassWater className="w-8 h-8 text-primary" />, title: '3. Celebrate', desc: 'Enjoy your perfectly engineered event while we handle the payments and backend logistics.' }
          ].map((step, i) => (
              <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-surface/30 border border-slate-300 dark:border-slate-700/60 hover:border-primary/50 rounded-[2rem] p-6 sm:p-8 text-center backdrop-blur-md relative group overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-black/50 border border-slate-300 dark:border-slate-700 group-hover:border-primary/50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl relative z-10 transition-colors duration-500">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {step.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-slate-900 dark:text-white mb-2 sm:mb-3 relative z-10">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Categories Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-16 sm:mt-20 md:mt-32">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-2">Explore Categories</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg">Find the perfect professionals for your event.</p>
          </div>
          <Link to="/marketplace" className="text-primary hover:text-primaryHover font-medium text-sm flex items-center gap-1 transition-colors">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.categoryId || i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.categoryName)}`)}
              className="group relative h-44 sm:h-60 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-slate-300/60 dark:border-slate-800 hover:border-primary/50 transition-colors shadow-xl"
            >
              <img 
                src={getCategoryImg(cat.categoryName)} 
                alt={cat.categoryName} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4 sm:p-6">
                <span className="text-white font-bold text-sm sm:text-lg md:text-xl drop-shadow-lg transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform">{cat.categoryName}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Testimonials */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-16 sm:mt-20 md:mt-32">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-3 sm:mb-4">Loved by Hosts & Clients</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-lg">Real reviews from event hosts and clients on the Event Nest platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map((testimonial, i) => (
            <div key={testimonial.reviewId || i} className="bg-surface/50 border border-slate-300 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative flex flex-col justify-between">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary absolute top-6 right-6 opacity-30" />
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <img 
                    src={resolveAssetUrl(testimonial.customer?.profileImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80')} 
                    alt={testimonial.customer?.name || 'Client'} 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/20 shrink-0" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80';
                    }}
                  />
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">{testimonial.customer?.name || 'Event Client'}</h4>
                    <p className="text-primary text-xs sm:text-sm font-medium">{testimonial.vendor?.businessName ? `Client of ${testimonial.vendor.businessName}` : 'Verified Event Host'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">"{testimonial.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 mt-16 sm:mt-24 md:mt-32 mb-16 sm:mb-24 md:mb-32">
        <div className="bg-gradient-to-br from-surface to-surface/50 border border-primary/20 rounded-3xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

          <div className="flex-1 relative z-10 w-full">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">Grow your business <br className="hidden sm:inline"/>on Event Nest.</h2>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-lg">
              Join thousands of service providers & sellers booking high-value clients. Get access to AI tools, secure payments, and a beautiful storefront.
            </p>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {['Zero upfront listing fees', 'Guaranteed payouts', 'AI-powered booking management'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2.5 sm:mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-[#131A26] shadow-[0_0_20px_rgba(212,175,55,0.3)]" size="lg" onClick={() => navigate('/register')}>
              Join as Provider or Seller
            </Button>
          </div>

          <div className="flex-1 relative z-10 hidden md:block w-full">
            <div className="w-full aspect-[4/3] rounded-2xl border border-slate-300 dark:border-slate-700 bg-black/50 overflow-hidden p-2 rotate-2 shadow-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000" 
                alt="Event Nest Dashboard" 
                className="w-full h-full object-cover rounded-xl border border-slate-200/20 opacity-80"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000';
                }}
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

