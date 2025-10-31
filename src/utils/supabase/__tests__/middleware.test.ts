/**
 * @jest-environment node
 */

describe('Supabase Middleware', () => {
  // Set environment variables
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('should have environment variables configured', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('should export createSupabaseForRequest function', async () => {
    const { createSupabaseForRequest } = await import('../middleware');
    expect(typeof createSupabaseForRequest).toBe('function');
  });
});
