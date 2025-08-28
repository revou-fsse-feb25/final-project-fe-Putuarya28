// lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Type for user object returned from backend /auth/login
type BackendUser = {
  id: string;
  email: string;
  role?: string;
  token?: string;
};

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  // removed custom jwt encode/decode config
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // must be false for localhost over http
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call backend /auth/login to get JWT and user info
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || !data.user || !data.accessToken || !data.refreshToken)
          return null;
        return {
          ...data.user,
          id: String(data.user.id),
          role: data.user.role ?? undefined,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  // removed duplicate session property
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? undefined;
        const backendUser = user as BackendUser & {
          accessToken?: string;
          refreshToken?: string;
        };
        token.id = user.id || backendUser.id || undefined;
        if (backendUser.accessToken) {
          token.accessToken = String(backendUser.accessToken);
        }
        if (backendUser.refreshToken) {
          token.refreshToken = String(backendUser.refreshToken);
        }
      }
      // Optionally: handle token refresh here if needed
      return token;
    },
    async session({ session, token }) {
      if (!session.user) session.user = {};
      session.user.id = token.id ? String(token.id) : undefined;
      session.user.role = token.role ?? undefined;
      session.user.name = token.name ?? token.email ?? "User";
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      if (typeof token.refreshToken === "string") {
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Utility to refresh access token using backend
export async function refreshAccessToken(userId: string, refreshToken: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), refreshToken }),
    }
  );
  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

// Extend Session type to include refreshToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
      role?: string;
      name?: string;
      email?: string;
    };
  }
}

// Extend Session type to include refreshToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
      role?: string;
      name?: string;
      email?: string;
    };
  }
}
