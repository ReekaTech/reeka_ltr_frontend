import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresIn: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isActive: boolean;
      role: string;
      organizationId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    user: Session['user'];
    organizationId: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    user: Session['user'];
  }
}
