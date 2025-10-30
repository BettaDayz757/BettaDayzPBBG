---
scope: "**/*.test.{ts,tsx,js,jsx}"
---

# Testing Instructions

This file provides guidance for writing and maintaining tests in the BettaDayz PBBG application.

## Testing Framework

The project uses:
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end (E2E) testing

## Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test File Organization

### Naming Convention
- Unit tests: `component.test.tsx` or `utility.test.ts`
- Integration tests: `feature.integration.test.tsx`
- E2E tests: Place in `e2e/` directory or similar

### Location
- Co-locate test files with the code they test
- Place tests in the same directory as the component/module
- Use `__tests__/` directory for multiple related tests

## Unit Testing Best Practices

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ComponentName from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('handles user interactions', async () => {
    const mockCallback = jest.fn()
    render(<ComponentName onClick={mockCallback} />)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})
```

### Utility/Function Tests

```typescript
import { utilityFunction } from './utilities'

describe('utilityFunction', () => {
  it('returns expected result for valid input', () => {
    expect(utilityFunction('input')).toBe('expected output')
  })
  
  it('handles edge cases', () => {
    expect(utilityFunction('')).toBe('default')
    expect(utilityFunction(null)).toThrow()
  })
})
```

## Component Testing Guidelines

### What to Test
- Component renders without crashing
- Correct output for different props
- User interactions (clicks, input changes, etc.)
- Conditional rendering based on state/props
- Error boundaries and error states
- Loading states and data fetching

### What NOT to Test
- Implementation details (internal state, methods)
- Third-party library internals
- Styling (unless it affects functionality)
- Browser APIs (mock them instead)

### Testing Async Components

For Next.js Server Components and async operations:

```typescript
// Mock fetch or Supabase calls
jest.mock('../../../../lib/supabase/client', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: mockData, error: null }))
      }))
    }))
  }))
}))

describe('AsyncComponent', () => {
  it('displays data after loading', async () => {
    render(<AsyncComponent />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument()
    })
  })
})
```

## API Route Testing

### Testing API Handlers

```typescript
import { GET } from './route'
import { NextResponse } from 'next/server'

jest.mock('../../../../lib/supabase/client')

describe('GET /api/player/[id]', () => {
  it('returns player data for valid id', async () => {
    const mockRequest = new Request('http://localhost/api/player/123')
    const mockParams = Promise.resolve({ id: '123' })
    
    const response = await GET(mockRequest, { params: mockParams })
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.player).toBeDefined()
  })
  
  it('returns 400 for missing id', async () => {
    const mockRequest = new Request('http://localhost/api/player/')
    const mockParams = Promise.resolve({ id: '' })
    
    const response = await GET(mockRequest, { params: mockParams })
    
    expect(response.status).toBe(400)
  })
})
```

## Mocking

### Mocking Modules
```typescript
// Mock entire module
jest.mock('module-name')

// Mock specific function
jest.mock('module-name', () => ({
  functionName: jest.fn(() => 'mocked value')
}))

// Partial mock (keep some real implementations)
jest.mock('module-name', () => ({
  ...jest.requireActual('module-name'),
  functionToMock: jest.fn()
}))
```

### Mocking Supabase
```typescript
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: { id: '1', name: 'Test' }, 
          error: null 
        }))
      }))
    }))
  }))
}

jest.mock('../../../../lib/supabase/client', () => mockSupabase)
```

### Mocking Next.js Router
```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/current-path'),
  useSearchParams: jest.fn(() => new URLSearchParams())
}))
```

## E2E Testing with Playwright

### Basic E2E Test Structure
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('completes user flow', async ({ page }) => {
    await page.goto('/')
    
    await page.click('button[data-testid="start-game"]')
    await expect(page.locator('h1')).toContainText('Game Started')
    
    await page.fill('input[name="username"]', 'testuser')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/.*\/game/)
  })
})
```

### Best Practices for E2E Tests
- Use data-testid attributes for reliable selectors
- Test critical user paths
- Keep tests independent (no dependencies between tests)
- Clean up test data after tests
- Use page object pattern for complex pages
- Mock external APIs in E2E tests when possible

## Test Coverage

### Coverage Goals
- Aim for 80%+ coverage for critical business logic
- 100% coverage for utility functions
- Test all API routes
- Cover edge cases and error paths

### Running Coverage Reports
```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

## Continuous Integration

- All tests run automatically in CI pipeline
- Pull requests must pass all tests before merging
- Failed tests block deployment
- Review coverage reports in CI output

## Common Testing Patterns

### Testing Forms
```typescript
test('form submission', async () => {
  const mockSubmit = jest.fn()
  render(<Form onSubmit={mockSubmit} />)
  
  await userEvent.type(screen.getByLabelText('Name'), 'John Doe')
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
```

### Testing Error States
```typescript
test('displays error message on failure', async () => {
  // Mock API to return error
  mockSupabase.from.mockImplementationOnce(() => ({
    select: () => ({
      eq: () => Promise.resolve({ data: null, error: { message: 'Not found' } })
    })
  }))
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Not found')).toBeInTheDocument()
  })
})
```

## Debugging Tests

```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="specific test"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Playwright debugging
npm run test:e2e -- --debug
```

## When to Write Tests

Always write tests when:
1. Adding new features or components
2. Fixing bugs (write test that reproduces bug first)
3. Refactoring existing code
4. Adding new API routes
5. Implementing critical business logic

## Test Maintenance

- Update tests when requirements change
- Remove obsolete tests
- Keep tests simple and readable
- Avoid testing implementation details
- Refactor tests when refactoring code
