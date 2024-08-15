import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  test: {
    globals: true,
    // setupFiles: './supabase/tests/setup.ts',
  },
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
});
