const fs = require('fs')
const path = require('path')

const candidates = [
  path.resolve(__dirname, '..', 'my-workflow-app', 'BettaDayzPBBG', 'docs'),
  path.resolve(__dirname, '..', 'BettaDayzPBBG', 'docs'),
  path.resolve(__dirname, '..', 'docs')
]
const dest = path.resolve(__dirname, '..', 'docs')

let src = null
for (const c of candidates) {
  if (fs.existsSync(c)) {
    src = c
    break
  }
}
if (!src) {
  console.warn('Source docs folder not found. Tried:', candidates.join(', '))
  console.warn('Creating a minimal placeholder ./docs/index.html so Pages can publish a site.')
  // ensure dest exists
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })
  const html = `<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BettaDayz Docs (placeholder)</title></head><body><h1>BettaDayz</h1><p>This is a placeholder docs site. Add real docs in your nested docs folder and re-run the prepare script.</p></body></html>`
  fs.writeFileSync(path.join(dest, 'index.html'), html, 'utf8')
  console.log('Wrote placeholder at', path.join(dest, 'index.html'))
  process.exit(0)
}

console.log('Removing existing docs folder at', dest)
fs.rmSync(dest, { recursive: true, force: true })

console.log('Copying', src, 'to', dest)
// fs.cpSync is available on Node 16.7+
fs.cpSync(src, dest, { recursive: true })
console.log('Done')
