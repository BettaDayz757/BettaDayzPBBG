# GitHub Copilot Instructions for BettaDayz PBBG

This document provides guidance for GitHub Copilot when working on this repository.

## Project Overview

BettaDayz PBBG is a persistent browser-based game (PBBG) built with Next.js, featuring 3D character customization, business simulation, and GTA-style gameplay elements set in Norfolk, Virginia.

## Technology Stack

- **Framework**: Next.js 16.0.0 with App Router
- **UI Library**: React 19.2.0
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4.x
- **Build Target**: ES2017
- **Module Resolution**: Bundler (ESM)

## Code Style and Conventions

### TypeScript
- Always use TypeScript for new files (`.ts`, `.tsx`)
- Enable strict mode checks - all code must pass TypeScript strict mode
- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object types
- Use the `@/*` path alias for imports from the root directory

### React/JSX
- Use functional components with hooks
- Prefer `jsx: "react-jsx"` runtime (no need to import React in every file)
- Follow React 19 best practices
- Use proper TypeScript types for props and state

### Styling
- Use Tailwind CSS utility classes for styling
- Reference custom colors from the Norfolk theme:
  - `norfolk-blue` (#1e40af)
  - `norfolk-navy` (#1e3a8a)
  - `norfolk-gold` (#f59e0b)
  - `norfolk-green` (#059669)
- Use custom animations defined in `tailwind.config.ts`:
  - `animate-fade-in`
  - `animate-slide-up`
  - `animate-pulse-slow`
- Use the Inter font family for consistent typography

### JavaScript/TypeScript Conventions
- Follow ESLint rules defined in `eslint.config.mjs`
- Use ESLint config from `eslint-config-next` (core-web-vitals + TypeScript)
- Target ES2017 features and syntax
- Use modern JavaScript features (async/await, destructuring, etc.)

## File Organization

### Directory Structure
```
app/
├── components/        # Reusable React components
├── data/             # Static data files (JSON)
├── game/             # Game logic and simulation code
├── routes/           # Next.js App Router pages
│   └── api/         # API routes
├── styles/           # Global styles
└── utils/            # Utility functions and helpers
```

### Component Organization
- Place reusable components in `app/components/`
- Place page-specific components in the same directory as the route
- Use `.tsx` extension for React components
- Use `.ts` for non-component TypeScript files

### Naming Conventions
- Components: PascalCase (e.g., `CharacterCustomization.tsx`)
- Utility files: kebab-case (e.g., `game-constants.js`)
- Route files: Next.js conventions (`_index.tsx`, `[slug].tsx`)

## Security Best Practices

### Never Commit Secrets
- Do not hardcode API keys, passwords, or sensitive data in source code
- Use environment variables for sensitive configuration
- Reference `.env.example` for required environment variables
- Ensure `.env.local` is in `.gitignore`

### Input Validation
- Validate all user input, especially in payment processing and game mechanics
- Sanitize data before using in database queries or rendering
- Use proper authentication and authorization for API routes

### Dependencies
- Keep dependencies up to date
- Review dependency security advisories regularly
- Use `npm audit` to check for vulnerabilities

## API and Data Handling

### API Routes
- Place API routes in `app/routes/api/`
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate HTTP status codes
- Handle errors gracefully with proper error messages

### Data Files
- Store static game data in `app/data/` as JSON files
- Keep data structures consistent and well-documented
- Validate data structure before using in the application

## Build and Development

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run ci` - Run CI checks locally

### Build Configuration
- Next.js configuration in `next.config.js` and `next.config.ts`
- TypeScript configuration in `tsconfig.json`
- Tailwind configuration in `tailwind.config.ts`
- ESLint configuration in `eslint.config.mjs`

## Testing

### Current Status
- No testing framework is currently configured
- When adding tests, prefer Jest or Vitest for unit testing
- Use React Testing Library for component testing
- Add test scripts to `package.json`

### Testing Guidelines (Future)
- Write unit tests for utility functions
- Write integration tests for game logic
- Test React components with proper test IDs
- Aim for meaningful test coverage, not just high percentages

## Documentation

### Code Comments
- Add JSDoc comments for exported functions and components
- Explain complex game logic and algorithms
- Document any non-obvious business rules
- Keep comments up-to-date with code changes

### README Updates
- Update `README.md` when adding new features
- Document new environment variables in `.env.example`
- Keep setup instructions current

## GitHub Actions and CI/CD

### Workflows
- CI workflow runs on every push and PR to `main`
- Deployment workflows for GitHub Pages and Remix
- All workflows are in `.github/workflows/`

### CI Requirements
- Code must pass ESLint checks
- Code must build successfully
- Follow the workflow configurations in `.github/workflows/ci.yml`

## Game-Specific Guidelines

### Business Simulation
- Game logic code goes in `app/game/`
- Use `game-constants.js` for game configuration values
- Norfolk-specific events and data in `norfolk-events.js`
- Business simulation logic in `business-simulation.js`

### Payment Processing
- Payment-related code in `app/utils/payment-processor.js`
- Cryptocurrency handling in `app/utils/crypto-utils.js`
- Bitcoin monitoring in `app/utils/bitcoin-monitor.js`
- Always validate payment amounts and transactions

### 3D Features
- Character customization components use Three.js or similar
- Keep 3D logic separate from game state management
- Optimize 3D assets for web performance

## Contribution Guidelines

### Pull Requests
- Branch from `main` for new features
- Use descriptive branch names
- Keep PRs focused on a single feature or fix
- Update relevant documentation
- Ensure CI checks pass before requesting review

### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Reference issue numbers when applicable

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Best Practices for Copilot

When working on this repository:
1. Always respect the TypeScript strict mode settings
2. Follow the established file organization patterns
3. Use Tailwind CSS utilities instead of custom CSS when possible
4. Keep game logic modular and testable
5. Prioritize security in payment and user data handling
6. Write clean, self-documenting code with appropriate comments
7. Consider performance implications, especially for 3D features
8. Maintain consistency with existing code patterns
