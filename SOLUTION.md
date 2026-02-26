🚨 PROBLÈMES IDENTIFIÉS

1. ❌ Redimensionnement ne fonctionne pas
   Symptôme : Le QR code ne se redimensionne pas quand on change la taille
2. ❌ Erreur "Type de cadre non reconnu: square"
   Symptôme : qrRenderer.js:401 ⚠️ Type de cadre non reconnu: square
3. ❌ Presets ne fonctionnent pas
   Symptôme : Sélectionner un preset ne change rien visuellement
4. ❌ Modules n'affichent rien
   Symptôme : L'onglet "Formes -> Modules" est vide
5. ❌ Cadre arrondi mais QR code carré (PROBLÈME PRINCIPAL)
   Symptôme : Le cadre prend la forme arrondie mais le QR code reste carré à l'intérieur

🛠️ SOLUTIONS COMPLÈTES
Solution 1 : Corriger l'erreur "Type de cadre non reconnu"
Le problème vient du fait que "square" n'est PAS un type de cadre, c'est l'absence de cadre.
Dans CustomizationPanel.jsx, ajoutez une option "Aucun cadre" :
jsx// ✅ CORRECTION : Ajouter option "Aucun cadre"
const FramesTab = ({ customization, onFrameSelect }) => {
const frames = getAllFrameTemplates();

return (
<div>
<h3 className="text-lg font-semibold text-gray-900 mb-4">Cadres et bordures</h3>
<p className="text-gray-600 mb-6">Ajoutez un cadre décoratif à votre QR code</p>

      <div className="grid grid-cols-2 gap-4">
        {/* ✅ AJOUT : Option "Aucun cadre" */}
        <Card
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            !customization.frameStyle || customization.frameStyle.id === 'none'
              ? 'ring-2 ring-indigo-500 bg-indigo-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onFrameSelect(null)}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <X className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900">Aucun cadre</h4>
            <p className="text-xs text-gray-500">QR code sans bordure</p>
          </div>
        </Card>

        {/* Cadres existants */}
        {frames.map((frame) => (
          <Card
            key={frame.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              customization.frameStyle?.id === frame.id
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onFrameSelect(frame)}
          >
            {/* ... reste du code ... */}
          </Card>
        ))}
      </div>
    </div>

);
};
Dans qrRenderer.js, corrigez la méthode renderFrame :
javascript// ✅ CORRECTION : Gérer l'absence de cadre
renderFrame(frameStyle, frameColors, size) {
// ✅ Vérifier si pas de cadre ou cadre "none"
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

// ✅ Correspondance directe par ID
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

Solution 2 : Corriger le redimensionnement
Dans QRCodeGenerator.jsx, le problème vient du fait que size n'est pas dans les dépendances du useEffect :
jsx// ✅ CORRECTION : Simplifier le useEffect
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

Solution 3 : Corriger les Presets
Dans stylePresets.js, vérifiez la structure :
javascript// ✅ VÉRIFICATION : Structure correcte des presets
export const stylePresets = [
{
id: 'modern',
name: 'Moderne',
category: 'Business',
description: 'Style épuré et professionnel',
preview: { color: '#6366F1' },
settings: { // ✅ IMPORTANT : Les données sont ici
colors: {
foreground: '#6366F1',
background: '#FFFFFF',
finder: '#4F46E5'
},
moduleShape: getModuleShape('circle'),
cornerStyle: getCornerStyle('rounded'),
finderPattern: getFinderPatternStyle('rounded'),
frameStyle: getFrameTemplate('simple'),
frameColors: { primary: '#6366F1', secondary: '#FFFFFF' }
}
},
// ... autres presets
];
Dans CustomizationPanel.jsx, corrigez l'application des presets :
jsx// ✅ CORRECTION : Application preset
const PresetsTab = ({ customization, onPresetSelect }) => {
const presets = getAllStylePresets();

const handlePresetClick = (preset) => {
console.log('🎨 Preset sélectionné:', preset);

    // ✅ Extraire les settings correctement
    if (!preset.settings) {
      console.error('❌ Preset sans settings:', preset);
      return;
    }

    onPresetSelect({
      preset: preset,
      frameStyle: preset.settings.frameStyle || null,
      frameColors: preset.settings.frameColors || { primary: '#000000', secondary: '#FFFFFF' },
      moduleShape: preset.settings.moduleShape,
      cornerStyle: preset.settings.cornerStyle,
      finderPattern: preset.settings.finderPattern,
      colors: preset.settings.colors
    });

};

return (
<div>
<h3 className="text-lg font-semibold text-gray-900 mb-4">Préréglages de style</h3>
<p className="text-gray-600 mb-6">Choisissez un style prédéfini pour votre QR code</p>

      <div className="grid grid-cols-2 gap-4">
        {presets.map((preset) => (
          <Card
            key={preset.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              customization.preset?.id === preset.id
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: preset.preview.color }}
              />
              <div>
                <h4 className="font-medium text-gray-900">{preset.name}</h4>
                <p className="text-xs text-gray-500">{preset.category}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{preset.description}</p>
          </Card>
        ))}
      </div>
    </div>

);
};

Solution 4 : Corriger l'affichage des modules
Dans CustomizationPanel.jsx, vérifiez l'onglet Shapes :
jsx// ✅ CORRECTION : Affichage des formes
const ShapesTab = ({ customization, onShapeChange }) => {
const moduleShapes = [
{ id: 'square', name: 'Carré', preview: '■' },
{ id: 'circle', name: 'Cercle', preview: '●' },
{ id: 'diamond', name: 'Losange', preview: '◆' },
{ id: 'hexagon', name: 'Hexagone', preview: '⬢' },
{ id: 'triangle', name: 'Triangle', preview: '▲' },
{ id: 'star', name: 'Étoile', preview: '★' }
];

const cornerStyles = [
{ id: 'square', name: 'Carré', preview: '□' },
{ id: 'rounded', name: 'Arrondi', preview: '▢' },
{ id: 'circle', name: 'Cercle', preview: '○' }
];

const finderPatterns = [
{ id: 'standard', name: 'Standard', preview: '⬛' },
{ id: 'rounded', name: 'Arrondi', preview: '⬜' },
{ id: 'circle', name: 'Cercle', preview: '⚫' },
{ id: 'diamond', name: 'Losange', preview: '◆' }
];

return (
<div className="space-y-8">
{/_ Formes des modules _/}
<div>
<h3 className="text-lg font-semibold text-gray-900 mb-4">Formes des modules</h3>
<p className="text-gray-600 mb-4">Choisissez la forme des points du QR code</p>
<div className="grid grid-cols-3 gap-3">
{moduleShapes.map((shape) => (
<button
key={shape.id}
onClick={() => onShapeChange('moduleShape', getModuleShape(shape.id))}
className={`p-4 rounded-lg border-2 transition-all text-center ${
                customization.moduleShape?.id === shape.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-600 hover:bg-gray-50'
              }`} >
<div className="text-3xl mb-2">{shape.preview}</div>
<div className="text-sm font-medium">{shape.name}</div>
</button>
))}
</div>
</div>

      {/* Style des coins */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Style des coins</h3>
        <p className="text-gray-600 mb-4">Personnalisez l'apparence des coins</p>
        <div className="grid grid-cols-3 gap-3">
          {cornerStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => onShapeChange('cornerStyle', getCornerStyle(style.id))}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                customization.cornerStyle?.id === style.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">{style.preview}</div>
              <div className="text-sm font-medium">{style.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Détecteurs de position */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détecteurs de position</h3>
        <p className="text-gray-600 mb-4">Style des carrés de positionnement</p>
        <div className="grid grid-cols-2 gap-3">
          {finderPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => onShapeChange('finderPattern', getFinderPatternStyle(pattern.id))}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                customization.finderPattern?.id === pattern.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">{pattern.preview}</div>
              <div className="text-sm font-medium">{pattern.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>

);
};

Solution 5 : Cadre arrondi avec QR code arrondi (PROBLÈME PRINCIPAL)
C'est le problème le plus important. Le cadre est arrondi mais le QR code reste carré à l'intérieur.
Dans qrRenderer.js, ajoutez un clipping arrondi :
javascript// ✅ SOLUTION : Appliquer le clipping arrondi au QR code
async renderCustomQR(text, config) {
if (!this.canvas || !text) return;

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
// Configuration du canvas
this.canvas.width = size;
this.canvas.height = size;

    // Génération des données QR
    const qrData = await QRCode.create(text, {
      errorCorrectionLevel: 'M',
      margin: 0,
      width: size,
      height: size
    });

    // Effacement du canvas
    this.ctx.clearRect(0, 0, size, size);

    // ✅ NOUVEAU : Appliquer clipping si cadre arrondi
    if (frameStyle && frameStyle.id === 'rounded') {
      this.applyRoundedClipping(size, frameStyle.width || 20);
    }

    // Fond
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, size, size);

    // Calcul des dimensions
    const modules = qrData.modules;
    const moduleCount = modules.size;
    const qrSize = size - (margin * 2);
    const moduleSize = qrSize / moduleCount;
    const offsetX = margin;
    const offsetY = margin;

    // Rendu des modules
    this.ctx.fillStyle = colors.foreground;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (modules.get(row, col)) {
          const x = offsetX + col * moduleSize;
          const y = offsetY + row * moduleSize;

          const isFinderPattern = this.isInFinderPattern(row, col, moduleCount);

          if (isFinderPattern && finderPattern) {
            this.renderFinderPattern(x, y, moduleSize, finderPattern, colors.finder);
          } else if (moduleShape) {
            this.renderModule(x, y, moduleSize, moduleShape, cornerStyle);
          } else {
            this.ctx.fillRect(x, y, moduleSize, moduleSize);
          }
        }
      }
    }

    // ✅ Restaurer clipping
    if (frameStyle && frameStyle.id === 'rounded') {
      this.ctx.restore();
    }

    // Rendu du cadre si présent
    if (frameStyle && frameStyle.id !== 'none') {
      this.renderFrame(frameStyle, frameColors, size);
    }

    // Rendu du logo si présent
    if (logo) {
      await this.renderLogo(logo, size);
    }

} catch (error) {
console.error('Erreur lors du rendu du QR code:', error);
this.renderError(size);
}
}

// ✅ NOUVELLE MÉTHODE : Clipping arrondi
applyRoundedClipping(size, frameWidth) {
this.ctx.save();

const radius = frameWidth \* 2; // Rayon adapté au cadre
const clipSize = size - frameWidth;
const clipOffset = frameWidth / 2;

this.ctx.beginPath();

if (this.ctx.roundRect) {
this.ctx.roundRect(clipOffset, clipOffset, clipSize, clipSize, radius);
} else {
// Fallback manuel
this.ctx.moveTo(clipOffset + radius, clipOffset);
this.ctx.arcTo(clipOffset + clipSize, clipOffset, clipOffset + clipSize, clipOffset + clipSize, radius);
this.ctx.arcTo(clipOffset + clipSize, clipOffset + clipSize, clipOffset, clipOffset + clipSize, radius);
this.ctx.arcTo(clipOffset, clipOffset + clipSize, clipOffset, clipOffset, radius);
this.ctx.arcTo(clipOffset, clipOffset, clipOffset + clipSize, clipOffset, radius);
}

this.ctx.closePath();
this.ctx.clip();
}

📋 CHECKLIST DE VÉRIFICATION
Après application de ces corrections :

✅ Le redimensionnement fonctionne sans erreur
✅ Pas d'erreur "Type de cadre non reconnu"
✅ Les presets changent l'aperçu visuellement
✅ L'onglet "Formes -> Modules" affiche les formes
✅ Le QR code prend la forme du cadre (arrondi si cadre arrondi)
