import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Menu, X, Sparkles } from 'lucide-react';
import { Button } from './ui';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Générateur', href: '/#generator' },
    { name: 'Templates', href: '/templates' },
    { name: 'À propos', href: '/#about' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Esso QR Generator
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = item.href === '/templates' ? location.pathname === '/templates' : location.pathname === '/' && item.href === '/';
                const Component = item.href.startsWith('/#') ? 'a' : Link;
                const linkProps = item.href.startsWith('/#') ? { href: item.href } : { to: item.href };
                
                return (
                  <motion.div key={item.name} className="relative">
                    <Component
                      {...linkProps}
                      className={`px-4 py-2 rounded-lg transition-colors relative block ${
                        isActive 
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    </Component>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="primary" size="sm" className="relative overflow-hidden">
              <Sparkles className="w-4 h-4 mr-2" />
              Créer un QR Code
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => {
                const isActive = item.href === '/templates' ? location.pathname === '/templates' : location.pathname === '/' && item.href === '/';
                const Component = item.href.startsWith('/#') ? 'a' : Link;
                const linkProps = item.href.startsWith('/#') ? { href: item.href } : { to: item.href };
                
                return (
                  <Component
                    key={item.name}
                    {...linkProps}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  </Component>
                );
              })}
              <div className="pt-2">
                <Button variant="primary" size="sm" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Créer un QR Code
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
