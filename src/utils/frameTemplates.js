// Templates de cadres pour la personnalisation avancée du QR code

export const frameTemplates = {
  none: {
    id: 'none',
    name: 'Aucun cadre',
    category: 'basic',
    thickness: 0,
    defaultColors: ['transparent'],
    textPosition: 'none',
    preview: null
  },
  modern: {
    id: 'modern',
    name: 'Moderne',
    category: 'business',
    thickness: [4, 8, 12, 16],
    defaultColors: ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981'],
    textPosition: 'bottom',
    borderRadius: 12,
    preview: 'M0,12 Q0,0 12,0 L88,0 Q100,0 100,12 L100,88 Q100,100 88,100 L12,100 Q0,100 0,88 Z'
  },
  classic: {
    id: 'classic',
    name: 'Classique',
    category: 'traditional',
    thickness: [2, 4, 6, 8],
    defaultColors: ['#000000', '#374151', '#6B7280', '#1F2937'],
    textPosition: 'bottom',
    borderRadius: 0,
    preview: 'M0,0 L100,0 L100,100 L0,100 Z'
  },
  rounded: {
    id: 'rounded',
    name: 'Arrondi',
    category: 'modern',
    thickness: [6, 10, 14, 18],
    defaultColors: ['#EF4444', '#F97316', '#EAB308', '#84CC16'],
    textPosition: 'bottom',
    borderRadius: 25,
    preview: 'M0,25 Q0,0 25,0 L75,0 Q100,0 100,25 L100,75 Q100,100 75,100 L25,100 Q0,100 0,75 Z'
  },
  square: {
    id: 'square',
    name: 'Carré strict',
    category: 'minimal',
    thickness: [3, 6, 9, 12],
    defaultColors: ['#1F2937', '#374151', '#4B5563', '#6B7280'],
    textPosition: 'bottom',
    borderRadius: 0,
    preview: 'M0,0 L100,0 L100,100 L0,100 Z'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    category: 'clean',
    thickness: [1, 2, 3, 4],
    defaultColors: ['#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'],
    textPosition: 'bottom',
    borderRadius: 4,
    preview: 'M0,4 Q0,0 4,0 L96,0 Q100,0 100,4 L100,96 Q100,100 96,100 L4,100 Q0,100 0,96 Z'
  },
  decorative: {
    id: 'decorative',
    name: 'Décoratif',
    category: 'artistic',
    thickness: [8, 12, 16, 20],
    defaultColors: ['#EC4899', '#8B5CF6', '#06B6D4', '#10B981'],
    textPosition: 'bottom',
    borderRadius: 20,
    preview: 'M0,20 Q0,0 20,0 L80,0 Q100,0 100,20 L100,80 Q100,100 80,100 L20,100 Q0,100 0,80 Z',
    pattern: 'decorative'
  },
  professional: {
    id: 'professional',
    name: 'Professionnel',
    category: 'business',
    thickness: [4, 6, 8, 10],
    defaultColors: ['#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6'],
    textPosition: 'bottom',
    borderRadius: 8,
    preview: 'M0,8 Q0,0 8,0 L92,0 Q100,0 100,8 L100,92 Q100,100 92,100 L8,100 Q0,100 0,92 Z'
  },
  creative: {
    id: 'creative',
    name: 'Créatif',
    category: 'artistic',
    thickness: [6, 10, 14, 18],
    defaultColors: ['#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    textPosition: 'bottom',
    borderRadius: 15,
    preview: 'M0,15 Q0,0 15,0 L85,0 Q100,0 100,15 L100,85 Q100,100 85,100 L15,100 Q0,100 0,85 Z',
    gradient: true
  }
};

export const getFrameTemplate = (id) => {
  return frameTemplates[id] || frameTemplates.none;
};

export const getFramesByCategory = (category) => {
  return Object.values(frameTemplates).filter(frame => frame.category === category);
};

export const getAllFrameCategories = () => {
  const categories = [...new Set(Object.values(frameTemplates).map(frame => frame.category))];
  return categories.map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    frames: getFramesByCategory(cat)
  }));
};