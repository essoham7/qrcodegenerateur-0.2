import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  User, 
  Type, 
  Mail, 
  MessageSquare, 
  Wifi, 
  Bitcoin, 
  Twitter, 
  Facebook, 
  FileText, 
  Music, 
  Smartphone, 
  Image, 
  QrCode,
  ArrowRight,
  Sparkles,
  Search,
  Heart
} from 'lucide-react';
import { Button, Input, Card } from './ui';
import TemplateForm from './TemplateForm';
import useFavorites from '../hooks/useFavorites';

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const templateCategories = [
    {
      title: 'Basique',
      templates: [
        {
          id: 'url',
          name: 'URL / Lien Web',
          description: 'Créez un QR code pour rediriger vers un site web',
          icon: Link,
          color: 'from-blue-500 to-blue-600',
          popular: true
        },
        {
          id: 'text',
          name: 'Texte Simple',
          description: 'Afficher du texte brut lors du scan',
          icon: Type,
          color: 'from-gray-500 to-gray-600'
        }
      ]
    },
    {
      title: 'Contact & Communication',
      templates: [
        {
          id: 'vcard',
          name: 'vCard (Carte de visite)',
          description: 'Partagez vos informations de contact',
          icon: User,
          color: 'from-green-500 to-green-600',
          popular: true
        },
        {
          id: 'email',
          name: 'E-mail',
          description: 'Ouvrir une nouvelle composition d\'email',
          icon: Mail,
          color: 'from-red-500 to-red-600'
        },
        {
          id: 'sms',
          name: 'SMS',
          description: 'Envoyer un SMS prédéfini',
          icon: MessageSquare,
          color: 'from-purple-500 to-purple-600'
        }
      ]
    },
    {
      title: 'Réseau & Technologie',
      templates: [
        {
          id: 'wifi',
          name: 'WiFi',
          description: 'Connexion automatique au WiFi',
          icon: Wifi,
          color: 'from-indigo-500 to-indigo-600',
          popular: true
        },
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          description: 'Adresse de portefeuille Bitcoin',
          icon: Bitcoin,
          color: 'from-orange-500 to-orange-600'
        }
      ]
    },
    {
      title: 'Réseaux Sociaux',
      templates: [
        {
          id: 'twitter',
          name: 'Twitter',
          description: 'Lien vers profil Twitter',
          icon: Twitter,
          color: 'from-sky-500 to-sky-600'
        },
        {
          id: 'facebook',
          name: 'Facebook',
          description: 'Lien vers profil Facebook',
          icon: Facebook,
          color: 'from-blue-600 to-blue-700'
        }
      ]
    },
    {
      title: 'Médias & Fichiers',
      templates: [
        {
          id: 'pdf',
          name: 'PDF',
          description: 'Lien vers un document PDF',
          icon: FileText,
          color: 'from-red-600 to-red-700'
        },
        {
          id: 'mp3',
          name: 'MP3 / Audio',
          description: 'Lien vers un fichier audio',
          icon: Music,
          color: 'from-pink-500 to-pink-600'
        },
        {
          id: 'image',
          name: 'Image',
          description: 'Afficher une image',
          icon: Image,
          color: 'from-teal-500 to-teal-600'
        },
        {
          id: 'gallery',
          name: 'Galerie d\'images',
          description: 'Collection d\'images',
          icon: Image,
          color: 'from-cyan-500 to-cyan-600'
        }
      ]
    },
    {
      title: 'Applications',
      templates: [
        {
          id: 'appstore',
          name: 'App Store',
          description: 'Lien vers une application mobile',
          icon: Smartphone,
          color: 'from-violet-500 to-violet-600'
        },
        {
          id: 'barcode',
          name: 'Code-barres 2D',
          description: 'Autres formats de codes-barres',
          icon: QrCode,
          color: 'from-slate-500 to-slate-600'
        }
      ]
    }
  ];

  const allTemplates = templateCategories.flatMap(category => category.templates);
  
  // Filtrer les templates selon le terme de recherche et les favoris
  const filteredCategories = templateCategories.map(category => ({
    ...category,
    templates: category.templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || isFavorite(template.id);
      return matchesSearch && matchesFavorites;
    })
  })).filter(category => category.templates.length > 0);

  const popularTemplates = allTemplates.filter(template => template.popular);

  if (selectedTemplate) {
    return <TemplateForm template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Templates QR Code
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez parmi nos templates prédéfinis pour créer rapidement des QR codes adaptés à vos besoins
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full shadow-lg border-2 border-gray-200 focus:border-indigo-300 focus:shadow-xl transition-all duration-300"
            />
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </motion.button>
            )}
          </div>
          {searchTerm && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-500 mt-2 text-center"
            >
              {filteredCategories.reduce((acc, cat) => acc + cat.templates.length, 0)} résultat(s) pour "{searchTerm}"
            </motion.p>
          )}
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Button
            variant={showFavoritesOnly ? "primary" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favoris ({favorites.length})
          </Button>
          {showFavoritesOnly && (
            <Button
              variant="outline"
              onClick={() => setShowFavoritesOnly(false)}
              className="text-gray-600"
            >
              Voir tout
            </Button>
          )}
        </motion.div>

        {/* Popular Templates */}
        {!searchTerm && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-indigo-500 mr-2" />
              Templates Populaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  onClick={() => setSelectedTemplate(template)}
                  featured
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Template Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.templates.map((template, index) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    index={index}
                    onClick={() => setSelectedTemplate(template)}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun template trouvé
            </h3>
            <p className="text-gray-500">
              Essayez avec d'autres mots-clés ou parcourez nos catégories
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TemplateCard = ({ template, index, onClick, featured = false, isFavorite, toggleFavorite }) => {
  const IconComponent = template.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className={`p-6 h-full transition-all duration-300 border-2 hover:border-indigo-300 relative overflow-hidden bg-gradient-to-br from-white to-gray-50 group-hover:from-indigo-50 group-hover:to-white ${
              featured ? 'ring-2 ring-indigo-200' : ''
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(template.id);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite(template.id) 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite(template.id) ? 'fill-current' : ''}`} 
                />
              </motion.button>
              {template.popular && (
                <motion.span 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                >
                  ⭐ Populaire
                </motion.span>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {template.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {template.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0"
            >
              Utiliser ce template
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Templates;