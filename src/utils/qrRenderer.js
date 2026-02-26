import QRCode from 'qrcode';

/**
 * Classe pour le rendu avancé des QR codes
 * Gère les formes personnalisées, les dégradés, les cadres et les logos
 */
export class AdvancedQRRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * Rendu principal du QR code avec personnalisations
   */
  async renderCustomQR(text, config) {
    if (!this.canvas || !text) {
      console.error('Canvas ou texte manquant');
      return;
    }

    const {
      size = 256,
      margin = 8,
      colors = { foreground: '#000000', background: '#ffffff', finder: '#000000' },
      moduleShape,
      cornerStyle,
      finderPattern,
      frameStyle,
      frameColors,
      logo
    } = config;

    try {
      // Logs de débogage pour identifier les problèmes
      console.log('🎨 Configuration reçue:', {
        moduleShape: moduleShape,
        cornerStyle: cornerStyle,
        finderPattern: finderPattern,
        frameStyle: frameStyle,
        colors: colors
      });

      // Vérifier que les objets sont bien structurés
      const safeModuleShape = moduleShape && typeof moduleShape === 'object' && moduleShape.id ? moduleShape : { id: 'square', name: 'Carré' };
      const safeCornerStyle = cornerStyle && typeof cornerStyle === 'object' && cornerStyle.id ? cornerStyle : { id: 'square', name: 'Carré' };
      const safeFinderPattern = finderPattern && typeof finderPattern === 'object' && finderPattern.id ? finderPattern : { id: 'standard', name: 'Standard' };

      console.log('🔧 Objets sécurisés:', {
        safeModuleShape: safeModuleShape,
        safeCornerStyle: safeCornerStyle,
        safeFinderPattern: safeFinderPattern
      });

      console.log('🎨 Début du rendu QR avancé', { size, text: text.substring(0, 20) });

      // Configuration du canvas
      this.canvas.width = size;
      this.canvas.height = size;
      
      // Génération des données QR
      const qrData = await QRCode.create(text, {
        errorCorrectionLevel: 'M',
        margin: 0, // Géré manuellement
      });

      console.log('✅ Données QR générées', { moduleCount: qrData.modules.size });

      // Effacement du canvas
      this.ctx.clearRect(0, 0, size, size);
      
      // ✅ NOUVEAU : Appliquer clipping si cadre arrondi
      if (frameStyle && frameStyle.id === 'rounded') {
        console.log('🔄 Application du clipping arrondi pour cadre:', frameStyle.id);
        this.applyRoundedClipping(size, frameStyle.width || 20);
      }
      
      // Fond
      this.ctx.fillStyle = colors.background || '#FFFFFF';
      this.ctx.fillRect(0, 0, size, size);

      // Calcul des dimensions
      const modules = qrData.modules;
      const moduleCount = modules.size;
      const qrSize = size - (margin * 2);
      const moduleSize = qrSize / moduleCount;
      const offsetX = margin;
      const offsetY = margin;

      console.log('📐 Dimensions calculées', { moduleCount, moduleSize, qrSize });

      // Rendu des modules
      this.ctx.fillStyle = colors.foreground || '#000000';
      
      let renderedModules = 0;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules.get(row, col)) {
            const x = offsetX + col * moduleSize;
            const y = offsetY + row * moduleSize;
            
            // Vérification si c'est un détecteur de position
            const isFinderPattern = this.isInFinderPattern(row, col, moduleCount);
            
            if (isFinderPattern && safeFinderPattern && safeFinderPattern.id !== 'standard') {
              this.renderFinderPattern(x, y, moduleSize, safeFinderPattern, colors.foreground);
            } else {
              // Toujours utiliser renderModule pour une cohérence, même pour les carrés
              if (safeModuleShape && safeModuleShape.id && safeModuleShape.id !== 'square') {
                // Ajouter des logs pour déboguer
                if (renderedModules < 5) { // Limiter les logs aux premiers modules
                  console.log('🔧 Rendu module personnalisé:', safeModuleShape.id, 'à position', row, col);
                }
              }
              this.renderModule(x, y, moduleSize, safeModuleShape, safeCornerStyle);
            }
            renderedModules++;
          }
        }
      }

      console.log('✅ Modules rendus:', renderedModules);

      // ✅ Restaurer l'état du clipping si appliqué
      if (frameStyle && frameStyle.id === 'rounded') {
        console.log('🔄 Restauration de l\'état du clipping');
        this.ctx.restore();
      }

      // Rendu du cadre si présent
      if (frameStyle && frameStyle.id && frameStyle.id !== 'none') {
        console.log('🖼️ Rendu du cadre:', frameStyle.id, 'avec couleurs:', frameColors);
        this.renderFrame(frameStyle, frameColors, size);
      } else {
        console.log('🚫 Pas de cadre à rendre:', frameStyle);
      }

      // Rendu du logo si présent
      if (logo) {
        console.log('🖼️ Rendu du logo');
        await this.renderLogo(logo, size);
      }

      console.log('✅ Rendu QR avancé terminé');

    } catch (error) {
      console.error('❌ Erreur lors du rendu du QR code:', error);
      this.renderError(size, error.message);
    }
  }

  /**
   * Vérifie si une position fait partie d'un détecteur de position
   */
  isInFinderPattern(row, col, moduleCount) {
    const isTopLeft = row < 9 && col < 9;
    const isTopRight = row < 9 && col >= moduleCount - 8;
    const isBottomLeft = row >= moduleCount - 8 && col < 9;
    return isTopLeft || isTopRight || isBottomLeft;
  }

  /**
   * Rendu d'un module individuel avec forme personnalisée
   */
  renderModule(x, y, size, moduleShape, cornerStyle) {
    this.ctx.save();
    
    // Vérifier si on doit appliquer des coins arrondis
    const shouldRoundCorners = cornerStyle && cornerStyle.id !== 'square' && cornerStyle.radius > 0;
    
    if (shouldRoundCorners) {
      this.renderRoundedModule(x, y, size, cornerStyle);
    } else {
      switch (moduleShape.id) {
        case 'circle':
          this.renderCircleModule(x, y, size);
          break;
        case 'diamond':
          this.renderDiamondModule(x, y, size);
          break;
        case 'hexagon':
          this.renderHexagonModule(x, y, size);
          break;
        case 'triangle':
          this.renderTriangleModule(x, y, size);
          break;
        case 'star':
          this.renderStarModule(x, y, size);
          break;
        default:
          this.ctx.fillRect(x, y, size, size);
      }
    }
    
    this.ctx.restore();
  }

  /**
   * Rendu d'un module circulaire
   */
  renderCircleModule(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /**
   * Rendu d'un module en losange
   */
  renderDiamondModule(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + size/2, y);
    this.ctx.lineTo(x + size, y + size/2);
    this.ctx.lineTo(x + size/2, y + size);
    this.ctx.lineTo(x, y + size/2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu d'un module hexagonal
   */
  renderHexagonModule(x, y, size) {
    const centerX = x + size/2;
    const centerY = y + size/2;
    const radius = size/2;
    
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = centerX + radius * Math.cos(angle);
      const py = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu d'un module triangulaire
   */
  renderTriangleModule(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + size/2, y);
    this.ctx.lineTo(x + size, y + size);
    this.ctx.lineTo(x, y + size);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu d'un module en étoile
   */
  renderStarModule(x, y, size) {
    const centerX = x + size/2;
    const centerY = y + size/2;
    const outerRadius = size/2;
    const innerRadius = size/4;
    const spikes = 5;
    
    this.ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = centerX + radius * Math.cos(angle - Math.PI/2);
      const py = centerY + radius * Math.sin(angle - Math.PI/2);
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu d'un module avec coins arrondis
   */
  renderRoundedModule(x, y, size, cornerStyle) {
    const radius = Math.min((cornerStyle.radius || 0.2) * size, size / 2);
    
    this.ctx.beginPath();
    
    // Haut gauche
    this.ctx.moveTo(x + radius, y);
    // Haut droite
    this.ctx.lineTo(x + size - radius, y);
    this.ctx.arcTo(x + size, y, x + size, y + radius, radius);
    // Bas droite
    this.ctx.lineTo(x + size, y + size - radius);
    this.ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
    // Bas gauche
    this.ctx.lineTo(x + radius, y + size);
    this.ctx.arcTo(x, y + size, x, y + size - radius, radius);
    // Retour haut gauche
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu des détecteurs de position personnalisés
   */
  renderFinderPattern(x, y, size, pattern, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    
    switch (pattern.id) {
      case 'rounded':
        this.renderRoundedFinderPattern(x, y, size);
        break;
      case 'circle':
        this.renderCircularFinderPattern(x, y, size);
        break;
      case 'diamond':
        this.renderDiamondFinderPattern(x, y, size);
        break;
      default:
        this.ctx.fillRect(x, y, size, size);
    }
    
    this.ctx.restore();
  }

  /**
   * Rendu d'un détecteur de position arrondi
   */
  renderRoundedFinderPattern(x, y, size) {
    const radius = size * 0.2;
    this.ctx.beginPath();
    
    // Utiliser moveTo et arcTo pour créer des coins arrondis
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + size - radius, y);
    this.ctx.arcTo(x + size, y, x + size, y + radius, radius);
    this.ctx.lineTo(x + size, y + size - radius);
    this.ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
    this.ctx.lineTo(x + radius, y + size);
    this.ctx.arcTo(x, y + size, x, y + size - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu d'un détecteur de position circulaire
   */
  renderCircularFinderPattern(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /**
   * Rendu d'un détecteur de position en losange
   */
  renderDiamondFinderPattern(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + size/2, y);
    this.ctx.lineTo(x + size, y + size/2);
    this.ctx.lineTo(x + size/2, y + size);
    this.ctx.lineTo(x, y + size/2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Rendu du cadre décoratif
   */
  renderFrame(frameStyle, frameColors, size) {
    if (!frameStyle || frameStyle.id === 'none') {
      console.log('🚫 Pas de cadre à afficher');
      return;
    }

    this.ctx.save();

    const { primary = '#000000', secondary = '#FFFFFF' } = frameColors || {};
    const frameWidth = frameStyle.width || 20;

    console.log('🖼️ Rendu cadre:', {
      type: frameStyle.id,
      width: frameWidth,
      colors: { primary, secondary }
    });

    // Correspondance directe par ID
    const renderMap = {
      'simple': () => this.renderSimpleFrame(primary, frameWidth, size),
      'gradient': () => this.renderGradientFrame(primary, secondary, frameWidth, size),
      'decorative': () => this.renderDecorativeFrame(primary, secondary, frameWidth, size),
      'rounded': () => this.renderRoundedFrame(primary, frameWidth, size),
      'shadow': () => this.renderShadowFrame(primary, secondary, frameWidth, size),
      'neon': () => this.renderNeonFrame(primary, secondary, frameWidth, size)
    };

    const renderFunction = renderMap[frameStyle.id];

    if (renderFunction) {
      renderFunction();
    } else {
      console.warn('⚠️ Type de cadre non reconnu:', frameStyle.id);
      // ✅ Ne rien faire au lieu de rendre un cadre par défaut
    }

    this.ctx.restore();
  }

  /**
   * Rendu d'un cadre simple
   */
  renderSimpleFrame(color, width, size) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, size - width, size - width);
  }

  /**
   * Rendu d'un cadre avec dégradé
   */
  renderGradientFrame(color1, color2, width, size) {
    const gradient = this.ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, size - width, size - width);
  }

  /**
   * Rendu d'un cadre décoratif
   */
  renderDecorativeFrame(color1, color2, width, size) {
    // Cadre externe
    this.ctx.strokeStyle = color1;
    this.ctx.lineWidth = width * 0.6;
    this.ctx.strokeRect(width/4, width/4, size - width/2, size - width/2);
    
    // Cadre interne
    this.ctx.strokeStyle = color2;
    this.ctx.lineWidth = width * 0.4;
    this.ctx.strokeRect(width * 0.75, width * 0.75, size - width * 1.5, size - width * 1.5);
  }

  /**
   * Rendu d'un cadre arrondi
   */
  renderRoundedFrame(color, width, size) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    
    const radius = width * 2;
    const x = width/2;
    const y = width/2;
    const w = size - width;
    const h = size - width;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + w - radius, y);
    this.ctx.arcTo(x + w, y, x + w, y + radius, radius);
    this.ctx.lineTo(x + w, y + h - radius);
    this.ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    this.ctx.lineTo(x + radius, y + h);
    this.ctx.arcTo(x, y + h, x, y + h - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  /**
   * Rendu d'un cadre avec ombre
   */
  renderShadowFrame(color1, color2, width, size) {
    // Ombre
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = width / 2;
    this.ctx.shadowOffsetX = width / 4;
    this.ctx.shadowOffsetY = width / 4;

    this.ctx.strokeStyle = color1;
    this.ctx.lineWidth = width;
    this.ctx.strokeRect(width/2, width/2, size - width, size - width);

    // Réinitialiser l'ombre
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  /**
   * Rendu d'un cadre néon
   */
  renderNeonFrame(color1, color2, width, size) {
    // Effet néon avec plusieurs couches
    this.ctx.shadowColor = color2;
    this.ctx.shadowBlur = width;

    this.ctx.strokeStyle = color1;
    this.ctx.lineWidth = width * 0.3;
    this.ctx.strokeRect(width/2, width/2, size - width, size - width);

    this.ctx.shadowBlur = width * 2;
    this.ctx.strokeRect(width/2, width/2, size - width, size - width);

    // Réinitialiser
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
  }

  /**
   * Rendu du logo
   */
  async renderLogo(logoSrc, canvasSize) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const logoSize = canvasSize * 0.2;
          const x = (canvasSize - logoSize) / 2;
          const y = (canvasSize - logoSize) / 2;
          
          // Fond blanc pour le logo
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
          
          // Logo
          this.ctx.drawImage(img, x, y, logoSize, logoSize);
          console.log('✅ Logo rendu avec succès');
          resolve();
        } catch (error) {
          console.error('❌ Erreur rendu logo:', error);
          reject(error);
        }
      };
      img.onerror = (error) => {
        console.error('❌ Erreur chargement logo:', error);
        reject(error);
      };
      img.src = logoSrc;
    });
  }

  /**
   * Rendu d'erreur
   */
  renderError(size, message = 'Erreur') {
    this.ctx.fillStyle = '#FEE2E2';
    this.ctx.fillRect(0, 0, size, size);
    
    this.ctx.fillStyle = '#DC2626';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('❌ Erreur', size/2, size/2 - 10);
    
    this.ctx.font = '12px Arial';
    this.ctx.fillText(message, size/2, size/2 + 15);
  }

  /**
   * ✅ SOLUTION 5 : Appliquer un clipping arrondi pour les cadres arrondis
   */
  applyRoundedClipping(size, frameWidth = 20) {
    const radius = frameWidth * 0.8; // Rayon proportionnel à l'épaisseur du cadre
    
    this.ctx.save();
    this.ctx.beginPath();
    
    // Utiliser roundRect si disponible, sinon fallback manuel
    if (this.ctx.roundRect) {
      this.ctx.roundRect(0, 0, size, size, radius);
    } else {
      // Fallback manuel pour les navigateurs qui ne supportent pas roundRect
      this.ctx.moveTo(radius, 0);
      this.ctx.lineTo(size - radius, 0);
      this.ctx.arcTo(size, 0, size, radius, radius);
      this.ctx.lineTo(size, size - radius);
      this.ctx.arcTo(size, size, size - radius, size, radius);
      this.ctx.lineTo(radius, size);
      this.ctx.arcTo(0, size, 0, size - radius, radius);
      this.ctx.lineTo(0, radius);
      this.ctx.arcTo(0, 0, radius, 0, radius);
    }
    
    this.ctx.clip();
  }
}