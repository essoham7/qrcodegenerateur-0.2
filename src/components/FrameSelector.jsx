import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, X } from 'lucide-react';
import { getAllFrameCategories, getFramesByCategory, getFrameTemplate } from '../utils/frameTemplates';

const FrameSelector = ({ 
  selectedFrame, 
  frameColors, 
  onFrameChange, 
  onColorsChange 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('modern');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const categories = getAllFrameCategories();
  const frames = getFramesByCategory(selectedCategory);

  const handleFrameSelect = (frameId) => {
    const frame = getFrameTemplate(frameId);
    onFrameChange(frame);
  };

  const handleColorChange = (colorType, color) => {
    onColorsChange({
      ...frameColors,
      [colorType]: color
    });
  };

  const FramePreview = ({ frame, isSelected }) => {
    // Get the thickness value - use first value if array, or the value itself if number
    const thickness = Array.isArray(frame.thickness) ? frame.thickness[0] : (frame.thickness || 2);
    const borderRadius = frame.borderRadius || 0;
    
    // Ensure thickness is a valid number
    const validThickness = isNaN(thickness) ? 2 : Math.max(0, thickness);
    
    // Calculate dimensions safely
    const rectX = validThickness;
    const rectY = validThickness;
    const rectWidth = Math.max(0, 64 - validThickness * 2);
    const rectHeight = Math.max(0, 64 - validThickness * 2);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        onClick={() => handleFrameSelect(frame.id)}
      >
        {/* Aperçu du cadre */}
        <div className="w-16 h-16 mx-auto mb-2 relative">
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full"
            style={{ 
              stroke: frameColors?.primary || frame.defaultColors?.[0] || '#000',
              fill: frameColors?.secondary || frame.defaultColors?.[1] || 'none'
            }}
          >
            {/* Cadre de base */}
            <rect
              x={rectX}
              y={rectY}
              width={rectWidth}
              height={rectHeight}
              strokeWidth={validThickness}
              rx={borderRadius}
            />
          
            {/* Pattern spécifique au cadre */}
            {frame.preview && (
              <g dangerouslySetInnerHTML={{ __html: frame.preview }} />
            )}
            
            {/* QR code simulé */}
            <g fill="currentColor">
              <rect x="20" y="20" width="4" height="4" />
              <rect x="28" y="20" width="4" height="4" />
              <rect x="36" y="20" width="4" height="4" />
              <rect x="20" y="28" width="4" height="4" />
              <rect x="36" y="28" width="4" height="4" />
              <rect x="20" y="36" width="4" height="4" />
              <rect x="28" y="36" width="4" height="4" />
              <rect x="36" y="36" width="4" height="4" />
            </g>
          </svg>
        </div>

        {/* Nom du cadre */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-800">{frame.name}</div>
          <div className="text-xs text-gray-500">{frame.category}</div>
        </div>

        {/* Indicateur de sélection */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <Check size={14} className="text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  };

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

  return (
    <div className="space-y-6">
      {/* Sélection de catégorie */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de cadre */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Cadres</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Option "Aucun cadre" */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
              !selectedFrame || selectedFrame.id === 'none'
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => onFrameChange(null)}
          >
            <div className="w-16 h-16 mx-auto mb-2 relative">
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-800">Aucun cadre</div>
              <div className="text-xs text-gray-500">QR code sans bordure</div>
            </div>
            {(!selectedFrame || selectedFrame.id === 'none') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Check size={14} className="text-white" />
              </motion.div>
            )}
          </motion.div>

          {frames.map((frame) => (
            <FramePreview
              key={frame.id}
              frame={frame}
              isSelected={selectedFrame?.id === frame.id}
            />
          ))}
        </div>
      </div>

      {/* Personnalisation des couleurs */}
      {selectedFrame && (
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
                label="Couleur principale"
                value={frameColors?.primary || selectedFrame.defaultColors?.primary || '#000000'}
                onChange={(color) => handleColorChange('primary', color)}
              />
              
              {selectedFrame.defaultColors?.secondary && (
                <ColorPicker
                  label="Couleur secondaire"
                  value={frameColors?.secondary || selectedFrame.defaultColors?.secondary || '#ffffff'}
                  onChange={(color) => handleColorChange('secondary', color)}
                />
              )}
              
              {selectedFrame.defaultColors?.accent && (
                <ColorPicker
                  label="Couleur d'accent"
                  value={frameColors?.accent || selectedFrame.defaultColors?.accent || '#0066cc'}
                  onChange={(color) => handleColorChange('accent', color)}
                />
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Informations sur le cadre sélectionné */}
      {selectedFrame && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">
            {selectedFrame.name}
          </h4>
          <p className="text-xs text-blue-600">
            Épaisseur: {selectedFrame.thickness}px • 
            Position texte: {selectedFrame.textPosition}
          </p>
        </div>
      )}
    </div>
  );
};

export default FrameSelector;