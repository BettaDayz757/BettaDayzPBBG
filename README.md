# BettaDayz - Norfolk Business Empire

A life simulation game where players build their business empire in Norfolk, VA, combining elements of BitLife, IMVU, and Torn.com. Experience the journey of an African American entrepreneur building their legacy in Norfolk's diverse business landscape.

## 🎮 Game Features

- 🏢 **Business Simulation**: Real Norfolk locations and market dynamics
- 👨🏾‍💼 **Character Development**: Create and grow your entrepreneur's story
- 🤝 **Community Impact**: Network and build relationships in Norfolk
- 💰 **Multiple Income Streams**: Various business types and opportunities
- 🌆 **Local Districts**: Military Circle, Downtown, Ghent, Ocean View, and Berkley
- 📈 **Dynamic Economy**: Real-time market simulation and events

## 🚀 Quick Start

This project uses **pnpm** as its package manager. Make sure you have Node.js 18+ installed.

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test

# Build for production
pnpm run build

# Deploy to GitHub Pages
pnpm run deploy:gh-pages
```

### 🌐 Live Demo

Visit the live game at: **https://bettadayz757.github.io/BettaDayzPBBG/**

## 💻 Development

### Prerequisites

- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **pnpm** - Fast, disk space efficient package manager
- **Git** - Version control
- **VS Code** (recommended) - Code editor

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
   cd BettaDayzPBBG
   ```

2. **Install pnpm:**

   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Start the development server:**

   ```bash
   pnpm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### 🎮 Game Features

The game includes several interactive systems:

- **Character Creation** - Customize your entrepreneur's appearance and background
- **Business Management** - Start and grow various business types across Norfolk
- **Community Events** - Participate in local Norfolk events and build relationships
- **Real Estate** - Buy and upgrade properties in different districts
- **Dynamic Economy** - Market conditions affect your business performance
- **Achievement System** - Unlock achievements as you progress

### 📁 Project Structure

```
BettaDayzPBBG/
├── app/
│   ├── components/        # React components
│   │   ├── CharacterCustomization.jsx
│   │   ├── GameMain.jsx
│   │   ├── GameContainer.jsx
│   │   ├── CommunityHub.jsx
│   │   └── PaymentInterface.jsx
│   ├── game/              # Game logic
│   │   ├── business-simulation.js
│   │   ├── game-constants.js
│   │   └── norfolk-events.js
│   ├── routes/            # Remix routes
│   ├── styles/            # CSS/styling
│   └── utils/             # Utility functions
├── public/                # Static assets
├── config/                # Configuration files
└── package.json           # Project dependencies
```

### ✅ Technology Stack

- **Frontend Framework** - [Remix](https://remix.run/) - Full stack web framework
- **UI Library** - React 18 with Hooks
- **Styling** - Tailwind CSS for responsive design
- **Build Tool** - Vite for fast development and optimized builds
- **Type Safety** - TypeScript for better code quality
- **Package Manager** - pnpm for efficient dependency management
- **Deployment** - GitHub Pages ready with automated workflows

### 🎯 Game Districts

Experience Norfolk's diverse business landscape across five unique districts:

1. **Military Circle** - Military-adjacent businesses and services
2. **Downtown Norfolk** - Corporate offices and high-end retail
3. **Ghent** - Arts, culture, and boutique businesses
4. **Ocean View** - Tourism and beachfront enterprises
5. **Berkley** - Industrial and manufacturing opportunities

### 🔄 Development Roadmap

- [x] Character creation system
- [x] Business simulation engine
- [x] Community interaction hub
- [x] Payment/transaction system
- [x] Norfolk district mapping
- [ ] Multiplayer features
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Seasonal events system
- [ ] Trading marketplace

## 🚧 Deployment

### GitHub Pages Deployment

BettaDayz is configured for easy deployment to GitHub Pages:

1. **Build the project:**
   ```bash
   pnpm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   pnpm run deploy:gh-pages
   ```

The game will be available at: `https://bettadayz757.github.io/BettaDayzPBBG/`

### Manual Deployment

You can also use the GitHub Actions workflow for automatic deployment:

1. Push changes to the `main` or `gh-pages` branch
2. GitHub Actions will automatically build and deploy the app
3. Check the Actions tab in GitHub to monitor deployment status

## 🛠️ Available Scripts

- **`pnpm run dev`** - Start development server
- **`pnpm run build`** - Build for production
- **`pnpm run start`** - Run production build locally
- **`pnpm run preview`** - Build and preview production
- **`pnpm test`** - Run test suite
- **`pnpm run typecheck`** - TypeScript type checking
- **`pnpm run lint`** - Check code quality
- **`pnpm run lint:fix`** - Fix linting issues automatically
- **`pnpm run deploy:gh-pages`** - Deploy to GitHub Pages

## 🤝 Contributing

We welcome contributions to BettaDayz! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation as needed
- Keep PRs focused on a single feature or fix

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Remix](https://remix.run/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by the entrepreneurial spirit of Norfolk, VA

## 📧 Contact

- **GitHub**: [@BettaDayz757](https://github.com/BettaDayz757)
- **Website**: [bettadayz.store](https://bettadayz.store)
- **Issues**: [GitHub Issues](https://github.com/BettaDayz757/BettaDayzPBBG/issues)

---

**Built with ❤️ in Norfolk, VA** 🌊
