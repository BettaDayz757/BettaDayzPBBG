---
scope: "**/*"
---

# Security Instructions

This file provides security best practices and guidelines for the BettaDayz PBBG application.

## Critical Security Rules

### Never Commit Secrets
- **NEVER** commit API keys, passwords, tokens, or any secrets to the repository
- Use environment variables for all sensitive data
- Keep `.env` files in `.gitignore`
- Use `.env.example` as a template without actual values
- Rotate secrets immediately if accidentally committed

### Environment Variables
- Store all secrets in environment variables
- Document required variables in `.env.example`
- Use descriptive names: `SUPABASE_URL`, `STRIPE_SECRET_KEY`
- Never log environment variables
- Validate all required env vars are present at startup

```typescript
// Good
const apiKey = process.env.API_KEY
if (!apiKey) throw new Error('API_KEY is required')

// Bad
console.log('API Key:', process.env.API_KEY) // Never log secrets
```

## Authentication & Authorization

### Authentication
- Use Supabase Auth for user authentication
- Validate JWT tokens on protected routes
- Implement proper session management
- Set appropriate session timeouts
- Use HTTPS only for authentication endpoints

### Authorization
- Check user permissions before any data access
- Validate resource ownership before updates/deletes
- Implement role-based access control (RBAC) where needed
- Don't trust client-side permission checks
- Always verify permissions on the server

```typescript
// Good: Server-side authorization check
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const resource = await getResource(id)
  
  if (resource.ownerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Proceed with deletion
}
```

## Input Validation & Sanitization

### Validate All Inputs
- Never trust user input
- Validate data types, formats, and ranges
- Use TypeScript types as a first line of defense
- Implement runtime validation for API inputs
- Validate file uploads (type, size, content)

```typescript
// Good: Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: Request) {
  const { email, age } = await request.json()
  
  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  
  if (typeof age !== 'number' || age < 0 || age > 150) {
    return NextResponse.json({ error: 'Invalid age' }, { status: 400 })
  }
  
  // Proceed with valid inputs
}
```

### Sanitize Outputs
- Escape HTML in user-generated content
- Use React's built-in XSS protection (JSX automatically escapes)
- Be careful with `dangerouslySetInnerHTML`
- Sanitize data before inserting into database

```typescript
// Dangerous: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Safe: Use React's default behavior
<div>{userInput}</div>

// If HTML is needed, use a sanitization library
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Database Security

### SQL Injection Prevention
- Supabase client uses parameterized queries (safe by default)
- Never construct SQL queries with string concatenation
- Use Supabase query builder methods

```typescript
// Good: Safe parameterized query
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// Bad: Never do this (if using raw SQL)
const query = `SELECT * FROM users WHERE email = '${userEmail}'` // SQL injection risk
```

### Data Access Control
- Use Row Level Security (RLS) in Supabase
- Define policies for each table
- Restrict data access based on user roles
- Test RLS policies thoroughly

### Sensitive Data
- Hash passwords with bcrypt or similar (Supabase Auth handles this)
- Don't store credit card numbers (use Stripe tokens)
- Encrypt sensitive data at rest
- Use appropriate data retention policies

## API Security

### Rate Limiting
- Implement rate limiting on API routes
- Prevent brute force attacks
- Use different limits for authenticated/unauthenticated users
- Consider using middleware or edge functions for rate limiting

### CORS Configuration
- Configure CORS appropriately
- Don't use `*` wildcard in production
- Specify allowed origins explicitly
- Use credentials only when necessary

### API Keys
- Use API keys for service-to-service communication
- Rotate API keys periodically
- Implement key expiration
- Monitor API key usage

## Client-Side Security

### XSS Prevention
- React escapes content by default (use it!)
- Avoid `dangerouslySetInnerHTML` unless necessary
- Sanitize any HTML from external sources
- Use Content Security Policy (CSP) headers

### CSRF Protection
- Next.js provides CSRF protection by default
- Use same-site cookies
- Validate origin headers for state-changing requests
- Use CSRF tokens for critical operations

### Secure Storage
- Don't store sensitive data in localStorage
- Use secure, httpOnly cookies for tokens
- Clear sensitive data on logout
- Use session storage for temporary data

```typescript
// Bad: Storing token in localStorage
localStorage.setItem('token', authToken)

// Good: Let Supabase handle secure token storage
// Or use secure httpOnly cookies
```

## Dependencies & Supply Chain

### Dependency Management
- Regularly update dependencies
- Review security advisories
- Use `npm audit` to check for vulnerabilities
- Lock dependency versions with package-lock.json
- Review dependencies before adding them

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Review before updating
npm outdated
```

### Third-Party Code
- Vet third-party libraries before use
- Check library maintenance status
- Review library code for sensitive operations
- Use reputable, well-maintained packages
- Minimize dependencies

## Logging & Monitoring

### Safe Logging
- Never log sensitive data (passwords, tokens, PII)
- Log security events (failed logins, unauthorized access)
- Implement log rotation
- Monitor logs for suspicious activity

```typescript
// Good
console.log('Login attempt', { userId: user.id, timestamp: Date.now() })

// Bad: Never log sensitive data
console.log('Login', { password: password, token: jwt }) // NO!
```

### Error Handling
- Don't expose stack traces to users
- Log detailed errors server-side
- Return generic error messages to clients
- Implement proper error boundaries

```typescript
// Good: Generic error to client, detailed log server-side
try {
  // operation
} catch (error) {
  console.error('Detailed error:', error) // Server log
  return NextResponse.json(
    { error: 'An error occurred' }, // Generic client message
    { status: 500 }
  )
}
```

## Deployment Security

### Environment Separation
- Use different credentials for dev/staging/production
- Don't use production data in development
- Restrict production access
- Use different API keys per environment

### HTTPS/TLS
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS headers
- Keep TLS certificates updated

### Security Headers
Configure security headers in `_headers` file or middleware:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Referrer-Policy

## Code Review Checklist

Before merging code, verify:
- [ ] No secrets committed
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] SQL injection prevented
- [ ] XSS prevention in place
- [ ] Error messages don't leak info
- [ ] Dependencies reviewed
- [ ] Security headers configured
- [ ] Rate limiting considered
- [ ] Logging is safe (no sensitive data)

## Incident Response

If a security issue is discovered:
1. Assess the severity and impact
2. Contain the issue (disable compromised features)
3. Rotate all potentially compromised secrets
4. Fix the vulnerability
5. Deploy the fix
6. Review logs for exploitation
7. Notify affected users if necessary
8. Document the incident and lessons learned

## Security Testing

- Run security linters (ESLint security plugins)
- Use GitHub CodeQL for security scanning
- Test authentication/authorization
- Perform security code reviews
- Test rate limiting
- Validate input handling
- Test error messages don't leak info

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth/security)
- [npm Security Best Practices](https://docs.npmjs.com/about-security-best-practices)

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Email security details to the maintainers privately
3. Include steps to reproduce
4. Wait for confirmation before disclosing
5. Follow responsible disclosure practices
