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

1. Install dependencies:

   ```bash
   npm install
   ```

1. Start the development server:

   ```bash
   npm run dev
   ```

1. Open [http://localhost:5173](http://localhost:5173) in your browser

## Payment Integration

### Cash App Setup

1. Add your $Cashtag to `.env.local`:

   ```bash
   CASHAPP_CASHTAG=your_cashtag
   ```

1. Configure verification settings in `config/payments.json`

### Bitcoin Setup

1. Add your Bitcoin address to `.env.local`:

   ```bash
   BITCOIN_ADDRESS=your_btc_address
   ```

1. Configure confirmation requirements in `config/payments.json`
