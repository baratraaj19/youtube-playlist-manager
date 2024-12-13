import { User, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import { supabase } from "@/lib/supabase"

// This function will be used to get the user session
export const session = async ({ session, token }: any) => {
  session.user.id = token.id
  session.accessToken = token.access_token
  return session
}

// Fetch user session from Supabase
export const getUserSession = async (): Promise<User | null> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  })
  return authUserSession?.user || null
}

// Validate environment variables
const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const NEXT_PUBLIC_GOOGLE_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
const NEXT_PUBLIC_NEXTAUTH_SECRET = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET

if (
  !NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  !NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ||
  !NEXT_PUBLIC_NEXTAUTH_SECRET
) {
  console.error("Missing critical environment variables", {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: !!NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: !!NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_NEXTAUTH_SECRET: !!NEXT_PUBLIC_NEXTAUTH_SECRET,
  })
  throw new Error("Missing critical NextAuth configuration")
}

// Helper function to get the access token
export const getAccessToken = async (): Promise<string | null> => {
  const session = await getServerSession(authOption)
  if (session?.user) {
    return (session as any).accessToken || null
  }
  console.error("No session or access token found")
  return null
}

const insertUserData = async (profile: any, account: any) => {
  const currentTime = new Date().toISOString()

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("newusers")
      .select("id")
      .eq("email", profile.email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user:", fetchError)
    }

    if (!existingUser) {
      const { error: insertError } = await supabase.from("newusers").insert([
        {
          email: profile.email,
          name: profile.name,
          avatar_url: profile.image,
          provider: account?.provider,
          provider_id: account?.providerAccountId,
          created_at: currentTime,
          updated_at: currentTime,
          last_sign_in: currentTime,
        },
      ])

      if (insertError) {
        console.error("Error creating user:", insertError)
      }
    } else {
      const { error: updateError } = await supabase
        .from("newusers")
        .update({
          name: profile.name,
          avatar_url: profile.image,
          updated_at: currentTime,
          last_sign_in: currentTime,
        })
        .eq("email", profile.email)

      if (updateError) {
        console.error("Error updating user:", updateError)
      }
    }
  } catch (error) {
    console.error("Unexpected error during user data insertion:", error)
  }
}

const authOption: NextAuthOptions = {
  secret: NEXT_PUBLIC_NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.readonly",
          access_type: "offline",
          response_type: "code",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        console.error("No email in profile")
        return false
      }

      await insertUserData(profile, account)
      return true
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    },
    session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session as any).accessToken = token.access_token
      }
      return session
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token
      }
      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
