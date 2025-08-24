const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'public', 'placeholder.png')
const outDir = path.join(__dirname, '..', 'public', 'icons')
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json')
const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx')

if (!fs.existsSync(src)) {
  console.error('Source placeholder image not found at', src)
  process.exit(1)
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

console.log('Running pwa-asset-generator... this may take a few seconds')

const args = [src, outDir, '--manifest', '--manifest-path', manifestPath, '--index', 'false']
const proc = spawn('npx', ['pwa-asset-generator', ...args], { stdio: 'inherit', shell: true })

proc.on('exit', (code) => {
  if (code !== 0) {
    console.error('pwa-asset-generator failed with code', code)
    process.exit(code)
  }

  // After generating assets, try to read icons and create apple-touch-startup-image links
  const files = fs.readdirSync(outDir)
  const splashFiles = files.filter(f => f.startsWith('apple-splash') || f.includes('splash'))
  const iconFiles = files.filter(f => f.startsWith('icon') || f.includes('icon'))

  // Find the best icon for apple-touch-icon in metadata
  const iconLink = iconFiles.find(f => f.includes('512')) || iconFiles[0] || 'placeholder-logo.png'
  const iconPath = `/icons/${iconLink}`

  // Update layout.tsx metadata
  let layout = fs.readFileSync(layoutPath, 'utf8')
  
  // Update the apple icon path in metadata
  layout = layout.replace(
    /apple: ["']\/[^"']+["']/,
    `apple: "${iconPath}"`
  )
  
  // Update the regular icon path in metadata
  layout = layout.replace(
    /icon: ["']\/[^"']+["']/,
    `icon: "${iconPath}"`
  )

  // Update the apple-touch-startup-image in the head section if splash files exist
  if (splashFiles.length > 0) {
    const primarySplash = splashFiles.find(f => f.includes('2732x2732')) || splashFiles[0]
    const splashPath = `/icons/${primarySplash}`
    layout = layout.replace(
      /<link rel="apple-touch-startup-image" href="[^"]+"/,
      `<link rel="apple-touch-startup-image" href="${splashPath}"`
    )
  }

  fs.writeFileSync(layoutPath, layout, 'utf8')
  console.log('Updated', layoutPath)
  console.log('Generated splash files:', splashFiles)
  console.log('Generated icon files:', iconFiles)
  process.exit(0)
})
