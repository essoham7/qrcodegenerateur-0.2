// Bibliothèque de formes pour les modules QR et styles de coins

export const moduleShapes = {
  square: {
    id: 'square',
    name: 'Carré',
    description: 'Forme carrée standard',
    render: 'square',
    // Ajout d'une vraie représentation SVG
    svgPath: 'M 4 4 L 20 4 L 20 20 L 4 20 Z',
    preview: '⬛'
  },
  circle: {
    id: 'circle',
    name: 'Cercle',
    category: 'rounded',
    path: 'M0.5,0 A0.5,0.5 0 1,1 0.5,1 A0.5,0.5 0 1,1 0.5,0',
    cornerOptions: ['smooth'],
    preview: '●'
  },
  diamond: {
    id: 'diamond',
    name: 'Losange',
    category: 'geometric',
    path: 'M0.5,0 L1,0.5 L0.5,1 L0,0.5 Z',
    cornerOptions: ['sharp', 'rounded'],
    preview: '◆'
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagone',
    category: 'geometric',
    path: 'M0.25,0 L0.75,0 L1,0.5 L0.75,1 L0.25,1 L0,0.5 Z',
    cornerOptions: ['sharp', 'rounded'],
    preview: '⬢'
  },
  star: {
    id: 'star',
    name: 'Étoile',
    category: 'decorative',
    path: 'M0.5,0 L0.6,0.35 L1,0.35 L0.7,0.6 L0.8,1 L0.5,0.75 L0.2,1 L0.3,0.6 L0,0.35 L0.4,0.35 Z',
    cornerOptions: ['sharp'],
    preview: '★'
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    category: 'geometric',
    path: 'M0.5,0 L1,1 L0,1 Z',
    cornerOptions: ['sharp', 'rounded'],
    preview: '▲'
  },
  heart: {
    id: 'heart',
    name: 'Cœur',
    category: 'decorative',
    path: 'M0.5,1 C0.5,1 0,0.6 0,0.3 C0,0.1 0.1,0 0.25,0 C0.4,0 0.5,0.1 0.5,0.3 C0.5,0.1 0.6,0 0.75,0 C0.9,0 1,0.1 1,0.3 C1,0.6 0.5,1 0.5,1 Z',
    cornerOptions: ['smooth'],
    preview: '♥'
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    category: 'geometric',
    path: 'M0.3,0 L0.7,0 L0.7,0.3 L1,0.3 L1,0.7 L0.7,0.7 L0.7,1 L0.3,1 L0.3,0.7 L0,0.7 L0,0.3 L0.3,0.3 Z',
    cornerOptions: ['square', 'rounded'],
    preview: '✚'
  }
};

export const cornerStyles = {
  square: {
    id: 'square',
    name: 'Carré',
    radius: 0,
    description: 'Coins droits et nets'
  },
  rounded: {
    id: 'rounded',
    name: 'Arrondi',
    radius: 0.2,
    description: 'Coins légèrement arrondis'
  },
  beveled: {
    id: 'beveled',
    name: 'Biseauté',
    radius: 0.1,
    description: 'Coins coupés en biais',
    bevel: true
  },
  smooth: {
    id: 'smooth',
    name: 'Lisse',
    radius: 0.3,
    description: 'Coins très arrondis'
  },
  sharp: {
    id: 'sharp',
    name: 'Pointu',
    radius: 0,
    description: 'Coins très nets et précis'
  }
};

export const finderPatternStyles = {
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'Motif de détection classique',
    outerShape: 'square',
    innerShape: 'square'
  },
  rounded: {
    id: 'rounded',
    name: 'Arrondi',
    description: 'Motif avec coins arrondis',
    outerShape: 'rounded-square',
    innerShape: 'circle'
  },
  circular: {
    id: 'circular',
    name: 'Circulaire',
    description: 'Motif entièrement circulaire',
    outerShape: 'circle',
    innerShape: 'circle'
  },
  diamond: {
    id: 'diamond',
    name: 'Losange',
    description: 'Motif en forme de losange',
    outerShape: 'diamond',
    innerShape: 'diamond'
  }
};

export const getModuleShape = (id) => {
  return moduleShapes[id] || moduleShapes.square;
};

export const getCornerStyle = (id) => {
  return cornerStyles[id] || cornerStyles.square;
};

export const getFinderPatternStyle = (id) => {
  return finderPatternStyles[id] || finderPatternStyles.standard;
};

export const getShapesByCategory = (category) => {
  return Object.values(moduleShapes).filter(shape => shape.category === category);
};

export const getModuleShapesByCategory = (category) => {
  return getShapesByCategory(category);
};

// ✅ CORRECTION : Fonction pour récupérer toutes les formes de modules
export const getAllModuleShapes = () => {
  return Object.values(moduleShapes);
};

export const getCornerStyles = () => {
  return Object.values(cornerStyles);
};

export const getFinderPatternStyles = () => {
  return Object.values(finderPatternStyles);
};

export const getAllShapeCategories = () => {
  const categories = [...new Set(Object.values(moduleShapes).map(shape => shape.category))];
  return categories.map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    shapes: getShapesByCategory(cat)
  }));
};