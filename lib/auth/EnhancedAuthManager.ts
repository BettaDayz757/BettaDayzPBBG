// Enhanced Authentication System
// Cross-domain authentication with session management for bettadayz.shop and bettadayz.store

import { User } from '@supabase/supabase-js';
import { supabaseHelper } from '../supabase/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthUser extends User {
  profile?: {
    username: string;
    displayName: string;
    level: number;
    bettaBuckZ: number;
    avatar?: string;
    bio?: string;
    status: string;
  };
  permissions?: string[];
  domains?: string[];
}

export interface SessionData {
  userId: string;
  email: string;
  username: string;
  domain: string;
  expiresAt: number;
  permissions: string[];
}

export interface CrossDomainAuthConfig {
  domains: string[];
  sessionDuration: number;
  jwtSecret: string;
  secureCookies: boolean;
}

export class EnhancedAuthManager {
  private static instance: EnhancedAuthManager;
  
  private readonly config: CrossDomainAuthConfig = {
    domains: ['bettadayz.shop', 'bettadayz.store'],
    sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    secureCookies: process.env.NODE_ENV === 'production'
  };

  private constructor() {}

  public static getInstance(): EnhancedAuthManager {
    if (!EnhancedAuthManager.instance) {
      EnhancedAuthManager.instance = new EnhancedAuthManager();
    }
    return EnhancedAuthManager.instance;
  }

  // User Registration
  public async registerUser(
    email: string,
    password: string,
    username: string,
    referralCode?: string
  ): Promise<{
    success: boolean;
    user?: AuthUser;
    error?: string;
  }> {
    try {
      // Check if username is available
      const { data: existingUser } = await supabaseHelper.client
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { success: false, error: 'Username already taken' };
      }

      // Register with Supabase Auth
      const { data, error } = await supabaseHelper.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            referral_code: referralCode
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Failed to create user' };
      }

      // Create user profile
      const profileResult = await supabaseHelper.createUserProfile({
        id: data.user.id,
        email: data.user.email!,
        username,
        display_name: username,
        level: 1,
        experience: 0,
        betta_buckz: 0,
        status: 'online',
        last_login: new Date().toISOString(),
        referral_code: referralCode || null
      });

      if (!profileResult.success) {
        return { success: false, error: 'Failed to create user profile' };
      }

      // Award welcome bonus
      await supabaseHelper.processBettaBuckZTransaction(
        data.user.id,
        'system',
        1000, // 10 BettaBuckZ welcome bonus
        'welcome_bonus',
        'Welcome to BettaDayz!',
        null
      );

      // Award registration achievement
      await supabaseHelper.awardAchievementProgress(
        data.user.id,
        'ach_001', // Welcome achievement
        1
      );

      const authUser = await this.getUserWithProfile(data.user.id);
      return { success: true, user: authUser || undefined };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // User Login
  public async loginUser(
    email: string,
    password: string,
    domain?: string
  ): Promise<{
    success: boolean;
    user?: AuthUser;
    sessionToken?: string;
    error?: string;
  }> {
    try {
      // Authenticate with Supabase
      const { data, error } = await supabaseHelper.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Update last login
      await supabaseHelper.updateUserProfile(data.user.id, {
        last_login: new Date().toISOString(),
        status: 'online'
      });

      // Get user with profile
      const authUser = await this.getUserWithProfile(data.user.id);
      
      if (!authUser) {
        throw new Error('User profile not found after login');
      }
      
      // Create cross-domain session token
      const sessionToken = await this.createSessionToken(authUser, domain);

      return {
        success: true,
        user: authUser,
        sessionToken
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  // Social Media Login (Discord, Google, etc.)
  public async loginWithProvider(
    provider: 'discord' | 'google' | 'github',
    domain?: string
  ): Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }> {
    try {
      const redirectTo = domain 
        ? `https://${domain}/auth/callback`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

      const { data, error } = await supabaseHelper.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            domain: domain || 'bettadayz.shop'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        url: data.url
      };

    } catch (error) {
      console.error('Social login error:', error);
      return { success: false, error: 'Social login failed' };
    }
  }

  // OAuth Callback Handler
  public async handleOAuthCallback(
    code: string,
    domain?: string
  ): Promise<{
    success: boolean;
    user?: AuthUser;
    sessionToken?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabaseHelper.client.auth.exchangeCodeForSession(code);

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'No user data received' };
      }

      // Check if user profile exists, create if not
      let userProfile = await supabaseHelper.getUserProfile(data.user.id);
      
      if (!userProfile.success) {
        // Create profile for OAuth user
        const username = data.user.user_metadata?.preferred_username || 
                        data.user.user_metadata?.name?.replace(/\s+/g, '') ||
                        `user_${data.user.id.substring(0, 8)}`;

        const createResult = await supabaseHelper.createUserProfile({
          id: data.user.id,
          email: data.user.email!,
          username,
          display_name: data.user.user_metadata?.name || username,
          level: 1,
          experience: 0,
          betta_buckz: 0,
          status: 'online',
          last_login: new Date().toISOString(),
          avatar: data.user.user_metadata?.avatar_url || null
        });

        if (!createResult.success) {
          return { success: false, error: 'Failed to create user profile' };
        }

        // Award welcome bonus for new OAuth users
        await supabaseHelper.processBettaBuckZTransaction(
          data.user.id,
          'system',
          1000, // 10 BettaBuckZ welcome bonus
          'welcome_bonus',
          'Welcome to BettaDayz!',
          null
        );
      } else {
        // Update last login for existing user
        await supabaseHelper.updateUserProfile(data.user.id, {
          last_login: new Date().toISOString(),
          status: 'online'
        });
      }

      const authUser = await this.getUserWithProfile(data.user.id);
      
      if (!authUser) {
        throw new Error('User profile not found after OAuth callback');
      }
      
      const sessionToken = await this.createSessionToken(authUser, domain);

      return {
        success: true,
        user: authUser,
        sessionToken
      };

    } catch (error) {
      console.error('OAuth callback error:', error);
      return { success: false, error: 'OAuth callback failed' };
    }
  }

  // Session Management
  public async createSessionToken(user: AuthUser, domain?: string): Promise<string> {
    const sessionData: SessionData = {
      userId: user.id,
      email: user.email!,
      username: user.profile?.username || 'unknown',
      domain: domain || 'bettadayz.shop',
      expiresAt: Date.now() + this.config.sessionDuration,
      permissions: user.permissions || []
    };

    return jwt.sign(sessionData, this.config.jwtSecret, {
      expiresIn: '7d'
    });
  }

  public async validateSessionToken(token: string): Promise<{
    valid: boolean;
    session?: SessionData;
    error?: string;
  }> {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as SessionData;
      
      if (decoded.expiresAt < Date.now()) {
        return { valid: false, error: 'Session expired' };
      }

      return { valid: true, session: decoded };

    } catch (error) {
      return { valid: false, error: 'Invalid session token' };
    }
  }

  public async refreshSession(token: string): Promise<{
    success: boolean;
    newToken?: string;
    error?: string;
  }> {
    try {
      const validation = await this.validateSessionToken(token);
      
      if (!validation.valid || !validation.session) {
        return { success: false, error: validation.error };
      }

      // Get fresh user data
      const user = await this.getUserWithProfile(validation.session.userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Create new token
      const newToken = await this.createSessionToken(user, validation.session.domain);
      
      return { success: true, newToken };

    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, error: 'Session refresh failed' };
    }
  }

  // Cross-Domain Session Sync
  public async syncCrossDomainSession(
    sessionToken: string,
    targetDomain: string
  ): Promise<{
    success: boolean;
    syncToken?: string;
    error?: string;
  }> {
    try {
      const validation = await this.validateSessionToken(sessionToken);
      
      if (!validation.valid || !validation.session) {
        return { success: false, error: 'Invalid session' };
      }

      // Verify target domain is allowed
      if (!this.config.domains.includes(targetDomain)) {
        return { success: false, error: 'Domain not allowed' };
      }

      // Get user data
      const user = await this.getUserWithProfile(validation.session.userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Create new token for target domain
      const syncToken = await this.createSessionToken(user, targetDomain);
      
      return { success: true, syncToken };

    } catch (error) {
      console.error('Cross-domain sync error:', error);
      return { success: false, error: 'Cross-domain sync failed' };
    }
  }

  // User Profile Management
  public async getUserWithProfile(userId: string): Promise<AuthUser | null> {
    try {
      // Get Supabase user
      const { data: user } = await supabaseHelper.client.auth.admin.getUserById(userId);
      
      if (!user.user) return null;

      // Get user profile
      const profileResult = await supabaseHelper.getUserProfile(userId);
      
      if (!profileResult.success || !profileResult.profile) {
        return user.user as AuthUser;
      }

      // Combine user and profile data
      const authUser: AuthUser = {
        ...user.user,
        profile: {
          username: profileResult.profile.username,
          displayName: profileResult.profile.display_name,
          level: profileResult.profile.level,
          bettaBuckZ: profileResult.profile.betta_buckz,
          avatar: profileResult.profile.avatar,
          bio: profileResult.profile.bio,
          status: profileResult.profile.status
        },
        permissions: await this.getUserPermissions(userId),
        domains: this.config.domains
      };

      return authUser;

    } catch (error) {
      console.error('Error getting user with profile:', error);
      return null;
    }
  }

  public async updateUserProfile(
    userId: string,
    updates: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await supabaseHelper.updateUserProfile(userId, updates);
      return result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }

  // Permission Management
  private async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const { data } = await supabaseHelper.client
        .from('user_permissions')
        .select('permission')
        .eq('user_id', userId)
        .eq('active', true);

      return data?.map(p => p.permission) || [];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  public async addUserPermission(
    userId: string,
    permission: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseHelper.client
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission,
          active: true,
          granted_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding user permission:', error);
      return { success: false, error: 'Permission add failed' };
    }
  }

  // Logout
  public async logoutUser(userId: string): Promise<void> {
    try {
      // Update user status
      await supabaseHelper.updateUserProfile(userId, {
        status: 'offline',
        last_seen: new Date().toISOString()
      });

      // Sign out from Supabase
      await supabaseHelper.client.auth.signOut();

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Middleware Helper
  public async authenticateRequest(request: NextRequest): Promise<{
    authenticated: boolean;
    user?: AuthUser;
    session?: SessionData;
  }> {
    try {
      // Get session token from cookies or headers
      const token = request.cookies.get('session-token')?.value ||
                   request.headers.get('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return { authenticated: false };
      }

      const validation = await this.validateSessionToken(token);
      
      if (!validation.valid || !validation.session) {
        return { authenticated: false };
      }

      const user = await this.getUserWithProfile(validation.session.userId);
      
      if (!user) {
        return { authenticated: false };
      }

      return {
        authenticated: true,
        user,
        session: validation.session
      };

    } catch (error) {
      console.error('Request authentication error:', error);
      return { authenticated: false };
    }
  }

  // Cookie Management for Cross-Domain
  public createAuthCookies(sessionToken: string, domain: string): {
    name: string;
    value: string;
    options: any;
  }[] {
    const baseOptions = {
      httpOnly: true,
      secure: this.config.secureCookies,
      sameSite: 'lax' as const,
      maxAge: this.config.sessionDuration / 1000,
      path: '/'
    };

    return [
      {
        name: 'session-token',
        value: sessionToken,
        options: {
          ...baseOptions,
          domain: `.${domain.split('.').slice(-2).join('.')}`
        }
      },
      {
        name: `session-${domain}`,
        value: sessionToken,
        options: {
          ...baseOptions,
          domain
        }
      }
    ];
  }
}

export const authManager = EnhancedAuthManager.getInstance();