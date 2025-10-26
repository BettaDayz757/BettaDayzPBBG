# BettaDayz - Norfolk Business Empire

A life simulation game where players build their business empire in Norfolk, VA, combining elements of BitLife, IMVU, and Torn.com. Experience the journey of an African American entrepreneur building their legacy in Norfolk's diverse business landscape.

## Game Features

- 🏢 **Business Simulation**: Real Norfolk locations and market dynamics
- 👨🏾‍💼 **Character Development**: Create and grow your entrepreneur's story
- 🤝 **Community Impact**: Network and build relationships in Norfolk
- 💰 **Multiple Income Streams**: Various business types and opportunities
- 🌆 **Local Districts**: Military Circle, Downtown, Ghent, Ocean View, and Berkley
- 📈 **Dynamic Economy**: Real-time market simulation and events

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Development

### Prerequisites

- Node.js 18 or higher
- Git
- VS Code (recommended)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Payment Integration

### Cash App Setup

1. Add your $Cashtag to `.env.local`:

```bash
CASHAPP_CASHTAG=your_cashtag
```

2. Configure verification settings in `config/payments.json`

### Bitcoin Setup

1. Add your Bitcoin address to `.env.local`:

```bash
BITCOIN_ADDRESS=your_btc_address
```

2. Configure confirmation requirements in `config/payments.json`

## Game Locations

Current implemented Norfolk districts:

- **Military Circle**
  - Tech startups
  - Retail spaces
  - Business networking events

- **Downtown Norfolk**
  - Premium office spaces
  - Entertainment venues
  - Waterfront businesses

- **Ghent District**
  - Boutique shops
  - Art galleries
  - Restaurants

- **Ocean View**
  - Beach-front properties
  - Tourism businesses
  - Seasonal events

- **Berkley**
  - Community businesses
  - Growth opportunities
  - Development projects

## Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run ci` - Run lint and tests (used in CI)
- `npm run deploy:gh-pages` - Deploy to GitHub Pages

## Deployment

### GitHub Pages

The site automatically deploys to GitHub Pages when changes are pushed to the main branch. Visit: https://bettadayz.store

1. Push your changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

2. GitHub Actions will:
   - Run tests and lint checks
   - Build the site
   - Deploy to GitHub Pages
   - Update bettadayz.store

### DNS Configuration

Add these records to your domain registrar for bettadayz.store:

```plaintext
A     @   185.199.108.153
A     @   185.199.109.153
A     @   185.199.110.153
A     @   185.199.111.153
CNAME www bettadayz757.github.io
```

## Contributing

1. Create a branch for your feature
2. Make changes and test locally
3. Push and create a pull request
4. CI will run tests automatically

## License

MIT - See [LICENSE](LICENSE) for details