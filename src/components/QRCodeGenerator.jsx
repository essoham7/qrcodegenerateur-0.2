import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  Palette,
  Type,
  Settings,
  Copy,
  Check,
  FileImage,
  FileText,
  File,
  Sparkles,
} from "lucide-react";
import QRCode from "qrcode.react";
import QRCodeLib from "qrcode";
import jsPDF from "jspdf";
import { Button, Input, Card, ColorPicker } from "./ui";
import CustomizationPanel from "./CustomizationPanel";
import { AdvancedQRRenderer } from "../utils/qrRenderer";
import { getFrameTemplate } from "../utils/frameTemplates";
import {
  getModuleShape,
  getCornerStyle,
  getFinderPatternStyle,
} from "../utils/shapeLibrary";
import { getStylePreset } from "../utils/stylePresets";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://example.com");
  const [color, setColor] = useState("#6366F1");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logo, setLogo] = useState(null);
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [downloadFormat, setDownloadFormat] = useState("png");

  // Nouveaux états pour la personnalisation avancée
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  const [advancedCanvas, setAdvancedCanvas] = useState(null);
  const [customization, setCustomization] = useState({
    colors: {
      foreground: "#6366F1",
      background: "#FFFFFF",
    },
    moduleShape: { id: 'square', name: 'Carré' },
    cornerStyle: { id: 'square', name: 'Carrés' },
    finderPattern: { id: 'standard', name: 'Standard' },
    frameStyle: null,
    frameColors: { primary: '#000000', secondary: '#FFFFFF' },
    preset: null,
  });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const qrRenderer = useRef(null);

  const logoSizeRatio = 0.2;

  // Initialiser le renderer avancé
  useEffect(() => {
    if (useAdvancedMode && canvasRef.current && !qrRenderer.current) {
      qrRenderer.current = new AdvancedQRRenderer(canvasRef.current);
      setAdvancedCanvas(canvasRef.current);
    }

    // Nettoyer le renderer quand on quitte le mode avancé
    return () => {
      if (!useAdvancedMode && qrRenderer.current) {
        qrRenderer.current = null;
        setAdvancedCanvas(null);
      }
    };
  }, [useAdvancedMode]);

  // Mettre à jour le QR code avancé quand les paramètres changent
  useEffect(() => {
    if (!useAdvancedMode || !qrRenderer.current || !text || !canvasRef.current) {
      return;
    }

    const renderQR = () => {
      const renderSize = Math.min(size, 280);

      console.log('📐 Redimensionnement canvas:', renderSize);

      // Redimensionner le canvas
      canvasRef.current.width = renderSize;
      canvasRef.current.height = renderSize;

      const config = {
        text,
        size: renderSize,
        margin: 8,
        frameStyle: customization.frameStyle,
        frameColors: customization.frameColors,
        moduleShape: customization.moduleShape,
        cornerStyle: customization.cornerStyle,
        finderPattern: customization.finderPattern,
        colors: customization.colors,
        logo
      };

      console.log('🎨 Config complète:', config);

      qrRenderer.current.renderCustomQR(text, config).catch((error) => {
        console.error('❌ Erreur rendu QR:', error);
      });
    };

    // ✅ Utiliser setTimeout pour éviter les rendus multiples
    const timeoutId = setTimeout(renderQR, 100);

    return () => clearTimeout(timeoutId);
  }, [useAdvancedMode, text, size, customization, logo]); // ✅ Inclure size

  // useEffect spécifique pour les changements de preset
  useEffect(() => {
    if (useAdvancedMode && qrRenderer.current && text && canvasRef.current && customization.preset) {
      // Forcer un re-rendu immédiat quand un preset est appliqué
      const renderSize = Math.min(size, 280);
      canvasRef.current.width = renderSize;
      canvasRef.current.height = renderSize;

      const config = {
        text,
        size: renderSize,
        margin: 8,
        frameStyle: customization.frameStyle,
        frameColors: customization.frameColors,
        moduleShape: customization.moduleShape,
        cornerStyle: customization.cornerStyle,
        finderPattern: customization.finderPattern,
        colors: customization.colors,
        logo,
      };

      qrRenderer.current.renderCustomQR(text, config).catch((error) => {
        console.error("Erreur lors du rendu du QR code avancé:", error);
      });
    }
  }, [customization.preset, useAdvancedMode, text, size, logo]);

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleCustomizationChange = useCallback((updates) => {
    console.log('🔧 Mise à jour customisation:', updates);

    setCustomization(prev => {
      const newCustomization = { ...prev, ...updates };
      console.log('✅ Nouvelle customisation:', newCustomization);
      
      // Synchroniser les couleurs avec le mode simple si nécessaire
      if (updates.colors) {
        setColor(newCustomization.colors.foreground);
        setBgColor(newCustomization.colors.background);
      }
      
      return newCustomization;
    });
  }, []);

  const handleAdvancedModeToggle = useCallback(() => {
    setUseAdvancedMode(!useAdvancedMode);
    if (!useAdvancedMode) {
      // Synchroniser les couleurs avec le mode avancé
      setCustomization((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          foreground: color,
          background: bgColor,
        },
      }));
    } else {
      // Synchroniser les couleurs avec le mode simple
      setColor(customization.colors.foreground);
      setBgColor(customization.colors.background);
    }
  }, [useAdvancedMode, color, bgColor, customization.colors]);

  const handleExport = useCallback((exportResult) => {
    console.log("Export terminé:", exportResult);
    // Ici on pourrait afficher une notification de succès
  }, []);

  const handleLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSizeChange = useCallback((e) => {
    setSize(parseInt(e.target.value));
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [text]);

  const downloadAsPNG = useCallback(() => {
    const qrCodeContainer = document.querySelector(".qr-code-container");
    const canvas = qrCodeContainer.querySelector("canvas");

    if (!canvas) return;

    const mergedCanvas = document.createElement("canvas");
    const scale = 2; // Higher resolution
    mergedCanvas.width = canvas.width * scale;
    mergedCanvas.height = canvas.height * scale;
    const mergedContext = mergedCanvas.getContext("2d");

    // Enable image smoothing for better quality
    mergedContext.imageSmoothingEnabled = true;
    mergedContext.imageSmoothingQuality = "high";

    // Scale and draw the QR code
    mergedContext.scale(scale, scale);
    mergedContext.drawImage(canvas, 0, 0);

    if (logo) {
      const logoImage = new Image();
      logoImage.onload = () => {
        const logoSize = size * logoSizeRatio;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        // Add white background for logo
        mergedContext.fillStyle = "#FFFFFF";
        mergedContext.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);

        mergedContext.drawImage(logoImage, x, y, logoSize, logoSize);

        // Download
        const dataURL = mergedCanvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "qrcode.png";
        link.click();
      };
      logoImage.src = logo;
    } else {
      const dataURL = mergedCanvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "qrcode.png";
      link.click();
    }
  }, [logo, size, logoSizeRatio]);

  const downloadAsSVG = useCallback(async () => {
    try {
      const svgString = await QRCodeLib.toString(text, {
        type: "svg",
        width: size,
        color: {
          dark: color,
          light: bgColor,
        },
        margin: 2,
      });

      let finalSvg = svgString;

      // Add logo if present
      if (logo) {
        const logoSize = size * logoSizeRatio;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Insert logo into SVG
        const logoElement = `
          <rect x="${logoX - 4}" y="${logoY - 4}" width="${
          logoSize + 8
        }" height="${logoSize + 8}" fill="white" rx="4"/>
          <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" href="${logo}" />
        `;

        finalSvg = svgString.replace("</svg>", logoElement + "</svg>");
      }

      const blob = new Blob([finalSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.svg";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la génération SVG:", error);
    }
  }, [text, color, bgColor, size, logo, logoSizeRatio]);

  const downloadAsPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate QR code position (centered)
      const qrSize = Math.min(pageWidth - 40, pageHeight - 60); // Leave margins
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 30;

      // Generate QR code as data URL
      const dataURL = await QRCodeLib.toDataURL(text, {
        width: qrSize * 2, // Higher resolution
        color: {
          dark: color,
          light: bgColor,
        },
        margin: 2,
      });

      // Add QR code to PDF
      pdf.addImage(dataURL, "PNG", qrX, qrY, qrSize, qrSize);

      // Add logo if present
      if (logo) {
        const logoSize = qrSize * logoSizeRatio;
        const logoX = qrX + (qrSize - logoSize) / 2;
        const logoY = qrY + (qrSize - logoSize) / 2;

        // Add white background for logo
        pdf.setFillColor(255, 255, 255);
        pdf.rect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4, "F");

        pdf.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);
      }

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("QR Code", pageWidth / 2, 20, { align: "center" });

      // Add content info
      pdf.setFontSize(10);
      pdf.text(
        `Contenu: ${text.length > 50 ? text.substring(0, 50) + "..." : text}`,
        20,
        qrY + qrSize + 20
      );
      pdf.text(`Taille: ${size}×${size}px`, 20, qrY + qrSize + 30);
      pdf.text(`Format: PDF`, 20, qrY + qrSize + 40);

      pdf.save("qrcode.pdf");
    } catch (error) {
      console.error("Erreur lors de la génération PDF:", error);
    }
  }, [text, color, bgColor, size, logo, logoSizeRatio]);

  const handleDownloadQRCode = useCallback(() => {
    switch (downloadFormat) {
      case "png":
        downloadAsPNG();
        break;
      case "svg":
        downloadAsSVG();
        break;
      case "pdf":
        downloadAsPDF();
        break;
      default:
        downloadAsPNG();
    }
  }, [downloadFormat, downloadAsPNG, downloadAsSVG, downloadAsPDF]);

  const tabs = [
    { id: "content", label: "Contenu", icon: Type },
    { id: "style", label: "Style", icon: Palette },
    { id: "advanced", label: "Avancé", icon: Sparkles },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Controls Panel */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Générateur QR Code
            </h2>
            <p className="text-gray-600">
              Personnalisez votre QR code avec les options ci-dessous
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  console.log("Onglet sélectionné:", tab.id);
                  setActiveTab(tab.id);
                }}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow-sm border border-indigo-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === "settings" && (
                  <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-1 rounded">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Debug info */}
          <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-600">
            Onglet actuel: {activeTab} | Format: {downloadFormat}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu du QR Code
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Entrez votre texte, URL, etc."
                        className="pr-10"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {text && (
                      <p className="text-xs text-gray-500 mt-1">
                        {text.length} caractères
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "style" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Couleur du QR Code
                    </label>
                    <ColorPicker
                      value={
                        useAdvancedMode
                          ? customization.colors.foreground
                          : color
                      }
                      onChange={
                        useAdvancedMode
                          ? (newColor) =>
                              handleCustomizationChange({
                                colors: {
                                  ...customization.colors,
                                  foreground: newColor,
                                },
                              })
                          : setColor
                      }
                      presets={[
                        "#6366F1",
                        "#8B5CF6",
                        "#EC4899",
                        "#EF4444",
                        "#F59E0B",
                        "#10B981",
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Couleur de fond
                    </label>
                    <ColorPicker
                      value={
                        useAdvancedMode
                          ? customization.colors.background
                          : bgColor
                      }
                      onChange={
                        useAdvancedMode
                          ? (newColor) =>
                              handleCustomizationChange({
                                colors: {
                                  ...customization.colors,
                                  background: newColor,
                                },
                              })
                          : setBgColor
                      }
                      presets={[
                        "#FFFFFF",
                        "#F8FAFC",
                        "#F1F5F9",
                        "#E2E8F0",
                        "#CBD5E1",
                        "#94A3B8",
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Logo (optionnel)
                    </label>
                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir un logo
                      </Button>
                      {logo && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={logo}
                            alt="Logo"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Logo ajouté
                            </p>
                            <p className="text-xs text-gray-500">
                              Sera centré sur le QR code
                            </p>
                          </div>
                          <button
                            onClick={() => setLogo(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-blue-600" size={20} />
                      <h3 className="font-semibold text-blue-800">
                        Personnalisation avancée
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Activez le mode avancé pour accéder aux cadres, formes
                      personnalisées et export haute définition.
                    </p>
                    <Button
                      onClick={handleAdvancedModeToggle}
                      variant={useAdvancedMode ? "primary" : "outline"}
                      className="w-full"
                    >
                      {useAdvancedMode
                        ? "Mode avancé activé"
                        : "Activer le mode avancé"}
                    </Button>
                  </div>

                  {useAdvancedMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          ✨ Mode avancé activé ! Utilisez le panneau latéral
                          pour personnaliser votre QR code.
                        </p>
                      </div>

                      <Button
                        onClick={() => setIsCustomizationOpen(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Ouvrir le panneau de personnalisation
                      </Button>

                      {customization.preset && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <h4 className="font-medium text-purple-800 mb-1">
                            Preset actuel
                          </h4>
                          <p className="text-sm text-purple-700">
                            {customization.preset.name}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille: {size}×{size}px
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="32"
                      value={size}
                      onChange={handleSizeChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>128px</span>
                      <span>512px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Format de téléchargement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          value: "png",
                          label: "PNG",
                          icon: FileImage,
                          desc: "Image bitmap",
                        },
                        {
                          value: "svg",
                          label: "SVG",
                          icon: File,
                          desc: "Vectoriel",
                        },
                        {
                          value: "pdf",
                          label: "PDF",
                          icon: FileText,
                          desc: "Document",
                        },
                      ].map((format) => (
                        <button
                          key={format.value}
                          onClick={() => {
                            console.log("Format sélectionné:", format.value);
                            setDownloadFormat(format.value);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                            downloadFormat === format.value
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 hover:border-indigo-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <format.icon className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-sm font-medium">
                            {format.label}
                          </div>
                          <div className="text-xs opacity-75">
                            {format.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Format actuel: {downloadFormat.toUpperCase()}
                    </div>
                  </div>

                  
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Download Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleDownloadQRCode}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!text}
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger en {downloadFormat.toUpperCase()}
            </Button>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Aperçu temps réel
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-500 font-medium">
                      Mise à jour automatique
                    </p>
                  </div>
                </div>
              </div>
              {useAdvancedMode && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                    Mode Avancé
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative qr-code-container border border-gray-200 shadow-inner">
            {text ? (
              <motion.div
                key={`${text}-${color}-${bgColor}-${size}-${useAdvancedMode}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {useAdvancedMode ? (
                  // Canvas avancé pour le mode personnalisé - WRAPPER AJOUTÉ
                  <div
                    className="flex items-center justify-center overflow-hidden"
                    style={{
                      width: Math.min(size, 280),
                      height: Math.min(size, 280),
                      maxWidth: "280px",
                      maxHeight: "280px",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="border border-gray-200 rounded"
                      style={{
                        width: `${Math.min(size, 280)}px`,
                        height: `${Math.min(size, 280)}px`,
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  // QR code standard avec conteneur uniforme
                  <div
                    className="flex items-center justify-center overflow-hidden pointer-events-none select-none"
                    style={{
                      width: Math.min(size, 280),
                      height: Math.min(size, 280),
                      maxWidth: "280px",
                      maxHeight: "280px",
                    }}
                  >
                    <QRCode
                      value={text}
                      fgColor={color}
                      bgColor={bgColor}
                      size={Math.min(size, 280)}
                      level="M"
                      includeMargin={true}
                    />
                    {logo && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        src={logo}
                        alt="Logo"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-sm bg-white p-1 pointer-events-none select-none"
                        style={{
                          width: `${Math.min(size, 280) * logoSizeRatio}px`,
                          height: `${Math.min(size, 280) * logoSizeRatio}px`,
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                  <Type className="w-8 h-8 text-gray-500" />
                </div>
                <p className="font-medium">
                  Entrez du contenu pour générer votre QR code
                </p>
              </div>
            )}
          </div>

          {text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <h4 className="font-semibold text-indigo-900">
                  Informations du QR Code
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Taille:</span>
                  <span className="font-medium text-gray-700">
                    {size}×{size}px
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Format:</span>
                  <span className="font-medium text-gray-700">
                    {downloadFormat.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Correction:</span>
                  <span className="font-medium text-gray-700">Moyen</span>
                </div>
                {logo && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Logo:</span>
                    <span className="font-medium text-green-600">✓ Inclus</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Panneau de personnalisation avancée */}
      <CustomizationPanel
        isOpen={isCustomizationOpen}
        onToggle={() => setIsCustomizationOpen(!isCustomizationOpen)}
        customization={customization}
        onCustomizationChange={handleCustomizationChange}
        onExport={handleExport}
        canvas={canvasRef.current}
      />
    </div>
  );
};

export default QRCodeGenerator;
