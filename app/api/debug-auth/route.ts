import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { chat } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    console.log('Debug: Creating Supabase client...');
    const supabase = await createClient();

    console.log('Debug: Getting user...');
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('Debug: User result:', { user: user?.id, error });

    // Test direct database query via Supabase
    let supabaseDbTest = null;
    if (user) {
      try {
        const { data: chats, error: dbError } = await supabase
          .from('Chat')
          .select('id, title')
          .eq('userId', user.id)
          .limit(5);

        supabaseDbTest = { chats: chats?.length ?? 0, error: dbError };
      } catch (e) {
        supabaseDbTest = {
          error: e instanceof Error ? e.message : 'Unknown error',
        };
      }
    }

    // Test direct Postgres connection
    let postgresTest = null;
    try {
      const pgUrl = process.env.POSTGRES_URL;
      if (pgUrl && user) {
        // Parse the URL to show connection details (hide password)
        const urlParts = pgUrl.match(
          /postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/,
        );
        postgresTest = {
          urlFormat: urlParts
            ? `postgresql://${urlParts[1]}:****@${urlParts[3]}/${urlParts[4]}`
            : 'Invalid format',
          host: urlParts ? urlParts[3] : 'Unknown',
          queryResult: null as any,
        };

        // Try a simple query
        const client = postgres(pgUrl, { ssl: 'require' });
        const db = drizzle(client);
        const result = await db
          .select()
          .from(chat)
          .where(eq(chat.userId, user.id))
          .limit(1);
        postgresTest.queryResult = { success: true, rowCount: result.length };
        await client.end();
      } else {
        postgresTest = { error: 'No POSTGRES_URL or user' };
      }
    } catch (e) {
      postgresTest = {
        error: e instanceof Error ? e.message : 'Unknown error',
        stack:
          e instanceof Error
            ? e.stack?.split('\n').slice(0, 3).join('\n')
            : undefined,
      };
    }

    // Check environment variables (hide sensitive parts)
    const envCheck = {
      POSTGRES_URL: process.env.POSTGRES_URL
        ? `✓ Set (${process.env.POSTGRES_URL.substring(0, 30)}...)`
        : '✗ Missing',
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL || '✗ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `✓ Set (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...)`
        : '✗ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? '✓ Set'
        : '✗ Missing',
      AUTH_SECRET: process.env.AUTH_SECRET ? '✓ Set' : '✗ Missing',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        auth: {
          hasUser: !!user,
          userId: user?.id,
          userEmail: user?.email,
          error: error?.message,
        },
        supabaseDbTest,
        postgresTest,
        environment: envCheck,
        headers: {
          cookie: !!request.headers.get('cookie'),
          authorization: !!request.headers.get('authorization'),
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Debug endpoint error:', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}
