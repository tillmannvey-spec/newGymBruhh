const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

const srcPath = path.join(__dirname, '..', 'public', 'placeholder.png')
const outDir = path.join(__dirname, '..', 'public', 'icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

async function generate() {
  if (!fs.existsSync(srcPath)) {
    console.error('Source image not found at', srcPath)
    process.exit(1)
  }

  const image = await Jimp.read(srcPath)
  const sizes = [192, 256, 384, 512]
  for (const s of sizes) {
    const out = path.join(outDir, `icon-${s}.png`)
    const resized = image.clone().cover(s, s)
    await resized.writeAsync(out)
    console.log('Wrote', out)
  }

  // simple splash: use 2732x2732 as earlier placeholder
  const splashOut = path.join(outDir, 'apple-splash-2732x2732.png')
  const splash = image.clone().cover(2732, 2732)
  await splash.writeAsync(splashOut)
  console.log('Wrote', splashOut)

  // small manifest update (ensure icons present)
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json')
  let manifest = { name: 'GymBro', short_name: 'GymBro', start_url: '/', display: 'standalone', background_color: '#0f172a', theme_color: '#0ea5a4', icons: [] }
  try {
    const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifest = { ...manifest, ...existing }
  } catch (e) {
    // ignore
  }
  manifest.icons = sizes.map(s => ({ src: `/icons/icon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png' }))
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log('Updated manifest.json')

  // update layout.tsx metadata:
  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx')
  let layout = fs.readFileSync(layoutPath, 'utf8')
  
  // Update the apple icon path in metadata
  layout = layout.replace(
    /apple: ["']\/[^"']+["']/,
    `apple: "/icons/icon-512.png"`
  )
  
  // Update the regular icon path in metadata
  layout = layout.replace(
    /icon: ["']\/[^"']+["']/,
    `icon: "/icons/icon-512.png"`
  )

  // Update the apple-touch-startup-image in the head section
  layout = layout.replace(
    /<link rel="apple-touch-startup-image" href="[^"]+"/,
    `<link rel="apple-touch-startup-image" href="/icons/apple-splash-2732x2732.png"`
  )

  fs.writeFileSync(layoutPath, layout, 'utf8')
  console.log('Updated layout.tsx')
}

generate().catch(err => { console.error(err); process.exit(1) })
