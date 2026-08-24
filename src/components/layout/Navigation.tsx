import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Play, 
  Camera, 
  Film, 
  Users, 
  CreditCard,
  FolderOpen,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { 
    name: 'Home', 
    href: '/', 
    icon: <Play className="w-5 h-5" />, 
    description: 'Studio showcase' 
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    icon: <Film className="w-5 h-5" />, 
    description: 'Our work gallery' 
  },
  { 
    name: 'Services', 
    href: '/services', 
    icon: <Camera className="w-5 h-5" />, 
    description: 'Production packages' 
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: <Settings className="w-5 h-5" />, 
    description: 'Client portal' 
  },
  { 
    name: 'Assets', 
    href: '/assets', 
    icon: <FolderOpen className="w-5 h-5" />, 
    description: 'File management' 
  },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Fixed Navigation Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-black" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">Finesse</span>
                <span className="text-sm text-gold-400 block -mt-1">Digital Studio</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative group px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gold-500/20 rounded-lg border border-gold-500/30"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 transition-all duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Start Project
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMenu} />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                      <Film className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-white">Finesse</span>
                      <span className="text-sm text-gold-400 block -mt-1">Digital Studio</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="flex-1 px-6 py-8 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={toggleMenu}
                        className={`block p-4 rounded-xl transition-all duration-200 ${
                          location.pathname === item.href
                            ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm opacity-60">{item.description}</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-white/10">
                  <Button
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 transition-all duration-200"
                    onClick={() => {
                      navigate('/dashboard');
                      toggleMenu();
                    }}
                  >
                    Start Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};