# GitHub Copilot Instructions for BettaDayz PBBG

This document provides guidance for GitHub Copilot when working on the BettaDayz PBBG (Persistent Browser-Based Game) repository.

## Project Overview

BettaDayz PBBG is a browser-based multiplayer game application with the following characteristics:

- **Type**: Persistent Browser-Based Game (PBBG)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Live Site**: https://bettadayz.shop
- **Deployment**: Hostinger VPS (see deployment guides for configuration)

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 20.x
- **Package Manager**: npm 10.x
- **React**: 19.2.0
- **Next.js**: 16.0.0
- **TypeScript**: ^5

### Development Tools
- **Linting**: ESLint 9 with `eslint-config-next`
- **Styling**: Tailwind CSS 4 with PostCSS
- **CI/CD**: GitHub Actions

## Code Style and Standards

### General Guidelines
1. **TypeScript**: Use strict TypeScript typing throughout the codebase
2. **React**: Use functional components with hooks (React 19 standards)
3. **Next.js**: Follow Next.js 16 App Router conventions
4. **Imports**: Use path aliases with `@/*` for imports
5. **Comments**: Add comments for complex logic; follow existing comment style
6. **Functions**: Keep functions small, focused, and single-purpose
7. **Naming**: Use meaningful, descriptive variable and function names

### File Organization
- Place components in appropriate directories
- Co-locate related files (components, styles, tests)
- Use proper file naming: PascalCase for components, camelCase for utilities
- Keep `app/` directory for Next.js App Router pages and layouts

### React and Next.js Conventions
- Use Server Components by default (add `'use client'` only when needed)
- Implement proper error boundaries
- Use Next.js Image component for images
- Follow React 19 best practices (including new hooks and features)
- Implement proper loading states and suspense boundaries

### TypeScript Guidelines
- Enable strict mode
- Avoid `any` types; use proper type definitions
- Use interfaces for object shapes
- Use type aliases for unions and complex types
- Export types that are used across multiple files

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and sizing
- Use CSS modules for component-specific styles when needed

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint

# Run CI checks locally
npm run ci
```

### Testing
- Currently no test framework is set up
- When adding tests, follow React Testing Library conventions
- Ensure new features include appropriate test coverage

### Linting and Building
- Always run `npm run lint` before committing
- Fix linting errors; do not disable linting rules without good reason
- Ensure `npm run build` succeeds before submitting PRs
- CI runs lint and build checks automatically

## Project Structure

```
BettaDayzPBBG/
├── .github/              # GitHub configuration and workflows
│   └── workflows/        # GitHub Actions CI/CD workflows
├── app/                  # Next.js App Router directory
│   ├── components/       # React components
│   ├── data/            # Data files and constants
│   ├── game/            # Game-specific logic
│   ├── routes/          # Route handlers
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── my-workflow-app/     # Nested Next.js application
├── public/              # Static assets
├── docs/                # Documentation
├── .env.example         # Environment variables template
├── eslint.config.mjs    # ESLint configuration
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Common Tasks

### Adding New Components
1. Create component file in appropriate directory (e.g., `app/components/`)
2. Use TypeScript with proper prop types
3. Export component as default or named export
4. Add JSDoc comments for complex components
5. Use Tailwind CSS for styling

### Adding New Pages
1. Create files in `app/` directory following App Router conventions
2. Use `page.tsx` for route pages
3. Use `layout.tsx` for shared layouts
4. Implement proper metadata using Next.js metadata API
5. Add loading states with `loading.tsx`
6. Add error handling with `error.tsx`

### Working with Environment Variables
1. Add new variables to `.env.example`
2. Document purpose and format in comments
3. Use `process.env.VARIABLE_NAME` to access
4. Never commit actual `.env` files

### Updating Dependencies
1. Check compatibility with Next.js 16 and React 19
2. Test thoroughly after updates
3. Update package.json and package-lock.json
4. Document breaking changes in PR description

## Deployment

### Production Deployment
- **Primary**: Hostinger VPS at bettadayz.shop
- **Process Manager**: PM2 for process management
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### Alternative Deployment Options
- Cloudflare Pages (documented in `cloudflare-deployment-guide.md`)
- GitHub Pages (for static builds)

## Git and GitHub Workflow

### Branch Strategy
1. Create feature branches from `main`
2. Use descriptive branch names (e.g., `feature/add-user-profile`, `fix/login-bug`)
3. Keep commits focused and atomic
4. Write clear commit messages

### Pull Requests
1. Create PR from feature branch to `main`
2. Ensure CI checks pass (linting, building)
3. Request review from maintainers
4. Address review feedback promptly
5. Squash commits when merging (if appropriate)

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- First line: brief summary (50 chars or less)
- Add detailed description if needed
- Reference issue numbers when applicable

## CI/CD Pipelines

### Continuous Integration (`.github/workflows/ci.yml`)
Runs on every push and PR to `main`:
- Installs dependencies
- Runs linting
- Builds application
- Runs tests (when available)

### Deployment Workflows
- Multiple deployment workflows available
- Check `.github/workflows/` for specific configurations
- Deploys automatically on successful merge to `main`

## Important Considerations

### Performance
- Optimize images using Next.js Image component
- Implement code splitting and lazy loading
- Use React.memo() for expensive re-renders
- Monitor bundle size

### Security
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate user inputs
- Implement proper authentication/authorization

### Accessibility
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Browser Support
- Target modern browsers (evergreen browsers)
- Test on Chrome, Firefox, Safari, Edge
- Ensure mobile responsiveness

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Project-Specific Docs
- `README.md` - Project overview and quick start
- `CONTRIBUTING.md` - Contribution guidelines
- `DEPLOYMENT-QUICKSTART.md` - Quick deployment guide
- `HOSTINGER-DEPLOYMENT-GUIDE.md` - Hostinger VPS deployment
- `cloudflare-deployment-guide.md` - Cloudflare Pages deployment
- `PROJECT.md` - Project management and workflow

## Getting Help

1. Check existing documentation in the repository
2. Review closed issues and PRs for similar problems
3. Open a new issue with detailed description and reproduction steps
4. Follow the project's code of conduct

## Notes for Copilot

When generating code for this project:
1. **Prioritize TypeScript** with proper types over JavaScript
2. **Use Next.js 16 App Router patterns** (not Pages Router)
3. **Follow React 19 conventions** (including new hooks and features)
4. **Use Tailwind CSS** for styling (not inline styles or CSS-in-JS)
5. **Implement proper error handling** and loading states
6. **Consider mobile-first** responsive design
7. **Add meaningful comments** for complex logic
8. **Follow existing code patterns** in the repository
9. **Test suggestions** work with the project's dependencies
10. **Respect the project's architecture** and file organization
