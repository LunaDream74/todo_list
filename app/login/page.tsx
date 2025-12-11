'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithCredentials, signUpWithCredentials, signInWithGoogle } from '@/app/actions/authActions';
import { Mail, Lock, User, Loader } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (!formData.name || !formData.email || !formData.password) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }
        await signUpWithCredentials(formData.name, formData.email, formData.password);
      } else {
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          setIsLoading(false);
          return;
        }
        await signInWithCredentials(formData.email, formData.password);
      }
    } catch (err: any) {
      if (err?.digest?.includes?.('NEXT_REDIRECT') || err?.message?.includes?.('NEXT_REDIRECT')) {
        return; 
      }
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      
      // If successful, the server should redirect
      // If we get here, something may have gone wrong
      if (result) {
        // Result received (shouldn't happen with redirect: true)
      }
    } catch (err: any) {
      // Check if it's a NEXT_REDIRECT error
      if (err?.digest?.includes?.('NEXT_REDIRECT') || err?.message?.includes?.('NEXT_REDIRECT')) {
        return;
      }
      const errorMessage = err?.message || 'Google sign-in failed';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-8 px-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Tasks
          </h1>
          <p className="text-slate-300">
            {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
            size="lg"
          >
            {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-6 border-slate-600 text-slate-200 hover:bg-slate-700/50"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
          Sign in with Google
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="text-purple-400 hover:text-purple-300 font-medium text-sm"
            disabled={isLoading}
          >
            {isSignUp ? 'Sign in here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
}
