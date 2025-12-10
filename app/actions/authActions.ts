'use server';

import { signIn, signOut } from '@/auth';
import { query } from '@/lib/db';
import { hash } from 'bcryptjs';
import { redirect } from 'next/navigation';

// Sign up with email and password
export async function signUpWithCredentials(
  name: string,
  email: string,
  password: string
) {
  try {
    // Check if user already exists
    const result = await query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await query(
      'INSERT INTO "User" (name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
      [name, email, hashedPassword]
    );

    // Sign in the user
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    redirect('/');
  } catch (error) {
    throw error;
  }
}

// Sign in with credentials
export async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    redirect('/');
  } catch (error) {
    throw error;
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signIn('google', { redirect: true });
    
    return result;
  } catch (error: any) {
    // NEXT_REDIRECT is expected when redirect: true is used - let it propagate
    if (error?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error; // Re-throw to trigger the redirect
    }
    throw error;
  }
}

// Sign out
export async function handleSignOut() {
  await signOut({ redirect: false });
  redirect('/login');
}
