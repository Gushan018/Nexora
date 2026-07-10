import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Sparkles, Sun, Moon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api, resolveAssetUrl } from '../../utils/api';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: systemSettings } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      try {
        // Public endpoint - no auth required
        const res = await api.get('/settings');
        return res.data;
      } catch (err) {
        // Fallback to default if error
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const logoSrc = resolveAssetUrl(systemSettings?.logoUrl);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Packages', path: '/event-packages' },
  ];

  const isTransparentDark = location.pathname === '/' && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-primary/20 py-4 shadow-sm" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between gap-2">
          
          <Link to="/" className="flex items-center group">
            <img
              src={logoSrc}
              alt="Nexora"
              className="h-12 sm:h-16 md:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-bold transition-colors",
                  isTransparentDark 
                    ? "text-white/90 hover:text-white drop-shadow-md"
                    : location.pathname === link.path ? "text-primary" : "text-gray-600 dark:text-white/60 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={cn("p-2 rounded-full transition-colors", 
                isTransparentDark ? "text-white/90 hover:text-white hover:bg-white/10 drop-shadow-md" : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              )}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!loading && user ? (
              <Link to={`/${user.role}/dashboard`}>
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className={cn(
                  "text-sm font-bold transition-colors",
                  isTransparentDark ? "text-white/90 hover:text-white drop-shadow-md" : "text-gray-700 dark:text-white/70 hover:text-primary"
                )}>
                  Sign In
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn("md:hidden p-2", isTransparentDark ? "text-white" : "text-gray-700 dark:text-white")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-2xl py-6 px-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-gray-200 dark:border-white/10 my-2" />
            <div className="flex items-center gap-3 px-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-primary hover:bg-primary/10"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <span className="text-sm text-gray-600 dark:text-white/60">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg text-slate-800 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              {!loading && user ? (
                <Link to={`/${user.role}/dashboard`} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
