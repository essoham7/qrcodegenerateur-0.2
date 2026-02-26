import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Upload,
  Settings,
  Sparkles,
  Palette,
} from "lucide-react";
import { Button, Input, Card, LoadingSpinner } from "./ui";
import QRCode from "qrcode.react";
import QRCodeLib from "qrcode";
import jsPDF from "jspdf";
import { toast } from "sonner";
import CustomizationPanel from "./CustomizationPanel";
import { AdvancedQRRenderer } from "../utils/qrRenderer";
import { getFrameTemplate } from "../utils/frameTemplates";
import {
  getModuleShape,
  getCornerStyle,
  getFinderPatternStyle,
} from "../utils/shapeLibrary";
import { getStylePreset } from "../utils/stylePresets";

const TemplateForm = ({ template, onBack }) => {
  const [qrValue, setQrValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [isDownloading, setIsDownloading] = useState(false);

  // États pour le mode avancé
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(true);
  const [useAdvancedMode, setUseAdvancedMode] = useState(true);
  const [advancedCanvas, setAdvancedCanvas] = useState(null);
  const [customization, setCustomization] = useState({
    colors: {
      foreground: "#6366F1",
      background: "#FFFFFF",
    },
    moduleShape: { id: "square", name: "Carré" },
    cornerStyle: { id: "square", name: "Carrés" },
    finderPattern: { id: "standard", name: "Standard" },
    frameStyle: null,
    frameColors: { primary: "#000000", secondary: "#FFFFFF" },
    preset: null,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const formData = watch();
  const canvasRef = useRef(null);
  const qrRenderer = useRef(null);

  // Initialize advanced renderer
  useEffect(() => {
    if (useAdvancedMode && canvasRef.current && !qrRenderer.current) {
      qrRenderer.current = new AdvancedQRRenderer(canvasRef.current);
      setAdvancedCanvas(canvasRef.current);
    }

    return () => {
      if (!useAdvancedMode && qrRenderer.current) {
        qrRenderer.current = null;
        setAdvancedCanvas(null);
      }
    };
  }, [useAdvancedMode]);

  // Render advanced QR code
  useEffect(() => {
    if (
      !useAdvancedMode ||
      !qrRenderer.current ||
      !qrValue ||
      !canvasRef.current
    ) {
      return;
    }

    const renderQR = () => {
      const renderSize = 280;

      canvasRef.current.width = renderSize;
      canvasRef.current.height = renderSize;

      const config = {
        text: qrValue,
        size: renderSize,
        margin: 8,
        frameStyle: customization.frameStyle,
        frameColors: customization.frameColors,
        moduleShape: customization.moduleShape,
        cornerStyle: customization.cornerStyle,
        finderPattern: customization.finderPattern,
        colors: customization.colors,
      };

      qrRenderer.current.renderCustomQR(qrValue, config).catch((error) => {
        console.error("❌ Erreur rendu QR avancé:", error);
      });
    };

    const timeoutId = setTimeout(renderQR, 100);
    return () => clearTimeout(timeoutId);
  }, [useAdvancedMode, qrValue, customization]);

  // Generate QR code value based on template type and form data
  useEffect(() => {
    const generateQRValue = () => {
      switch (template.id) {
        case "url":
          return formData.url || "";

        case "text":
          return formData.text || "";

        case "vcard":
          const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.fullName || ""}
ORG:${formData.organization || ""}
TEL:${formData.phone || ""}
EMAIL:${formData.email || ""}
URL:${formData.website || ""}
ADR:;;${formData.address || ""};;;;
END:VCARD`;
          return vcard;

        case "email":
          const emailParams = new URLSearchParams();
          if (formData.subject) emailParams.append("subject", formData.subject);
          if (formData.body) emailParams.append("body", formData.body);
          const emailQuery = emailParams.toString();
          return `mailto:${formData.email || ""}${emailQuery ? "?" + emailQuery : ""}`;

        case "sms":
          return `sms:${formData.phone || ""}${formData.message ? "?body=" + encodeURIComponent(formData.message) : ""}`;

        case "wifi":
          return `WIFI:T:${formData.security || "WPA"};S:${formData.ssid || ""};P:${formData.password || ""};H:${formData.hidden ? "true" : "false"};;`;

        case "bitcoin":
          const btcParams = new URLSearchParams();
          if (formData.amount) btcParams.append("amount", formData.amount);
          if (formData.label) btcParams.append("label", formData.label);
          if (formData.message) btcParams.append("message", formData.message);
          const btcQuery = btcParams.toString();
          return `bitcoin:${formData.address || ""}${btcQuery ? "?" + btcQuery : ""}`;

        case "twitter":
          return `https://twitter.com/${formData.username || ""}`;

        case "facebook":
          return `https://facebook.com/${formData.username || ""}`;

        case "pdf":
        case "mp3":
        case "image":
          return formData.url || "";

        case "gallery":
          return formData.urls
            ? formData.urls
                .split("\n")
                .filter((url) => url.trim())
                .join(",")
            : "";

        case "appstore":
          const platform = formData.platform || "ios";
          const baseUrl =
            platform === "ios"
              ? "https://apps.apple.com/app/"
              : "https://play.google.com/store/apps/details?id=";
          return `${baseUrl}${formData.appId || ""}`;

        case "barcode":
          return formData.data || "";

        default:
          return "";
      }
    };

    setQrValue(generateQRValue());
  }, [formData, template.id]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      toast.success("Contenu copié dans le presse-papiers !");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  const handleCustomizationChange = useCallback((updates) => {
    console.log("🔧 Mise à jour customisation template:", updates);

    setCustomization((prev) => {
      const newCustomization = { ...prev, ...updates };
      console.log("✅ Nouvelle customisation template:", newCustomization);
      return newCustomization;
    });
  }, []);

  const handleAdvancedModeToggle = useCallback(() => {
    setUseAdvancedMode(!useAdvancedMode);
  }, [useAdvancedMode]);

  const handleExport = useCallback((exportResult) => {
    console.log("Export template terminé:", exportResult);
  }, []);

  const handleDownload = async () => {
    if (!qrValue) {
      toast.error("Aucun contenu à télécharger");
      return;
    }

    setIsDownloading(true);
    try {
      const fileName = `qr-code-${template.id}`;

      if (useAdvancedMode && canvasRef.current) {
        // Mode avancé - utiliser le canvas personnalisé
        const canvas = canvasRef.current;

        if (downloadFormat === "png") {
          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } else if (downloadFormat === "pdf") {
          const pdf = new jsPDF();
          const imgData = canvas.toDataURL("image/png");

          // Centrer le QR code dans le PDF
          const imgWidth = 100;
          const imgHeight = 100;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
          pdf.save(`${fileName}.pdf`);
        } else if (downloadFormat === "svg") {
          // Génération SVG non supportée avec le rendu avancé, fallback standard
          const svgString = await QRCodeLib.toString(qrValue, {
            type: "svg",
            width: 400,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          const blob = new Blob([svgString], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${fileName}.svg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // Mode standard - utiliser la méthode classique
        if (downloadFormat === "png") {
          const canvas = document.querySelector("#qr-code canvas");
          if (!canvas) return;

          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } else if (downloadFormat === "svg") {
          const svgString = await QRCodeLib.toString(qrValue, {
            type: "svg",
            width: 400,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          const blob = new Blob([svgString], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${fileName}.svg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        } else if (downloadFormat === "pdf") {
          const canvas = document.querySelector("#qr-code canvas");
          if (!canvas) return;

          const pdf = new jsPDF();
          const imgData = canvas.toDataURL("image/png");

          // Centrer le QR code dans le PDF
          const imgWidth = 100;
          const imgHeight = 100;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
          pdf.save(`${fileName}.pdf`);
        }
      }

      toast.success(`QR Code téléchargé en ${downloadFormat.toUpperCase()} !`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderFormFields = () => {
    switch (template.id) {
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du site web *
              </label>
              <Input
                {...register("url", {
                  required: "L'URL est requise",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                      "Veuillez entrer une URL valide (http:// ou https://)",
                  },
                })}
                placeholder="https://example.com"
                error={errors.url?.message}
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte à encoder *
              </label>
              <textarea
                {...register("text", { required: "Le texte est requis" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Entrez votre texte ici..."
              />
              {errors.text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.text.message}
                </p>
              )}
            </div>
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <Input
                  {...register("fullName", { required: "Le nom est requis" })}
                  placeholder="Jean Dupont"
                  error={errors.fullName?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organisation
                </label>
                <Input
                  {...register("organization")}
                  placeholder="Mon Entreprise"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <Input {...register("phone")} placeholder="+33 1 23 45 67 89" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email invalide",
                    },
                  })}
                  placeholder="jean@example.com"
                  error={errors.email?.message}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <Input
                {...register("website")}
                placeholder="https://monsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <Input
                {...register("address")}
                placeholder="123 Rue de la Paix, 75001 Paris"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <Input
                {...register("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email invalide",
                  },
                })}
                placeholder="contact@example.com"
                error={errors.email?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet
              </label>
              <Input {...register("subject")} placeholder="Sujet de l'email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register("body")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Corps du message..."
              />
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <Input
                {...register("phone", { required: "Le numéro est requis" })}
                placeholder="+33 6 12 34 56 78"
                error={errors.phone?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register("message")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Votre message SMS..."
                maxLength="160"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 160 caractères
              </p>
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du réseau (SSID) *
              </label>
              <Input
                {...register("ssid", { required: "Le SSID est requis" })}
                placeholder="MonWiFi"
                error={errors.ssid?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe WiFi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de sécurité
              </label>
              <select
                {...register("security")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Aucune</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                {...register("hidden")}
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Réseau masqué
              </label>
            </div>
          </div>
        );

      case "bitcoin":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Bitcoin *
              </label>
              <Input
                {...register("address", { required: "L'adresse est requise" })}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                error={errors.address?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (BTC)
              </label>
              <Input
                {...register("amount")}
                type="number"
                step="0.00000001"
                placeholder="0.001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Libellé
              </label>
              <Input {...register("label")} placeholder="Donation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Input
                {...register("message")}
                placeholder="Merci pour votre donation"
              />
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur Twitter *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  @
                </span>
                <Input
                  {...register("username", {
                    required: "Le nom d'utilisateur est requis",
                  })}
                  placeholder="moncompte"
                  className="pl-8"
                  error={errors.username?.message}
                />
              </div>
            </div>
          </div>
        );

      case "facebook":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur Facebook *
              </label>
              <Input
                {...register("username", {
                  required: "Le nom d'utilisateur est requis",
                })}
                placeholder="moncompte"
                error={errors.username?.message}
              />
            </div>
          </div>
        );

      case "pdf":
      case "mp3":
      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du fichier *
              </label>
              <Input
                {...register("url", {
                  required: "L'URL est requise",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Veuillez entrer une URL valide",
                  },
                })}
                placeholder={`https://example.com/fichier.${template.id}`}
                error={errors.url?.message}
              />
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URLs des images (une par ligne) *
              </label>
              <textarea
                {...register("urls", {
                  required: "Au moins une URL est requise",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="6"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
              />
              {errors.urls && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.urls.message}
                </p>
              )}
            </div>
          </div>
        );

      case "appstore":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plateforme *
              </label>
              <select
                {...register("platform", {
                  required: "La plateforme est requise",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="ios">App Store (iOS)</option>
                <option value="android">Google Play (Android)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de l'application *
              </label>
              <Input
                {...register("appId", { required: "L'ID est requis" })}
                placeholder={
                  formData.platform === "android"
                    ? "com.example.app"
                    : "id123456789"
                }
                error={errors.appId?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.platform === "android"
                  ? "Format: com.example.app (package name)"
                  : "Format: id123456789 (App Store ID)"}
              </p>
            </div>
          </div>
        );

      case "barcode":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Données à encoder *
              </label>
              <textarea
                {...register("data", { required: "Les données sont requises" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Entrez les données à encoder..."
              />
              {errors.data && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.data.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const IconComponent = template.icon;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux templates
          </Button>

          <div className="flex items-center mb-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} mr-4`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {template.name}
              </h1>
              <p className="text-gray-600">{template.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Configuration
              </h2>
              {/* Mode avancé toggle */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-blue-800">
                    Personnalisation avancée
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Activez le mode avancé pour accéder aux cadres, formes
                  personnalisées et styles premium.
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
                {useAdvancedMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <Button
                      onClick={() => setIsCustomizationOpen(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Ouvrir le panneau de personnalisation
                    </Button>
                  </motion.div>
                )}
              </div>
              <form className="space-y-6">{renderFormFields()}</form>
            </Card>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aperçu</h2>
                {useAdvancedMode && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                      Mode Avancé
                    </span>
                  </div>
                )}
              </div>

              {qrValue ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div
                      id="qr-code"
                      className="p-4 bg-white rounded-lg shadow-sm border"
                    >
                      {useAdvancedMode ? (
                        <div className="flex items-center justify-center">
                          <canvas
                            ref={canvasRef}
                            className="border border-gray-200 rounded"
                            style={{
                              width: "200px",
                              height: "200px",
                              maxWidth: "100%",
                              height: "auto",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        </div>
                      ) : (
                        <QRCode
                          value={qrValue}
                          size={200}
                          level="M"
                          includeMargin
                          fgColor={customization.colors.foreground}
                          bgColor={customization.colors.background}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu du QR Code
                      </label>
                      <div className="relative">
                        <textarea
                          value={qrValue}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none"
                          rows="4"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyToClipboard}
                          className="absolute top-2 right-2"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format de téléchargement
                      </label>
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="png">PNG</option>
                        <option value="svg">SVG</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isDownloading ? (
                        <>
                          <LoadingSpinner size="sm" color="white" />
                          <span className="ml-2">Téléchargement...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger le QR Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <QRCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Remplissez le formulaire pour générer le QR Code</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

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

export default TemplateForm;
