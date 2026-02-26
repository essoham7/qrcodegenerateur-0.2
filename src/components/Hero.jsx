import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Download } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { Button } from './ui';

const HeroSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Génération instantanée",
      description: "Créez vos QR codes en temps réel"
    },
    {
      icon: Shield,
      title: "Sécurisé & Fiable",
      description: "Vos données restent privées"
    },
    {
      icon: Download,
      title: "Téléchargement facile",
      description: "Formats PNG, SVG et PDF"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-secondary-400/20 to-accent-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-sm font-medium text-primary-700 mb-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générateur QR Code Moderne
          </motion.div>

          {/* Main title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Créez des QR Codes
            </span>
            <br />
            <span className="text-gray-900">
              en quelques secondes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
          >
            Générez facilement des codes QR personnalisés pour vos liens, contacts, événements et bien plus. 
            Interface moderne, prévisualisation temps réel et téléchargement instantané.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              variant="primary" 
              size="lg" 
              className="group"
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Commencer maintenant
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Voir les templates
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* QR Generator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="generator"
        >
          <QRCodeGenerator />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
