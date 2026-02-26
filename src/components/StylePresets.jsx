import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { stylePresets, getAllPresetCategories, getPresetsByCategory } from '../utils/stylePresets';

const StylePresets = ({ 
  selectedPreset, 
  onPresetChange, 
  onApplyPreset 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('professional');
  const categories = getAllPresetCategories();
  
  const categoryLabels = {
    professional: 'Professionnel',
    artistic: 'Artistique',
    clean: 'Épuré',
    retro: 'Rétro',
    contemporary: 'Contemporain',
    technology: 'Technologie',
    luxury: 'Luxe'
  };

  const handlePresetSelect = (preset) => {
    // Appliquer d'abord le preset
    onApplyPreset({
      ...preset.config,
      preset: preset // Inclure les infos du preset pour déclencher le re-rendu
    });
    // Puis mettre à jour la sélection
    onPresetChange(preset.id);
  };

  const presetsInCategory = getPresetsByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Palette className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Styles prédéfinis</h3>
          <p className="text-sm text-gray-600">Choisissez un style pour votre QR code</p>
        </div>
      </div>

      {/* Sélecteur de catégorie */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Catégories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category] || category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grille des presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          Styles {categoryLabels[selectedCategory] || selectedCategory}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {presetsInCategory.map((preset) => (
            <motion.div
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePresetSelect(preset)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedPreset === preset.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              {/* Indicateur de sélection */}
              {selectedPreset === preset.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              <div className="flex items-start gap-4">
                {/* Icône du preset */}
                <div className="text-2xl">{preset.preview}</div>
                
                {/* Informations du preset */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {preset.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-3">
                    {preset.description}
                  </p>
                  
                  {/* Aperçu des couleurs */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Couleurs:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.config.colors.foreground }}
                        title="Couleur principale"
                      />
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.config.colors.background }}
                        title="Couleur de fond"
                      />
                      {preset.config.frameStyle?.color && (
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: preset.config.frameStyle.color }}
                          title="Couleur du cadre"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails techniques */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {preset.config.moduleShape}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {preset.config.cornerStyle}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {preset.config.finderPattern}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Note d'aide */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Astuce:</strong> Sélectionnez un style prédéfini pour appliquer automatiquement 
          toutes les personnalisations. Vous pourrez ensuite les modifier individuellement.
        </p>
      </div>
    </div>
  );
};

export default StylePresets;