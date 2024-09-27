import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { membersTable } from "@/drizzle/schema";
import { getUserByEmail } from "@/lib/MemberRepository/repository";
import bcrypt from "bcrypt";
import { AppEnvs } from "@/read_env";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      authorization: {
        scope: "openid profile email",
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
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const existingUser = await getUserByEmail(user.email);
          console.log("Inside the jwt", existingUser);
          if (existingUser) {
            token.id = existingUser.id;
            token.role = existingUser.role;
          }
        } else {
          token.id = user.id;
          token.role = user.role;
        }
        token.email = user.email;
        token.name = `${user.firstName} ${user.lastName}`.trim();
      }

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
        const existingUser = await getUserByEmail(user.email);

        if (!existingUser) {
          const firstName = user.name?.split(" ")[0] || "";
          const lastName = user.name?.split(" ")[1] || "";

          await db.insert(membersTable).values({
            email: user.email,
            firstName,
            lastName,
            membershipStatus: "active",
            role: "user",
          });
        }
        return true;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    },
  },
  secret: AppEnvs.NEXT_AUTH_SECRET,
  // pages: {
  //   signIn: "/login",
  // },
};
