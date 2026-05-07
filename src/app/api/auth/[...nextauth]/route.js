import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role || "USER";
            return session;
        },
        async jwt({ token }) {
            token.role = token.role || "USER";
            return token;
        },
    },
});

export { handler as GET, handler as POST };