import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, Square, Circle, Diamond } from 'lucide-react';
import { 
  getAllModuleShapes,
  getCornerStyles, 
  getFinderPatternStyles
} from '../utils/shapeLibrary';

const ShapeSelector = ({ 
  moduleShape, 
  cornerStyle, 
  finderPattern, 
  colors,
  onShapeChange, 
  onCornerChange, 
  onFinderChange,
  onColorsChange 
}) => {
  const [activeSection, setActiveSection] = useState('modules');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // ✅ CORRECTION : Récupérer toutes les formes de modules disponibles
  const moduleShapes = getAllModuleShapes();
  const cornerStyles = getCornerStyles();
  const finderPatterns = getFinderPatternStyles();

  const handleColorChange = (colorType, color) => {
    onColorsChange({
      ...colors,
      [colorType]: color
    });
  };

  const ShapePreview = ({ shape, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={onClick}
    >
      {/* Aperçu de la forme */}
      <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
        {shape.preview ? (
          <div className="text-2xl text-gray-800 flex items-center justify-center">
            {shape.preview}
          </div>
        ) : shape.svgPath ? (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d={shape.svgPath} />
          </svg>
        ) : shape.path ? (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d={shape.path} />
          </svg>
        ) : (
          <div className="w-8 h-8 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs">
            ■
          </div>
        )}
      </div>

      {/* Nom de la forme */}
      <div className="text-center text-xs font-medium text-gray-800">
        {shape.name}
      </div>

      {/* Indicateur de sélection */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check size={12} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );

  const StylePreview = ({ style, isSelected, onClick, type }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-2 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={onClick}
    >
      {/* Aperçu du style */}
      <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center">
        {type === 'corner' ? (
          <div 
            className="w-6 h-6 border-2 border-gray-600"
            style={{ 
              borderRadius: style.id === 'rounded' ? '4px' : 
                           style.id === 'beveled' ? '2px' : '0px'
            }}
          />
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i}
                className="w-1 h-1 bg-gray-600"
                style={{
                  borderRadius: style.id === 'rounded' ? '50%' : 
                               style.id === 'circular' ? '50%' : '0px'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Nom du style */}
      <div className="text-center text-xs font-medium text-gray-800">
        {style.name}
      </div>

      {/* Indicateur de sélection */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check size={10} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  );

  const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 flex-1">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
      </div>
    </div>
  );

  const sections = [
    { id: 'modules', label: 'Modules', icon: Square },
    { id: 'corners', label: 'Coins', icon: Diamond },
    { id: 'finders', label: 'Détecteurs', icon: Circle }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation des sections */}
      <div>
        <div className="flex border-b border-gray-200">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors relative ${
                  activeSection === section.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={14} />
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSection === 'modules' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Forme des modules</h3>
            <div className="grid grid-cols-3 gap-2">
              {moduleShapes.map((shape) => (
                <ShapePreview
                  key={shape.id}
                  shape={shape}
                  isSelected={moduleShape?.id === shape.id}
                  onClick={() => onShapeChange(shape)}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'corners' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Style des coins</h3>
            <div className="grid grid-cols-3 gap-2">
              {cornerStyles.map((style) => (
                <StylePreview
                  key={style.id}
                  style={style}
                  type="corner"
                  isSelected={cornerStyle?.id === style.id}
                  onClick={() => onCornerChange(style)}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'finders' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Motifs de détection</h3>
            <div className="grid grid-cols-2 gap-2">
              {finderPatterns.map((pattern) => (
                <StylePreview
                  key={pattern.id}
                  style={pattern}
                  type="finder"
                  isSelected={finderPattern?.id === pattern.id}
                  onClick={() => onFinderChange(pattern)}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Personnalisation des couleurs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Couleurs</h3>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Palette size={16} className="text-gray-600" />
          </button>
        </div>

        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-3 bg-gray-50 rounded-lg"
          >
            <ColorPicker
              label="Modules"
              value={colors?.foreground || '#000000'}
              onChange={(color) => handleColorChange('foreground', color)}
            />
            
            <ColorPicker
              label="Arrière-plan"
              value={colors?.background || '#ffffff'}
              onChange={(color) => handleColorChange('background', color)}
            />
            
            <ColorPicker
              label="Détecteurs"
              value={colors?.finder || colors?.foreground || '#000000'}
              onChange={(color) => handleColorChange('finder', color)}
            />
          </motion.div>
        )}
      </div>

      {/* Aperçu des sélections actuelles */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Configuration actuelle</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Modules: {moduleShape?.name || 'Carré'}</div>
          <div>Coins: {cornerStyle?.name || 'Carrés'}</div>
          <div>Détecteurs: {finderPattern?.name || 'Standard'}</div>
        </div>
      </div>
    </div>
  );
};

export default ShapeSelector;