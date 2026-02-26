import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileImage, 
  FileText, 
  Image as ImageIcon, 
  Printer,
  Settings,
  Check,
  Loader2
} from 'lucide-react';
import { getExportPresetsByCategory, getExportPreset } from '../utils/stylePresets';
import { qrExportSystem } from '../utils/exportSystem';

const ExportPanel = ({ 
  canvas, 
  customization, 
  onExport 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedPreset, setSelectedPreset] = useState('web');
  const [customDimensions, setCustomDimensions] = useState({ width: 512, height: 512 });
  const [customDPI, setCustomDPI] = useState(300);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formats = [
    { id: 'png', name: 'PNG', icon: FileImage, description: 'Haute qualité avec transparence' },
    { id: 'jpg', name: 'JPG', icon: ImageIcon, description: 'Taille optimisée' },
    { id: 'svg', name: 'SVG', icon: FileText, description: 'Vectoriel, redimensionnable' },
    { id: 'pdf', name: 'PDF', icon: Printer, description: 'Prêt pour impression' }
  ];

  const webPresets = getExportPresetsByCategory('web');
  const printPresets = getExportPresetsByCategory('print');

  const handleExport = async () => {
    if (!canvas) {
      console.error('Canvas non disponible');
      return;
    }

    setIsExporting(true);
    
    try {
      const preset = getExportPreset(selectedPreset);
      const customOptions = showAdvanced ? {
        dimensions: customDimensions,
        dpi: customDPI
      } : {};

      const result = await qrExportSystem.exportQRCode(
        canvas,
        selectedFormat,
        selectedPreset,
        customOptions
      );

      // Télécharger le fichier
      qrExportSystem.downloadFile(result);
      
      // Notifier le parent
      if (onExport) {
        onExport(result);
      }

    } catch (error) {
      console.error('Erreur export:', error);
      // Ici on pourrait afficher une notification d'erreur
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintQualityExport = async () => {
    setSelectedFormat('png');
    setSelectedPreset('printHD');
    setShowAdvanced(false);
    
    // Attendre un peu pour que l'état se mette à jour
    setTimeout(() => {
      handleExport();
    }, 100);
  };

  const getFileSizeEstimate = () => {
    const preset = getExportPreset(selectedPreset);
    const dimensions = showAdvanced ? customDimensions : preset.dimensions;
    const dpi = showAdvanced ? customDPI : preset.dpi;
    
    const sizeBytes = qrExportSystem.getFileSizeEstimate(dimensions, selectedFormat, dpi);
    
    if (sizeBytes < 1024) return `${sizeBytes} B`;
    if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
    return `${Math.round(sizeBytes / (1024 * 1024))} MB`;
  };

  const FormatCard = ({ format, isSelected }) => {
    const Icon = format.icon;
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        onClick={() => setSelectedFormat(format.id)}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon size={18} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
          <span className="font-medium text-sm">{format.name}</span>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <Check size={10} className="text-white" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-gray-600">{format.description}</p>
      </motion.div>
    );
  };

  const PresetButton = ({ preset, isSelected }) => (
    <button
      onClick={() => setSelectedPreset(preset.id)}
      className={`w-full p-2 text-left rounded-lg transition-colors ${
        isSelected 
          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="font-medium text-sm">{preset.name}</div>
      <div className="text-xs opacity-75">
        {preset.dimensions.width}×{preset.dimensions.height} • {preset.dpi} DPI
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Bouton Print Quality en évidence */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePrintQualityExport}
        disabled={isExporting || !canvas}
        className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Printer size={20} />
        )}
        Print Quality (HD)
      </motion.button>

      {/* Sélection de format */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Format</h3>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((format) => (
            <FormatCard
              key={format.id}
              format={format}
              isSelected={selectedFormat === format.id}
            />
          ))}
        </div>
      </div>

      {/* Presets de qualité */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Qualité</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Web</h4>
            <div className="space-y-1">
              {webPresets.map((preset) => (
                <PresetButton
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset === preset.id}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Impression</h4>
            <div className="space-y-1">
              {printPresets.map((preset) => (
                <PresetButton
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPreset === preset.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Options avancées */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Settings size={16} />
          Options avancées
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dimensions (px)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customDimensions.width}
                  onChange={(e) => setCustomDimensions({
                    ...customDimensions,
                    width: parseInt(e.target.value) || 512
                  })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  min="100"
                  max="4096"
                />
                <span className="text-xs text-gray-500 self-center">×</span>
                <input
                  type="number"
                  value={customDimensions.height}
                  onChange={(e) => setCustomDimensions({
                    ...customDimensions,
                    height: parseInt(e.target.value) || 512
                  })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  min="100"
                  max="4096"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                DPI
              </label>
              <input
                type="number"
                value={customDPI}
                onChange={(e) => setCustomDPI(parseInt(e.target.value) || 300)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                min="72"
                max="1200"
                step="1"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Informations sur l'export */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Aperçu export</h4>
        <div className="space-y-1 text-xs text-blue-700">
          <div>Format: {selectedFormat.toUpperCase()}</div>
          <div>Taille estimée: {getFileSizeEstimate()}</div>
          <div>
            Dimensions: {showAdvanced 
              ? `${customDimensions.width}×${customDimensions.height}px`
              : `${getExportPreset(selectedPreset).dimensions.width}×${getExportPreset(selectedPreset).dimensions.height}px`
            }
          </div>
        </div>
      </div>

      {/* Bouton d'export principal */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={isExporting || !canvas}
        className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        {isExporting ? 'Export en cours...' : 'Télécharger'}
      </motion.button>
    </div>
  );
};

export default ExportPanel;