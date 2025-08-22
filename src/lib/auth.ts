// lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
  adapter: PrismaAdapter(prisma),
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
        if (!data || !data.user || !data.token) return null;
        return {
          ...data.user,
          id: String(data.user.id),
          role: data.user.role ?? undefined,
          token: data.token,
        };
      },
    }),
  ],
  // removed duplicate session property
  callbacks: {
    async jwt({ token, user }) {
      // Debug log for jwt callback
      console.log("[NextAuth][jwt callback] user:", user);
      // If user is present, this is the initial sign-in
      if (user) {
        console.log("[NextAuth][jwt callback] user.id:", user.id);
        token.role = user.role ?? undefined;
        // Always set token.id from user.id or backendUser.id
        const backendUser = user as BackendUser;
        token.id = user.id || backendUser.id || undefined;
        console.log("[NextAuth][jwt callback] token.id:", token.id);
        if (backendUser.token) {
          token.accessToken = String(backendUser.token);
        }
      }
      console.log("[NextAuth][jwt callback] token:", token);
      return token;
    },
    async session({ session, token }) {
      // Extra debug logging
      console.log("[NextAuth][session callback] token:", token);
      console.log("[NextAuth][session callback] session (before):", session);
      // Always ensure session.user exists and has id/role/name
      if (!session.user) session.user = {};
      session.user.id = token.id ? String(token.id) : undefined;
      session.user.role = token.role ?? undefined;
      session.user.name = token.name ?? token.email ?? "User";
      // Pass accessToken to session if present
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      console.log("[NextAuth][session callback] session (after):", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
