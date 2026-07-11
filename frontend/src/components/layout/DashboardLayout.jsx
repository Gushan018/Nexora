import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShoppingBag, Settings, LogOut, Bell, Menu, X, User, Heart, MessageSquare, List, Package, Search, Briefcase, ShoppingCart, Star, Store, DollarSign, ShieldAlert, Flag, Sun, Moon, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, resolveAssetUrl } from '../../utils/api';
import { ImpersonationBanner } from './ImpersonationBanner';

export const DashboardLayout = ({ role = 'customer' }) => {
  const { user, loading, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Define userRole at component scope
  let userRole = user?.role || role;
  if (location.pathname.startsWith('/company') || location.pathname.startsWith('/emc') || role === 'company' || role === 'emc' || user?.vendorType === 'EVENT_COMPANY' || user?.role === 'company' || user?.role === 'emc') {
    userRole = 'company';
  }

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
    enabled: userRole === 'customer'
  });

  const { data: systemSettings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings');
      return res.data;
    },
    enabled: userRole === 'admin',
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const canReceiveNotifications = role === 'customer' || role === 'vendor';

  const { data: rawNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications/my');
      return res.data;
    },
    enabled: canReceiveNotifications,
    refetchInterval: 60000,
  });

  const notifications = Array.isArray(rawNotifications)
    ? rawNotifications
    : Array.isArray(rawNotifications?.notifications)
    ? rawNotifications.notifications
    : [];

  const unreadCount = rawNotifications?.unreadCount ?? notifications.filter((n) => !n?.isRead).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen bg-light-background dark:bg-background flex items-center justify-center"><motion.div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-primary animate-spin" /></div>;
  }


  const getLinks = () => {
    switch (userRole) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard /> },
          { name: 'Users', path: '/admin/user-management', icon: <User /> },
          { name: 'Vendors', path: '/admin/admin-vendor-management', icon: <ShoppingBag /> },
          { name: 'Customers', path: '/admin/admin-customer-management', icon: <User /> },
          { name: 'Sellers', path: '/admin/admin-seller-management', icon: <Package /> },
          { name: 'Bookings', path: '/admin/admin-booking-management', icon: <Calendar /> },
          { name: 'Categories', path: '/admin/category-management', icon: <List /> },
          { name: 'Disputes', path: '/admin/dispute-management', icon: <ShieldAlert /> },
          { name: 'Reviews', path: '/admin/reviews-moderation', icon: <Flag /> },
          { name: 'Payments', path: '/admin/admin-payments-escrow', icon: <DollarSign /> },
          { name: 'Broadcasts', path: '/admin/admin-notification-management', icon: <Bell /> },
          { name: 'Settings', path: '/admin/system-settings', icon: <Settings /> },
        ];
      case 'company':
      case 'emc':
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: <LayoutDashboard /> },
          { name: 'Event Packages', path: '/company/package-management', icon: <Package /> },
          { name: 'Client Inquiries', path: '/company/inquiries', icon: <Briefcase /> },
          { name: 'Event Calendar', path: '/vendor/vendor-booking-calendar', icon: <Calendar /> },
          { name: 'Customer Reviews', path: '/vendor/customer-reviews', icon: <Star /> },
          { name: 'Revenue Analytics', path: '/vendor/revenue-dashboard', icon: <DollarSign /> },
          { name: 'Company Settings', path: '/vendor/vendor-settings', icon: <Settings /> },
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: <LayoutDashboard /> },
          { name: 'Services', path: '/vendor/service-listing', icon: <Briefcase /> },
          { name: 'Bookings', path: '/vendor/booking-management', icon: <Calendar /> },
          { name: 'Packages', path: '/vendor/package-management', icon: <Package /> },
          { name: 'Reviews', path: '/vendor/customer-reviews', icon: <Star /> },
          { name: 'Revenue', path: '/vendor/revenue-dashboard', icon: <ShoppingBag /> },
          { name: 'Settings', path: '/vendor/vendor-settings', icon: <Settings /> },
        ];
      case 'customer':
        return [
          { name: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard /> },
          { name: 'Marketplace', path: '/customer/marketplace', icon: <ShoppingBag /> },
          { name: 'Event Packages', path: '/customer/event-packages', icon: <Package /> },
          { name: 'My Orders', path: '/customer/order-history', icon: <ShoppingCart /> },
          { name: 'My Events', path: '/customer/event-dashboard', icon: <Calendar /> },
          { name: 'Budget Planner', path: '/customer/budget-planner', icon: <Calculator /> },
          { name: 'Favorites', path: '/customer/wishlist', icon: <Heart /> },
          { name: 'Messages', path: '/customer/chat-inbox', icon: <MessageSquare /> },
          { name: 'Account', path: '/customer/account-settings', icon: <User /> },
        ];
      case 'seller':
        return [
          { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard /> },
          { name: 'Products', path: '/seller/seller-product-management', icon: <ShoppingBag /> },
          { name: 'Orders', path: '/seller/order-management', icon: <List /> },
          { name: 'Store', path: '/seller/store-management', icon: <Store /> },
          { name: 'Inventory', path: '/seller/inventory-management', icon: <Package /> },
          { name: 'Reviews', path: '/seller/product-reviews', icon: <Star /> },
          { name: 'Settings', path: '/seller/seller-settings', icon: <Settings /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-background flex flex-col">
      <ImpersonationBanner />
    <div className="flex-1 flex min-h-0">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 w-64 h-[100dvh] bg-white dark:bg-surface border-r border-gray-200 dark:border-white/5 transition-transform duration-300 md:translate-x-0 overflow-y-auto",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 sm:h-20 md:h-24 flex items-center justify-center px-4 sm:px-6 border-b border-gray-200 dark:border-white/5">
            <Link to="/" className="flex items-center justify-center group w-full">
              <img
                src={resolveAssetUrl(systemSettings?.logoUrl)}
                alt="Nexora"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
                    ? "text-gray-900 font-medium shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)) ? (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-white/5">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-light-surface/50 dark:bg-surface/50 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-30">
          <button 
            className="md:hidden text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white p-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
          
          <div className="flex items-center gap-4 ml-auto relative" ref={dropdownRef}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

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
                  className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors relative", activeDropdown === 'cart' ? "bg-primary/20 text-primary" : "bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart?.cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-light-surface dark:border-surface">
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
                      className="absolute right-0 mt-4 w-72 sm:w-80 max-w-[90vw] bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Your Cart</h3>
                        <span className="text-xs text-primary">{cart?.cartItems?.length || 0} items</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                        {!cart?.cartItems?.length ? (
                          <p className="text-gray-500 dark:text-white/40 text-sm text-center py-4">Your cart is empty.</p>
                        ) : (
                          cart.cartItems.map((item) => (
                            <div key={item.cartItemId} className="flex gap-3">
                              <img src={item.product.imageUrl || 'https://images.unsplash.com/photo-1572297126131-ebfb1c53cc6f?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.product.productName}</h4>
                                <p className="text-xs text-gray-600 dark:text-white/60">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-bold text-primary">
                                LKR {(Number(item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <Link to="/customer/shopping-cart" onClick={() => setActiveDropdown(null)}>
                          <button className="w-full py-2 bg-primary text-[#131A26] rounded-lg font-medium hover:bg-primary/90 transition-colors">
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
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors relative", activeDropdown === 'notifications' ? "bg-primary/20 text-primary" : "bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white")}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-light-surface dark:border-surface">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-72 sm:w-80 max-w-[90vw] bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-white/10">
                      <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    {!notifications.length ? (
                      <div className="p-4 text-center text-gray-500 dark:text-white/40 text-sm py-8">
                        No new notifications
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                        {notifications.map((n) => (
                          <button
                            key={n.notificationId}
                            onClick={() => !n.isRead && markAsReadMutation.mutate(n.notificationId)}
                            className={cn(
                              "w-full text-left p-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5",
                              !n.isRead && "bg-primary/5"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <span className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />}
                              <div className="min-w-0">
                                <p className="text-sm text-gray-800 dark:text-white/80 break-words">{n.message}</p>
                                <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                className="w-10 h-10 rounded-full bg-gradient-premium border border-primary/30 cursor-pointer flex items-center justify-center font-bold text-primary shadow-lg overflow-hidden bg-light-surface dark:bg-surface"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage.startsWith('blob:') ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-900 dark:text-white">{(user?.name || user?.businessName || 'U').charAt(0)}</span>
                )}
              </div>
              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-48 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name || user?.businessName || 'User'}</p>
                      <p className="text-xs text-gray-600 dark:text-white/60 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      <Link 
                        to={userRole === 'customer' ? '/customer/account-settings' : userRole === 'vendor' ? '/vendor/vendor-settings' : userRole === 'seller' ? '/seller/seller-settings' : '/admin/system-settings'} 
                        onClick={() => setActiveDropdown(null)} 
                        className="px-4 py-2 text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button 
                        onClick={() => {
                          setActiveDropdown(null);
                          logout();
                          navigate('/login');
                        }}
                        className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors text-left flex items-center gap-2"
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

