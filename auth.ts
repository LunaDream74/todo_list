import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { query } from '@/lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const result = await query(
          'SELECT id, name, email, password, image FROM "User" WHERE email = $1',
          [credentials.email]
        );

        const user = result.rows[0];

        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth - auto-create user if new
      if (account?.provider === 'google') {
        try {
          const result = await query(
            'SELECT id FROM "User" WHERE email = $1',
            [user.email]
          );

          if (result.rows.length === 0) {
            // Create new user from Google OAuth
            const createResult = await query(
              'INSERT INTO "User" (name, email, image, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
              [user.name || 'User', user.email, user.image, '']
            );
            // Add the database ID to the user object
            user.id = createResult.rows[0].id.toString();
          } else {
            // User exists, add the database ID to the user object
            user.id = result.rows[0].id.toString();
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Extract the path from the full URL if needed
      let targetUrl = url.startsWith(baseUrl) ? url.slice(baseUrl.length) : url;
      if (!targetUrl.startsWith('/')) {
        targetUrl = '/' + targetUrl;
      }
      
      // Don't redirect back to login page after successful auth
      if (targetUrl === '/login') {
        return baseUrl; // Go to home page
      }
      
      // Allow other relative URLs
      if (targetUrl.startsWith('/')) {
        return `${baseUrl}${targetUrl}`;
      }
      
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
});
