import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to the proper health check endpoint
  return NextResponse.redirect(new URL('/api/health', 'http://localhost:3000'));
}

export async function HEAD() {
  // Simple OK response for health checks
  return new NextResponse(null, { status: 200 });
}