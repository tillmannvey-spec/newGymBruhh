const { spawn } = require('child_process')
let lt = null;
try {
  lt = require('localtunnel');
} catch (e) {
  lt = null;
}
let qrcode = null;
try {
  qrcode = require('qrcode-terminal');
} catch (e) {
  qrcode = null;
}

// Start Next: try production `next start` first, otherwise fallback to `next dev`.
const port = process.env.PORT || 3000

function startNextStart() {
  return spawn('npx', ['next', 'start', '-p', port], { stdio: 'inherit', shell: true })
}

function startNextDev() {
  return spawn('npx', ['next', 'dev', '-p', port], { stdio: 'inherit', shell: true })
}

async function createTunnel() {
  const options = { port: Number(port) }
  if (process.env.TUNNEL_SUBDOMAIN) options.subdomain = process.env.TUNNEL_SUBDOMAIN
  if (lt) {
    try {
      const tunnel = await lt(options)
      console.log('Tunnel URL:', tunnel.url);
      if (qrcode) {
        qrcode.generate(tunnel.url, { small: true });
      }
      tunnel.on('close', () => {
        console.log('Tunnel closed');
        process.exit(0);
      });
      return tunnel;
    } catch (err) {
      console.error('Failed to create tunnel (module):', err)
    }
  }

  // Fallback to CLI `npx localtunnel` if module not available or failed
  return new Promise((resolve, reject) => {
    console.log('Falling back to `npx localtunnel` CLI')
    const args = ['localtunnel', '--port', String(options.port)]
    if (options.subdomain) args.push('--subdomain', options.subdomain)
    const proc = spawn('npx', args, { stdio: ['ignore', 'pipe', 'inherit'], shell: true })
    proc.stdout.on('data', (chunk) => {
      const text = chunk.toString()
      process.stdout.write(text)
      const m = text.match(/your url is: (https?:\/\/\S+)/i) || text.match(/(https?:\/\/\S+\.loca\.lt)/i)
      if (m) {
        const url = m[1]
        console.log('Tunnel URL:', url);
        if (qrcode) {
          qrcode.generate(url, { small: true });
        }
        resolve({ url, close: () => proc.kill() });
      }
      if (code !== 0) reject(new Error('localtunnel CLI exited with ' + code))
    })
  })
}

async function main() {
  let nextProc = null
  try {
    console.log('Attempting to run `next start` (production)...')
    nextProc = startNextStart()
  } catch (e) {
    console.log('`next start` failed, falling back to `next dev`')
    nextProc = startNextDev()
  }

  // If `next start` exits quickly with code != 0, fallback to dev
  nextProc.on('exit', (code) => {
    if (code !== 0) {
      console.log('`next start` exited with', code, '- starting `next dev`')
      nextProc = startNextDev()
    }
  })

  // Create the tunnel after a short delay to let server bind
  setTimeout(async () => {
    await createTunnel()
  }, 1400)

  process.on('SIGINT', () => {
    if (nextProc) nextProc.kill('SIGINT')
    process.exit(0)
  })
}

main()
