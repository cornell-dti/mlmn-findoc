import NextAuth from "next-auth";
import supabase from "@/utils/supabase";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // random id for user less than bigint
            const first_name = user?.name!.split(" ")[0];
            const last_name = user?.name!.split(" ")[1];
            const { data, error } = await supabase.from("user").upsert(
                {
                    first_name: first_name,
                    last_name: last_name,
                    email: user?.email,
                },
            );
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
