import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginFormSchema } from "@/src/config/schemas";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			username: string;
		} & DefaultSession["user"];
	}

	interface User {}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	session: { strategy: "jwt" },
	trustHost: true,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsedCredentials = loginFormSchema.parse(credentials);

				if (
					!process.env.AUTH_PASSWORD ||
					parsedCredentials.password !== process.env.AUTH_PASSWORD
				) {
					return null;
				}

				return {
					id: "admin",
				};
			},
		}),
	],
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
			session.user.id = token.id as string;

			return session;
		},
	},
} satisfies NextAuthConfig;
