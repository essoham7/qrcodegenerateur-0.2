# Générateur de QR Code — Personnalisation Avancée

Application web pour créer des QR codes hautement personnalisables avec aperçu en temps réel, cadres décoratifs, formes de modules, détection de coins, intégration de logo et export en haute définition.

**Stack**
- React 18 + Vite 5
- Tailwind CSS
- Librairies principales: `qrcode`, `qrcode.react`, `jspdf`, `html2canvas`, `framer-motion`, `react-hook-form`, `lucide-react`

## Fonctionnalités
- Personnalisation avancée: formes des modules (cercle, losange, hexagone, triangle, étoile), coins arrondis, motifs des détecteurs de position
- Cadres multiples: simple, dégradé, décoratif, arrondi, ombre, néon
- Logo centré avec fond blanc pour lisibilité
- Export HD: `PNG`, `SVG`, `PDF`, `JPG` avec presets de tailles/DPI
- Aperçu temps réel et presets de styles
- Système de favoris (localStorage)

## Démarrage rapide

Prérequis: Node.js 18+ recommandé

Installation des dépendances:

```bash
# avec Yarn
yarn install

# ou avec npm
npm install
```

Lancer en développement:

```bash
# Yarn
yarn dev

# npm
npm run dev
```

Construction de la version de production (sortie dans `dist`):

```bash
# Yarn
yarn build

# npm
npm run build
```

Prévisualiser le build:

```bash
# Yarn
yarn preview

# npm
npm run preview
```

## Structure clé du projet
- Composant principal: [QRCodeGenerator.jsx](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/components/QRCodeGenerator.jsx)
- Rendu avancé canvas: [qrRenderer.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/qrRenderer.js)
- Système d’export: [exportSystem.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/exportSystem.js)
- Panneau de personnalisation: [CustomizationPanel.jsx](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/components/CustomizationPanel.jsx)
- Bibliothèques de formes/cadres/presets: [shapeLibrary.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/shapeLibrary.js), [frameTemplates.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/frameTemplates.js), [stylePresets.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/stylePresets.js)

## Export et formats
- PNG/JPG: rendu bitmap haute résolution avec lissage
- SVG: export vectoriel (via Fabric ou génération `qrcode`)
- PDF: génération via `jsPDF` avec insertion du QR et du logo

Référence: [exportSystem.js](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/src/utils/exportSystem.js)

## Déploiement (Cloudflare Pages)
- Pipeline CI/CD via GitHub Actions: [deploy-prod.yml](file:///c:/Users/lqptop%203/Downloads/projects/QRCode/.github/workflows/deploy-prod.yml)
- Déclenché sur `push` vers `main`
- Utilise Node 20 et Yarn pour le build (`dist`)
- Secrets requis:
  - `CF_DEPLOY_TO_PAGES_API_TOKEN`
  - `CF_ACCOUNT_ID`

Déploiement manuel:

```bash
npx wrangler pages deploy dist --project-name=qrcodegenerator
```

## Scripts disponibles
- `start`: lance Vite
- `dev`: lance Vite en mode dev
- `build`: construit l’application dans `dist`
- `preview`: sert le build localement

Note: le script `test` actuel utilise `react-scripts` et n’est pas configuré avec Vite. Les tests seront migrés vers `Vitest` ultérieurement.

## Contribution
- Ouvrez une issue ou un pull request pour proposer des améliorations
- Respectez la structure et les conventions existantes

## Licence
Licence non spécifiée
