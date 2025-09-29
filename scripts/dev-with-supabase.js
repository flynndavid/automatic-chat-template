#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');

/**
 * Check if Supabase is running by trying to get its status
 */
async function isSupabaseRunning() {
  try {
    execSync('npx supabase status --output json', {
      stdio: 'ignore',
      cwd: path.resolve(__dirname, '..'),
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Start Supabase local development server
 */
async function startSupabase() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting local Supabase...');

    const supabase = spawn('npx', ['supabase', 'start'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });

    supabase.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Supabase is ready!');
        resolve();
      } else {
        reject(new Error(`Supabase start failed with code ${code}`));
      }
    });

    supabase.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Start Next.js development server
 */
function startNextDev() {
  console.log('🏃 Starting Next.js development server...');

  const nextDev = spawn('npx', ['next', 'dev', '--turbo'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });

  // Forward signals to Next.js process
  process.on('SIGINT', () => {
    nextDev.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    nextDev.kill('SIGTERM');
  });

  nextDev.on('close', (code) => {
    process.exit(code);
  });
}

/**
 * Main function
 */
async function main() {
  try {
    const isRunning = await isSupabaseRunning();

    if (isRunning) {
      console.log('✅ Supabase is already running');
    } else {
      await startSupabase();
    }

    startNextDev();
  } catch (error) {
    console.error('❌ Failed to start development environment:', error.message);
    process.exit(1);
  }
}

main();
