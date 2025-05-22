import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { signin } from '@/services/api/auth';
import { signOut } from 'next-auth/react';
import { allowedRoles } from '@/app/constants/roles';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await signin({
            email: credentials?.email || '',
            password: credentials?.password || '',
          });

          if (typeof response.user.role !== 'string' || !allowedRoles.includes(response?.user?.role)) {
            throw new Error('You are not authorized to access this application');
          }

          if (response) {
            return {
              id: response.user.id,
              email: response.user.email,
              name: `${response.user.firstName} ${response.user.lastName}`,
              accessToken: response.tokens.accessToken,
              refreshToken: response.tokens.refreshToken,
              expiresIn: '3600',
              organizationId: response.organizationId,
              role: response.user.role,
              user: {
                id: response.user.id,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                isActive: true,
                role: response.user.role,
                organizationId: response.organizationId,
                organizationName: response.organizationName,
              },
            };
          }
          return null;
        } catch (error: any) {
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
          throw new Error(error.message || 'Invalid email or password');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
        token.organizationId = user.organizationId;
        token.user = user.user;
        token.exp = Math.floor(Date.now() / 1000) + Number(user.expiresIn);
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresIn = token.expiresIn;
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
};
