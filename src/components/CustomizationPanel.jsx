import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Frame, 
  Shapes, 
  Download, 
  Palette, 
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import FrameSelector from './FrameSelector';
import ShapeSelector from './ShapeSelector';
import ExportPanel from './ExportPanel';
import StylePresets from './StylePresets';
import { getStylePreset } from '../utils/stylePresets';

const CustomizationPanel = ({ 
  isOpen, 
  onToggle, 
  customization, 
  onCustomizationChange,
  onExport,
  canvas
}) => {
  const [activeTab, setActiveTab] = useState('presets');

  const tabs = [
    { id: 'presets', label: 'Presets', icon: Palette },
    { id: 'frames', label: 'Cadres', icon: Frame },
    { id: 'shapes', label: 'Formes', icon: Shapes },
    { id: 'export', label: 'Export', icon: Download }
  ];

  const handleCustomizationUpdate = (updates) => {
    onCustomizationChange({
      ...customization,
      ...updates
    });
  };

  return (
    <>
      {/* Bouton d'ouverture/fermeture */}
      <motion.button
        onClick={onToggle}
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors ${
          isOpen ? 'right-80' : 'right-0'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </motion.button>

      {/* Panneau latéral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
              onClick={onToggle}
            />

            {/* Panneau */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* En-tête */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Settings className="text-blue-600" size={20} />
                  <h2 className="font-semibold text-gray-800">Personnalisation</h2>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Onglets */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Contenu des onglets */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-4"
                  >
                    {activeTab === 'presets' && (
                      <StylePresets
                        selectedPreset={customization.preset?.id || customization.preset}
                        onPresetChange={(presetId) => {
                          const preset = getStylePreset(presetId);
                          if (preset) {
                            console.log('🎨 Application du preset:', preset);
                            // ✅ CORRECTION : Extraire les settings correctement depuis config
                            if (!preset.config) {
                              console.error('❌ Preset sans config:', preset);
                              return;
                            }
                            // Appliquer toute la configuration du preset
                            handleCustomizationUpdate({
                              preset: preset,
                              frameStyle: preset.config.frameStyle || null,
                              frameColors: preset.config.frameColors || { primary: '#000000', secondary: '#FFFFFF' },
                              moduleShape: preset.config.moduleShape,
                              cornerStyle: preset.config.cornerStyle,
                              finderPattern: preset.config.finderPattern,
                              colors: preset.config.colors
                            });
                          }
                        }}
                        onApplyPreset={(presetConfig) => {
                          console.log('🎨 Application config preset:', presetConfig);
                          handleCustomizationUpdate(presetConfig);
                        }}
                      />
                    )}

                    {activeTab === 'frames' && (
                      <FrameSelector
                        selectedFrame={customization.frameStyle}
                        frameColors={customization.frameColors}
                        onFrameChange={(frameStyle) => handleCustomizationUpdate({ frameStyle })}
                        onColorsChange={(frameColors) => handleCustomizationUpdate({ frameColors })}
                      />
                    )}

                    {activeTab === 'shapes' && (
                      <ShapeSelector
                        moduleShape={customization.moduleShape}
                        cornerStyle={customization.cornerStyle}
                        finderPattern={customization.finderPattern}
                        colors={customization.colors}
                        onShapeChange={(moduleShape) => handleCustomizationUpdate({ moduleShape })}
                        onCornerChange={(cornerStyle) => handleCustomizationUpdate({ cornerStyle })}
                        onFinderChange={(finderPattern) => handleCustomizationUpdate({ finderPattern })}
                        onColorsChange={(colors) => handleCustomizationUpdate({ colors })}
                      />
                    )}

                    {activeTab === 'export' && (
                      <ExportPanel
                        canvas={canvas}
                        customization={customization}
                        onExport={onExport}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pied de page avec aperçu rapide */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-600 mb-2">Aperçu actuel :</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {customization.frameStyle?.name || 'Aucun cadre'}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                    {customization.moduleShape?.name || 'Carré'}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomizationPanel;