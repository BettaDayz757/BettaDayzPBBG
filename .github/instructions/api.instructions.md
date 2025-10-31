---
scope: app/api/**
---

# API Routes Instructions

This file provides specific guidance for working with API routes in the BettaDayz PBBG application.

## API Route Structure

All API routes are located in `app/api/` following Next.js 16 App Router conventions:
- Use `route.ts` files for API endpoints
- Export HTTP method handlers: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use TypeScript with proper request/response typing

## Request Handling

### Request Parameters
- Use `await params` to access dynamic route parameters (Next.js 16 requirement)
- Always validate required parameters before processing
- Return 400 status for missing or invalid parameters

Example:
```typescript
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  // ... rest of handler
}
```

### Request Body
- Parse request body with `await request.json()`
- Validate all inputs before processing
- Sanitize user inputs to prevent injection attacks
- Return 400 status for malformed or invalid bodies

## Response Handling

### Success Responses
- Return data with appropriate status codes (200, 201, etc.)
- Use consistent response structure: `{ data: {...} }` or `{ player: {...} }`
- Include relevant metadata when appropriate (pagination, counts, etc.)

### Error Responses
- Return consistent error structure: `{ error: 'message' }`
- Use appropriate HTTP status codes:
  - 400: Bad Request (invalid input)
  - 401: Unauthorized (authentication required)
  - 403: Forbidden (insufficient permissions)
  - 404: Not Found (resource doesn't exist)
  - 500: Internal Server Error (unexpected errors)
- Include helpful error messages for debugging (avoid exposing sensitive details)

## Database Integration

### Supabase Client
- Import from `../../../../lib/supabase/client` (adjust path as needed)
- Use async/await for all database operations
- Handle Supabase errors properly (check both `error` and `data`)
- Use proper TypeScript types for query results

### Database Operations
- Use parameterized queries (Supabase handles this by default)
- Apply appropriate filters with `.eq()`, `.in()`, etc.
- Use `.select()` to specify only needed columns
- Use `.single()` when expecting one result, `.maybeSingle()` when it might not exist
- Implement pagination for list endpoints

## Security Considerations

### Authentication
- Check authentication status for protected endpoints
- Validate JWT tokens if using custom authentication
- Return 401 for unauthenticated requests

### Authorization
- Verify user permissions before data access/modification
- Don't expose other users' private data
- Validate resource ownership before updates/deletes

### Input Validation
- Validate all user inputs
- Sanitize strings to prevent XSS
- Use type checking for numeric inputs
- Validate email formats, URLs, etc.

### Rate Limiting
- Consider implementing rate limiting for public endpoints
- Protect against abuse and DoS attacks

## Testing

When adding or modifying API routes:
1. Test all HTTP methods that should be supported
2. Test error cases (missing params, invalid data, etc.)
3. Test authentication/authorization
4. Use Jest for unit tests, Playwright for integration tests
5. Mock external dependencies (database, third-party APIs)

## Environment Variables

- Store API keys and secrets in environment variables
- Use `process.env.VARIABLE_NAME` to access
- Never log or expose secrets in responses
- Document all required environment variables in `.env.example`

## CORS and Headers

- Next.js 16 handles CORS automatically
- Add custom headers in `_headers` file or using middleware
- Set appropriate cache headers for static data
- Use `no-cache` for dynamic, user-specific data

## Common Patterns

### List Endpoint with Pagination
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit
  
  const { data, error } = await supabase
    .from('table')
    .select('*')
    .range(offset, offset + limit - 1)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, page, limit }, { status: 200 })
}
```

### Resource CRUD
- GET: Retrieve resource(s)
- POST: Create new resource
- PUT/PATCH: Update existing resource
- DELETE: Remove resource

Always validate resource existence for update/delete operations.
