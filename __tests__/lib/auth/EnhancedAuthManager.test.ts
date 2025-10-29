// Authentication Manager Tests
// __tests__/lib/auth/EnhancedAuthManager.test.ts

import { EnhancedAuthManager } from '@/lib/auth/EnhancedAuthManager';

// Remove mock to test actual implementation
jest.unmock('@/lib/auth/EnhancedAuthManager');

describe('EnhancedAuthManager', () => {
  let authManager: EnhancedAuthManager;

  beforeEach(() => {
    authManager = EnhancedAuthManager.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = EnhancedAuthManager.getInstance();
      const instance2 = EnhancedAuthManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('registerUser', () => {
    it('should validate username format', async () => {
      const result = await authManager.registerUser(
        'test@example.com',
        'password123',
        'ab' // Too short
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Username must be');
    });

    it('should validate password length', async () => {
      const result = await authManager.registerUser(
        'test@example.com',
        '123', // Too short
        'validusername'
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Password must be');
    });
  });

  describe('createSessionToken', () => {
    it('should create valid JWT token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        profile: {
          username: 'testuser',
          displayName: 'Test User',
          level: 1,
          bettaBuckZ: 1000,
          status: 'online'
        },
        permissions: ['user']
      };

      const token = await authManager.createSessionToken(mockUser, 'bettadayz.shop');
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('validateSessionToken', () => {
    it('should validate JWT token structure', async () => {
      const result = await authManager.validateSessionToken('invalid-token');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid session token');
    });
  });

  describe('createAuthCookies', () => {
    it('should create cookies for domain', () => {
      const cookies = authManager.createAuthCookies('test-token', 'bettadayz.shop');
      
      expect(Array.isArray(cookies)).toBe(true);
      expect(cookies.length).toBeGreaterThan(0);
      
      const sessionCookie = cookies.find(c => c.name === 'session-token');
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie?.value).toBe('test-token');
    });
  });
});