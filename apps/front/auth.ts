import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword } from "./utils/password"
import { userGetUserFromDb } from "./app/actions/user/get-user-from-db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const user = await userGetUserFromDb(credentials.email as string, credentials.password as string)

        return user
      },
    }),
  ],
   pages: {
    signIn: "/login", // 👈 acá la ruta de tu login
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
