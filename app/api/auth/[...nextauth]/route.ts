import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { membersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import { iMember, Session, SessionUser, Token } from "@/lib/types";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const [user] = await db
          .select()
          .from(membersTable)
          .where(eq(membersTable.email, credentials.email));

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: Token }) {
      session.user = {
        ...session.user,
        id: token.user?.id,
        name: token.user?.firstName,
        role: token.user?.role,
      };
      return session;
    },
    async jwt({ token, user }: { token: Token; user?: iMember }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async redirect({
      url,
      baseUrl,
      token,
    }: {
      url: string;
      baseUrl: string;
      token: Token;
    }) {
      return url.startsWith(baseUrl) ? `${baseUrl}/books` : baseUrl;
    },
    async signIn({ user, account }: { user: iMember; account: any }) {
      if (account.provider === "google") {
        const email = user.email;
        console.log(user);
        if (!email) return false;

        const existingUsers = await db
          .select()
          .from(membersTable)
          .where(eq(membersTable.email, email))
          .execute();

        if (existingUsers.length === 0) {
          const newUser: iMember = {
            email,
            firstName: user.firstName || "",
            lastName: "",
            password: "",
            membershipStatus: "active",
            phoneNumber: "",
            address: "",
            id: 0,
            role: "user",
          };

          await db.insert(membersTable).values(newUser).execute();
          console.log("New user created in database");
        }

        return true;
      }

      return true;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
