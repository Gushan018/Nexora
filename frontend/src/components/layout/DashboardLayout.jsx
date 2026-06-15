import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShoppingBag, Settings, LogOut, Bell, Menu, X, User, Heart, MessageSquare, List, Package, Search, Briefcase, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

export const DashboardLayout = ({ role = 'admin' }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const res = await api.get('/cart');
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) return { cartItems: [] };
        throw err;
      }
    },
    enabled: role === 'customer'
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><motion.div className="w-16 h-16 rounded-full border-4 border-slate-300 border-t-primary animate-spin" /></div>;
  }

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard /> },
          { name: 'Users', path: '/admin/user-management', icon: <User /> },
          { name: 'Vendors', path: '/admin/admin-vendor-management', icon: <ShoppingBag /> },
          { name: 'Settings', path: '/admin/system-settings', icon: <Settings /> },
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: <LayoutDashboard /> },
          { name: 'Services', path: '/vendor/service-listing', icon: <ShoppingBag /> },
          { name: 'Bookings', path: '/vendor/booking-management', icon: <Calendar /> },
          { name: 'Settings', path: '/vendor/vendor-settings', icon: <Settings /> },
        ];
      case 'customer':
        return [
          { name: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard /> },
          { name: 'Marketplace', path: '/customer/marketplace', icon: <ShoppingBag /> },
          { name: 'Event Packages', path: '/customer/event-packages', icon: <Package /> },
          { name: 'Directory', path: '/customer/vendor-directory', icon: <Search /> },
          { name: 'My Orders', path: '/customer/order-history', icon: <ShoppingBag /> },
          { name: 'My Events', path: '/customer/event-dashboard', icon: <Calendar /> },
          { name: 'Messages', path: '/customer/chat-inbox', icon: <MessageSquare /> },
          { name: 'Settings', path: '/customer/account-settings', icon: <Settings /> },
        ];
      case 'seller':
        return [
          { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard /> },
          { name: 'Products', path: '/seller/seller-product-management', icon: <ShoppingBag /> },
          { name: 'Orders', path: '/seller/order-management', icon: <List /> },
          { name: 'Settings', path: '/seller/seller-settings', icon: <Settings /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 w-64 h-[100dvh] bg-surface border-r border-slate-200 transition-transform duration-300 md:translate-x-0 overflow-y-auto",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-24 flex items-center justify-center px-6 border-b border-slate-200">
            <Link to="/" className="flex items-center justify-center group w-full">
              <img 
                src="/logo.png" 
                alt="Nexora" 
                className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>
          
          <nav className="flex-1 py-4 px-3 space-y-1">
            {getLinks().map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative text-sm",
                  location.pathname.startsWith(link.path) 
                    ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {location.pathname.startsWith(link.path) && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
                  <span className="font-medium">{link.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <button 
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
          
          <div className="flex items-center gap-4 ml-auto relative" ref={dropdownRef}>
            
            {/* Wishlist Link */}
            {role === 'customer' && (
              <Link
                to="/customer/wishlist"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-slate-100 text-slate-600 hover:text-slate-900 relative"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart Dropdown */}
            {role === 'customer' && (
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'cart' ? null : 'cart')}
                  className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors relative", activeDropdown === 'cart' ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-600 hover:text-slate-900")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart?.cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                      {cart.cartItems.length}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {activeDropdown === 'cart' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-80 bg-surface border border-slate-300 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-300 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Your Cart</h3>
                        <span className="text-xs text-primary">{cart?.cartItems?.length || 0} items</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                        {!cart?.cartItems?.length ? (
                          <p className="text-slate-500 text-sm text-center py-4">Your cart is empty.</p>
                        ) : (
                          cart.cartItems.map((item) => (
                            <div key={item.cartItemId} className="flex gap-3">
                              <img src={item.product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.product.productName}</h4>
                                <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-bold text-primary">
                                LKR {(Number(item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t border-slate-300 bg-slate-100">
                        <Link to="/customer/shopping-cart" onClick={() => setActiveDropdown(null)}>
                          <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            View Full Cart
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors relative", activeDropdown === 'notifications' ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-600 hover:text-slate-900")}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'notifications' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-80 bg-surface border border-slate-300 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-300">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-slate-500 text-sm py-8">
                      No new notifications
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                className="w-10 h-10 rounded-full bg-gradient-premium border border-slate-400 cursor-pointer flex items-center justify-center font-bold text-primary shadow-lg overflow-hidden bg-surface"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage.startsWith('blob:') ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-900">{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-48 bg-surface border border-slate-300 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-300 bg-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-600 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      <Link to={`/${role}/account-settings`} onClick={() => setActiveDropdown(null)} className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-left flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button 
                        onClick={() => {
                          setActiveDropdown(null);
                          logout();
                          navigate('/login');
                        }}
                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-left flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
