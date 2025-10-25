# BettaDayz PBBG - Monorepo

This repository combines BettaDayz PBBG with two integrated projects in a monorepo structure:

- **BettaDayz PBBG** (root) - A Life Simulation and Social Game built with Remix
- **bettadayz-draft** - Draft version of BettaDayz with experimental features
- **mern-template** - MERN stack template with client/server architecture

## Monorepo Structure

```
BettaDayzPBBG/
├── app/                    # Main BettaDayz application (Remix)
├── bettadayz-draft/        # Draft/experimental version (subtree)
├── mern-template/          # MERN template (subtree)
├── config/                 # Configuration files
├── my-workflow-app/        # Workflow application
└── package.json            # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 7+ (for workspace support)

### Installation

Install all dependencies for the monorepo and all workspaces:

```bash
npm install
```

Or use the convenience script:

```bash
npm run install:all
```

### Development

Run all workspaces in development mode:

```bash
npm run dev
```

Build all workspaces:

```bash
npm run build
```

### Workspace Management

This project uses npm workspaces to manage multiple packages. Each workspace can be run independently:

```bash
# Run commands in a specific workspace
npm run dev --workspace=bettadayz-draft
npm run build --workspace=mern-template
```

### Testing

Run tests across all workspaces:

```bash
npm test
```

## Project History

This monorepo was created by merging:
- [BettaDayz757/BettaDayzPBBGDraft](https://github.com/BettaDayz757/BettaDayzPBBGDraft) as subtree
- [krgamestudios/MERN-template](https://github.com/krgamestudios/MERN-template) as subtree

All git history from both repositories has been preserved.

## Contributing

Please see individual workspace READMEs for specific contribution guidelines:
- [bettadayz-draft/README.md](bettadayz-draft/README.md)
- [mern-template/README.md](mern-template/README.md)

## License

MIT License - See LICENSE file for details
