import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const ColorPicker = ({ 
  label, 
  value, 
  onChange, 
  presetColors = [
    '#000000', '#FFFFFF', '#6366F1', '#8B5CF6', '#06B6D4', 
    '#10B981', '#F59E0B', '#EF4444', '#8B5A2B', '#6B7280'
  ]
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 w-full p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
        >
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <span className="text-gray-700 font-medium">{value}</span>
          <Palette className="w-5 h-5 text-gray-400 ml-auto" />
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-200"
          >
            <div className="space-y-4">
              {/* Preset Colors */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Couleurs prédéfinies</p>
                <div className="grid grid-cols-5 gap-2">
                  {presetColors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-lg border-2 shadow-sm transition-all ${
                        value === color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Couleur personnalisée</p>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;