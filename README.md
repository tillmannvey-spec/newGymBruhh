This repo contains a Next.js app (partial) for the GymBro fitness tracker.

What I changed to optimise for iOS / PWA:

- Added `public/manifest.json` and basic icons in `public/icons`
- Added `public/placeholder.png` (startup image placeholder)
- Added `app/head.tsx` that injects PWA and iOS meta tags
- Updated `app/layout.tsx` to rely on `app/head.tsx` and `metadata`
- Added minimal `package.json` to allow installing Next.js / React locally

Next recommended steps (run locally):

1) Install dependencies

```powershell
npm install
```

2) Generate proper PNG icons and Apple splash images (recommended):

```powershell
npx pwa-asset-generator public/placeholder.png public/icons --manifest --index public/manifest.json
```

3) Run dev server:

```powershell
npm run dev
```

Generate PWA/iOS assets (automated)

If you want to generate proper PNG icons and Apple splash images and automatically update `app/head.tsx`, run:

```powershell
npm run generate-assets
```

This uses `pwa-asset-generator` via npx and will place generated images in `public/icons` and update `app/head.tsx` with `apple-touch-startup-image` and `apple-touch-icon` links.

Notes:
- iOS (Safari) ignores `manifest.json` for home screen icons and splash images; you must add properly-sized `apple-touch-startup-image` links and `apple-touch-icon` images. The `pwa-asset-generator` tool can produce these automatically.
- I added SVG placeholders as quick stand-ins. Replace them with production PNGs for best results.
# newGymBruhh git init git add README.md git commit -m first commit git branch -M main git remote add origin https://github.com/tillmannvey-spec/newGymBruhh.git git push -u origin main
