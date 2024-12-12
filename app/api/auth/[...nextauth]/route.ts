import { User, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import { supabase } from "@/lib/supabase"

// This function will be used to get the user session
export const session = async ({ session, token }: any) => {
  session.user.id = token.id
  session.accessToken = token.access_token // Pass the access token here
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
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !NEXTAUTH_SECRET) {
  console.error("Missing critical environment variables", {
    GOOGLE_CLIENT_ID: !!GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: !!NEXTAUTH_SECRET,
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

const baseUrl = "http://localhost:3000/"

const authOption: NextAuthOptions = {
  secret: NEXTAUTH_SECRET, // Add this line
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
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
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.readonly", // Add this line
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
        ;(session.user as any).id = token.id // Type assertion to avoid TypeScript error
        ;(session as any).accessToken = token.access_token // Type assertion to avoid TypeScript error
      }
      return session
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token // Save access token from Google OAuth
      }
      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
