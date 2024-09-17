import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { membersTable } from "@/db/schema";
import { iMember, Session, Token } from "@/lib/types";
import { getUserByEmail } from "@/lib/repository";
import { AppEnvs } from "@/read_env";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "profile email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName || "",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        token.role = user.role;
      }
      console.log(token);
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      };

      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const email = user.email;
        const fullName = user.name || "";
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");

        if (!email) return false;

        const existingUsers = await getUserByEmail(email);

        if (!existingUsers) {
          const newUser = {
            email,
            firstName: firstName || "",
            lastName: lastName || "",
            password: "",
            membershipStatus: "active",
            phoneNumber: "",
            address: "",
            id: 0,
            role: "user",
          };

          await db.insert(membersTable).values(newUser).execute();
        }

        return true;
      }
      return true;
    },
  },
  secret: AppEnvs.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
