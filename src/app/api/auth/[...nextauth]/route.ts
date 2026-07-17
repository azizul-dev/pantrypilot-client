import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        // Simulating backend call or demo account validation
        if (credentials.email === "demo@pantrypilot.com" && credentials.password === "password123") {
          return {
            id: "demo-user",
            name: "Chef Pilot",
            email: "demo@pantrypilot.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          };
        }
        
        // Real validation can go here against process.env.NEXT_PUBLIC_API_URL
        return {
          id: "temp-user",
          name: credentials.email.split("@")[0],
          email: credentials.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
