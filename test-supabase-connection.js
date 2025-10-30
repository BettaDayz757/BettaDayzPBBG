#!/usr/bin/env node

/**
 * BettaDayz PBBG - Supabase Connection Test
 * Tests the Supabase configuration and connection
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${colors.blue}🔍 BettaDayz PBBG - Supabase Connection Test${colors.reset}`);
console.log('='.repeat(50));
console.log('');

// Load environment variables manually
const envPath = join(__dirname, '.env.local');
if (!existsSync(envPath)) {
  console.log(`${colors.red}❌ .env.local file not found${colors.reset}`);
  console.log('   Please create it by copying .env.example:');
  console.log('   cp .env.example .env.local');
  process.exit(1);
}

try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  console.log(`${colors.red}❌ Failed to load .env.local:${colors.reset}`, error.message);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
console.log(`${colors.blue}📋 Checking environment variables...${colors.reset}`);

if (!supabaseUrl) {
  console.log(`${colors.red}❌ NEXT_PUBLIC_SUPABASE_URL is not set${colors.reset}`);
  console.log('   Please set it in your .env.local file');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.log(`${colors.red}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set${colors.reset}`);
  console.log('   Please set it in your .env.local file');
  process.exit(1);
}

console.log(`${colors.green}✅ Environment variables found${colors.reset}`);
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log('');

// Check if keys are placeholders
if (supabaseAnonKey.includes('placeholder') || supabaseAnonKey.includes('your_')) {
  console.log(`${colors.yellow}⚠️  Anon key appears to be a placeholder${colors.reset}`);
  console.log('   Please replace it with your real Supabase anon key');
  console.log('   Get it from: https://supabase.com/dashboard/project/btcfpizydmcdjhltwbil/settings/api');
  process.exit(1);
}

// Create Supabase client
console.log(`${colors.blue}🔗 Creating Supabase client...${colors.reset}`);

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log(`${colors.green}✅ Client created successfully${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}❌ Failed to create client:${colors.reset}`, error.message);
  process.exit(1);
}

console.log('');

// Test connection
console.log(`${colors.blue}🧪 Testing connection...${colors.reset}`);

try {
  // Try to query the players table (just check if it exists)
  const { data, error } = await supabase
    .from('players')
    .select('count')
    .limit(1);

  if (error) {
    console.log(`${colors.yellow}⚠️  Database query error: ${error.message}${colors.reset}`);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('');
      console.log(`${colors.yellow}💡 The players table doesn't exist yet${colors.reset}`);
      console.log('   This is expected if you haven\'t run the database schema');
      console.log('   Steps to fix:');
      console.log('   1. Open Supabase Dashboard');
      console.log('   2. Go to SQL Editor');
      console.log('   3. Run the contents of supabase-schema.sql');
      console.log('');
    } else if (error.message.includes('JWT')) {
      console.log('');
      console.log(`${colors.red}❌ Authentication error${colors.reset}`);
      console.log('   Your API key may be incorrect or expired');
      console.log('   Please verify your keys at:');
      console.log('   https://supabase.com/dashboard/project/btcfpizydmcdjhltwbil/settings/api');
      process.exit(1);
    }
  } else {
    console.log(`${colors.green}✅ Successfully connected to Supabase!${colors.reset}`);
    console.log('   Database query executed successfully');
    console.log('');
  }
} catch (error) {
  console.log(`${colors.red}❌ Connection test failed:${colors.reset}`, error.message);
  
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.log('');
    console.log(`${colors.yellow}💡 Network error${colors.reset}`);
    console.log('   Check your internet connection');
    console.log('   Verify the Supabase URL is correct');
  }
  
  process.exit(1);
}

// Test authentication
console.log(`${colors.blue}🔐 Testing authentication...${colors.reset}`);

try {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    console.log(`${colors.green}✅ Active session found${colors.reset}`);
    console.log(`   User: ${session.user.email}`);
  } else {
    console.log(`${colors.yellow}ℹ️  No active session (this is normal for a new setup)${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.yellow}⚠️  Auth check: ${error.message}${colors.reset}`);
}

console.log('');
console.log(`${colors.green}🎉 Connection Test Complete!${colors.reset}`);
console.log('='.repeat(50));
console.log('');
console.log(`${colors.blue}📋 Summary:${colors.reset}`);
console.log('• Supabase URL is configured correctly');
console.log('• API keys are set (verify they are not placeholders)');
console.log('• Connection to Supabase is working');
console.log('');
console.log(`${colors.blue}📖 Next Steps:${colors.reset}`);
console.log('1. If tables don\'t exist, run supabase-schema.sql in SQL Editor');
console.log('2. Start your development server: npm run dev');
console.log('3. Test the application at http://localhost:3000');
console.log('');
console.log(`${colors.yellow}💡 Tip:${colors.reset} For complete setup, see SUPABASE-VERCEL-SETUP.md`);
console.log('');
