import { useState, useEffect } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('qr-template-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('qr-template-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (templateId) => {
    setFavorites(prev => {
      if (!prev.includes(templateId)) {
        return [...prev, templateId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (templateId) => {
    setFavorites(prev => prev.filter(id => id !== templateId));
  };

  const toggleFavorite = (templateId) => {
    if (favorites.includes(templateId)) {
      removeFromFavorites(templateId);
    } else {
      addToFavorites(templateId);
    }
  };

  const isFavorite = (templateId) => {
    return favorites.includes(templateId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
};

export default useFavorites;