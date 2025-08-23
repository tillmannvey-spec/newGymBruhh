const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'public', 'placeholder.png')
const outDir = path.join(__dirname, '..', 'public', 'icons')
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json')
const headPath = path.join(__dirname, '..', 'app', 'head.tsx')

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

  // Build link tags
  const splashLinks = splashFiles.map(f => `      <link rel="apple-touch-startup-image" href="/icons/${f}" />`).join('\n')
  const iconLink = iconFiles.find(f => f.includes('512')) || iconFiles[0] || 'placeholder-logo.png'
  const iconTag = `      <link rel="apple-touch-icon" href="/icons/${iconLink}" />`

  // Read existing head.tsx and replace the apple-touch-startup-image/link block
  let head = fs.readFileSync(headPath, 'utf8')

  // Replace existing apple-touch-startup-image lines (simple approach)
  head = head.replace(/<link rel="apple-touch-startup-image"[\s\S]*?\/>\n?/g, '')
  head = head.replace(/<link rel="apple-touch-icon"[\s\S]*?\/>\n?/g, '')

  // Insert new tags before the final <link rel="icon"
  head = head.replace(/<link rel="icon"/, `${iconTag}\n${splashLinks}\n      <link rel=\"icon\"`)

  fs.writeFileSync(headPath, head, 'utf8')
  console.log('Updated', headPath)
  console.log('Generated splash files:', splashFiles)
  process.exit(0)
})
