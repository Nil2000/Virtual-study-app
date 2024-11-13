import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/lib/auth.config";
import { getUserById } from "@/data/user";
import { Role } from "@repo/db";

declare module "next-auth" {
	interface Session {
		user: {
			role: "STUDENT" | "TEACHER";
		} & DefaultSession["user"];
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	events: {
		// Google and Github users are verified by the provider
		linkAccount: async ({ user }) => {
			await db.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
				},
			});
		},
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			if (account?.provider !== "credentials") return true;

			if (!user || !user.id) return false;

			const existingUser = await getUserById(user.id);

			if (!existingUser || !existingUser.emailVerified) return false;

			return true;
		},
		session: async ({ session, token, user }) => {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}

			if (session.user && token.role) {
				session.user.role = token.role as Role;
			}
			return session;
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
});
