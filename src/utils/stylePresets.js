// Presets de styles prédéfinis pour la personnalisation rapide

export const stylePresets = {
  business: {
    id: 'business',
    name: 'Business',
    description: 'Style professionnel et élégant',
    category: 'professional',
    config: {
      frameStyle: {
        type: 'professional',
        color: '#1E40AF',
        thickness: 8,
        text: ''
      },
      moduleShape: 'square',
      cornerStyle: 'rounded',
      finderPattern: 'rounded',
      colors: {
        foreground: '#1F2937',
        background: '#FFFFFF'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '🏢'
  },
  creative: {
    id: 'creative',
    name: 'Créatif',
    description: 'Style artistique et coloré',
    category: 'artistic',
    config: {
      frameStyle: {
        type: 'creative',
        color: '#EC4899',
        thickness: 12,
        text: ''
      },
      moduleShape: 'circle',
      cornerStyle: 'smooth',
      finderPattern: 'circular',
      colors: {
        foreground: '#7C3AED',
        background: '#FFFFFF'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '🎨'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Style épuré et moderne',
    category: 'clean',
    config: {
      frameStyle: {
        type: 'minimal',
        color: '#6B7280',
        thickness: 2,
        text: ''
      },
      moduleShape: 'square',
      cornerStyle: 'square',
      finderPattern: 'standard',
      colors: {
        foreground: '#374151',
        background: '#FFFFFF'
      },
      exportOptions: {
        dpi: 300,
        format: 'svg'
      }
    },
    preview: '⚪'
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    description: 'Style rétro et chaleureux',
    category: 'retro',
    config: {
      frameStyle: {
        type: 'classic',
        color: '#92400E',
        thickness: 6,
        text: ''
      },
      moduleShape: 'square',
      cornerStyle: 'beveled',
      finderPattern: 'standard',
      colors: {
        foreground: '#451A03',
        background: '#FEF3C7'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '📜'
  },
  modern: {
    id: 'modern',
    name: 'Moderne',
    description: 'Style contemporain et dynamique',
    category: 'contemporary',
    config: {
      frameStyle: {
        type: 'modern',
        color: '#06B6D4',
        thickness: 10,
        text: ''
      },
      moduleShape: 'hexagon',
      cornerStyle: 'rounded',
      finderPattern: 'rounded',
      colors: {
        foreground: '#0F172A',
        background: '#FFFFFF'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '🔷'
  },
  artistic: {
    id: 'artistic',
    name: 'Artistique',
    description: 'Style expressif et unique',
    category: 'artistic',
    config: {
      frameStyle: {
        type: 'decorative',
        color: '#8B5CF6',
        thickness: 14,
        text: ''
      },
      moduleShape: 'star',
      cornerStyle: 'sharp',
      finderPattern: 'diamond',
      colors: {
        foreground: '#581C87',
        background: '#FFFFFF'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '✨'
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Style technologique et futuriste',
    category: 'technology',
    config: {
      frameStyle: {
        type: 'modern',
        color: '#10B981',
        thickness: 8,
        text: ''
      },
      moduleShape: 'plus',
      cornerStyle: 'square',
      finderPattern: 'standard',
      colors: {
        foreground: '#065F46',
        background: '#ECFDF5'
      },
      exportOptions: {
        dpi: 300,
        format: 'svg'
      }
    },
    preview: '⚡'
  },
  elegant: {
    id: 'elegant',
    name: 'Élégant',
    description: 'Style raffiné et sophistiqué',
    category: 'luxury',
    config: {
      frameStyle: {
        type: 'rounded',
        color: '#1F2937',
        thickness: 12,
        text: ''
      },
      moduleShape: 'diamond',
      cornerStyle: 'rounded',
      finderPattern: 'circular',
      colors: {
        foreground: '#111827',
        background: '#F9FAFB'
      },
      exportOptions: {
        dpi: 300,
        format: 'png'
      }
    },
    preview: '💎'
  }
};

export const exportPresets = {
  web: {
    id: 'web',
    name: 'Web Standard',
    description: 'Optimisé pour le web',
    dimensions: { width: 512, height: 512 },
    dpi: 72,
    formats: ['png', 'svg']
  },
  webHD: {
    id: 'webHD',
    name: 'Web HD',
    description: 'Haute définition pour le web',
    dimensions: { width: 1024, height: 1024 },
    dpi: 150,
    formats: ['png', 'svg']
  },
  businessCard: {
    id: 'businessCard',
    name: 'Carte de visite',
    description: 'Format carte de visite (300 DPI)',
    dimensions: { width: 1050, height: 600 },
    dpi: 300,
    formats: ['png', 'pdf']
  },
  poster: {
    id: 'poster',
    name: 'Affiche A4',
    description: 'Format affiche A4 (300 DPI)',
    dimensions: { width: 2480, height: 3508 },
    dpi: 300,
    formats: ['png', 'svg', 'pdf']
  },
  print: {
    id: 'print',
    name: 'Impression Standard',
    description: 'Qualité d\'impression standard',
    dimensions: { width: 1200, height: 1200 },
    dpi: 300,
    formats: ['png', 'pdf']
  },
  printHD: {
    id: 'printHD',
    name: 'Print Quality HD',
    description: 'Très haute qualité d\'impression',
    dimensions: { width: 2400, height: 2400 },
    dpi: 600,
    formats: ['png', 'svg', 'pdf']
  }
};

export const getStylePreset = (id) => {
  return stylePresets[id] || stylePresets.business;
};

export const getExportPreset = (id) => {
  return exportPresets[id] || exportPresets.web;
};

export const getExportPresetsByCategory = (category) => {
  return Object.values(exportPresets).filter(preset => {
    if (category === 'web') {
      return preset.id === 'web' || preset.id === 'webHD';
    }
    if (category === 'print') {
      return preset.id === 'businessCard' || preset.id === 'poster' || preset.id === 'print' || preset.id === 'printHD';
    }
    return false;
  });
};

export const getPresetsByCategory = (category) => {
  return Object.values(stylePresets).filter(preset => preset.category === category);
};

export const getAllPresetCategories = () => {
  return [...new Set(Object.values(stylePresets).map(preset => preset.category))];
};