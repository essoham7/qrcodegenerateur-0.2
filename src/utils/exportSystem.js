// Système d'export haute définition pour QR codes personnalisés

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getExportPreset } from './stylePresets';

export class QRExportSystem {
  constructor() {
    this.supportedFormats = ['png', 'svg', 'pdf', 'jpg'];
  }

  async exportQRCode(canvas, format, preset = 'web', customOptions = {}) {
    const exportPreset = getExportPreset(preset);
    const options = {
      ...exportPreset,
      ...customOptions
    };

    try {
      switch (format.toLowerCase()) {
        case 'png':
          return await this.exportPNG(canvas, options);
        case 'jpg':
        case 'jpeg':
          return await this.exportJPG(canvas, options);
        case 'svg':
          return await this.exportSVG(canvas, options);
        case 'pdf':
          return await this.exportPDF(canvas, options);
        default:
          throw new Error(`Format non supporté: ${format}`);
      }
    } catch (error) {
      console.error('Erreur export:', error);
      throw error;
    }
  }

  async exportPNG(canvas, options) {
    const { dimensions, dpi } = options;
    const scaleFactor = dpi / 72;
    
    // Créer un canvas haute résolution
    const hdCanvas = document.createElement('canvas');
    hdCanvas.width = dimensions.width;
    hdCanvas.height = dimensions.height;
    
    const ctx = hdCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Dessiner le contenu redimensionné
    if (canvas.getElement) {
      // Fabric.js canvas
      ctx.drawImage(canvas.getElement(), 0, 0, dimensions.width, dimensions.height);
    } else {
      // Canvas HTML standard
      ctx.drawImage(canvas, 0, 0, dimensions.width, dimensions.height);
    }
    
    return {
      dataUrl: hdCanvas.toDataURL('image/png', 1.0),
      blob: await this.canvasToBlob(hdCanvas, 'image/png'),
      filename: `qr-code-${Date.now()}.png`,
      dimensions,
      dpi
    };
  }

  async exportJPG(canvas, options) {
    const { dimensions, dpi } = options;
    
    // Créer un canvas avec fond blanc pour JPG
    const hdCanvas = document.createElement('canvas');
    hdCanvas.width = dimensions.width;
    hdCanvas.height = dimensions.height;
    
    const ctx = hdCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Dessiner le contenu
    if (canvas.getElement) {
      ctx.drawImage(canvas.getElement(), 0, 0, dimensions.width, dimensions.height);
    } else {
      ctx.drawImage(canvas, 0, 0, dimensions.width, dimensions.height);
    }
    
    return {
      dataUrl: hdCanvas.toDataURL('image/jpeg', 0.95),
      blob: await this.canvasToBlob(hdCanvas, 'image/jpeg', 0.95),
      filename: `qr-code-${Date.now()}.jpg`,
      dimensions,
      dpi
    };
  }

  async exportSVG(canvas, options) {
    if (canvas.toSVG) {
      // Fabric.js canvas
      const svgString = canvas.toSVG({
        width: options.dimensions.width,
        height: options.dimensions.height,
        viewBox: {
          x: 0,
          y: 0,
          width: options.dimensions.width,
          height: options.dimensions.height
        }
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      
      return {
        dataUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
        blob,
        svgString,
        filename: `qr-code-${Date.now()}.svg`,
        dimensions: options.dimensions,
        dpi: 'vectoriel'
      };
    } else {
      throw new Error('Export SVG non supporté pour ce type de canvas');
    }
  }

  async exportPDF(canvas, options) {
    const { dimensions } = options;
    
    // Convertir les dimensions en mm pour jsPDF
    const mmWidth = dimensions.width * 0.264583; // px to mm at 96 DPI
    const mmHeight = dimensions.height * 0.264583;
    
    const pdf = new jsPDF({
      orientation: mmWidth > mmHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [mmWidth, mmHeight]
    });

    // Obtenir l'image du canvas
    let imageData;
    if (canvas.getElement) {
      // Fabric.js canvas
      imageData = canvas.toDataURL('image/png', 1.0);
    } else {
      // Canvas HTML standard
      imageData = canvas.toDataURL('image/png', 1.0);
    }

    // Ajouter l'image au PDF
    pdf.addImage(imageData, 'PNG', 0, 0, mmWidth, mmHeight, '', 'FAST');
    
    const pdfBlob = pdf.output('blob');
    const pdfDataUrl = pdf.output('dataurlstring');
    
    return {
      dataUrl: pdfDataUrl,
      blob: pdfBlob,
      filename: `qr-code-${Date.now()}.pdf`,
      dimensions: { width: mmWidth, height: mmHeight, unit: 'mm' },
      dpi: options.dpi
    };
  }

  async canvasToBlob(canvas, type, quality = 1.0) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  downloadFile(exportResult) {
    const { blob, filename } = exportResult;
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  async exportMultipleFormats(canvas, formats, preset = 'web', customOptions = {}) {
    const results = {};
    
    for (const format of formats) {
      try {
        results[format] = await this.exportQRCode(canvas, format, preset, customOptions);
      } catch (error) {
        console.error(`Erreur export ${format}:`, error);
        results[format] = { error: error.message };
      }
    }
    
    return results;
  }

  getFileSizeEstimate(dimensions, format, dpi = 300) {
    const pixelCount = dimensions.width * dimensions.height;
    
    switch (format.toLowerCase()) {
      case 'png':
        // PNG: environ 3-4 bytes par pixel pour QR codes
        return Math.round(pixelCount * 3.5);
      case 'jpg':
      case 'jpeg':
        // JPG: environ 0.5-1 byte par pixel
        return Math.round(pixelCount * 0.7);
      case 'svg':
        // SVG: taille relativement constante
        return 5000; // ~5KB
      case 'pdf':
        // PDF: similaire à PNG + overhead
        return Math.round(pixelCount * 4);
      default:
        return 0;
    }
  }

  validateExportOptions(format, options) {
    const errors = [];
    
    if (!this.supportedFormats.includes(format.toLowerCase())) {
      errors.push(`Format non supporté: ${format}`);
    }
    
    if (options.dimensions) {
      if (options.dimensions.width > 10000 || options.dimensions.height > 10000) {
        errors.push('Dimensions trop importantes (max: 10000px)');
      }
      if (options.dimensions.width < 100 || options.dimensions.height < 100) {
        errors.push('Dimensions trop petites (min: 100px)');
      }
    }
    
    if (options.dpi && (options.dpi < 72 || options.dpi > 1200)) {
      errors.push('DPI invalide (72-1200)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Instance singleton
export const qrExportSystem = new QRExportSystem();