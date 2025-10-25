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
  console.error('Source docs folder not found. Tried:', candidates.join(', '))
  process.exit(1)
}

console.log('Removing existing docs folder at', dest)
fs.rmSync(dest, { recursive: true, force: true })

console.log('Copying', src, 'to', dest)
// fs.cpSync is available on Node 16.7+
fs.cpSync(src, dest, { recursive: true })
console.log('Done')
