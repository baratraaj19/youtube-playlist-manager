// import { User, getServerSession } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import { NextAuthOptions } from "next-auth"
// import NextAuth from "next-auth/next"
// import { supabase } from "@/lib/supabase"

// // This function will be used to get the user session
// export const session = async ({ session, token }: any) => {
//   session.user.id = token.id
//   session.accessToken = token.access_token
//   return session
// }

// // Fetch user session from Supabase
// export const getUserSession = async (): Promise<User | null> => {
//   const authUserSession = await getServerSession({
//     callbacks: {
//       session,
//     },
//   })
//   return authUserSession?.user || null
// }

// // Validate environment variables
// const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
// const NEXT_PUBLIC_GOOGLE_CLIENT_SECRET =
//   process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
// const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

// if (
//   !NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
//   !NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ||
//   !NEXTAUTH_SECRET
// ) {
//   console.error("Missing critical environment variables", {
//     NEXT_PUBLIC_GOOGLE_CLIENT_ID: !!NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//     NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: !!NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//     NEXTAUTH_SECRET: !!NEXTAUTH_SECRET,
//   })
//   throw new Error("Missing critical NextAuth configuration")
// }

// // Helper function to get the access token
// export const getAccessToken = async (): Promise<string | null> => {
//   const session = await getServerSession(authOption)
//   if (session?.user) {
//     return (session as any).accessToken || null
//   }
//   console.error("No session or access token found")
//   return null
// }

// const insertUserData = async (profile: any, account: any) => {
//   const currentTime = new Date().toISOString()

//   try {
//     const { data: existingUser, error: fetchError } = await supabase
//       .from("newusers")
//       .select("id")
//       .eq("email", profile.email)
//       .single()

//     if (fetchError && fetchError.code !== "PGRST116") {
//       console.error("Error fetching user:", fetchError)
//     }

//     if (!existingUser) {
//       const { error: insertError } = await supabase.from("newusers").insert([
//         {
//           email: profile.email,
//           name: profile.name,
//           avatar_url: profile.image,
//           provider: account?.provider,
//           provider_id: account?.providerAccountId,
//           created_at: currentTime,
//           updated_at: currentTime,
//           last_sign_in: currentTime,
//         },
//       ])

//       if (insertError) {
//         console.error("Error creating user:", insertError)
//       }
//     } else {
//       const { error: updateError } = await supabase
//         .from("newusers")
//         .update({
//           name: profile.name,
//           avatar_url: profile.image,
//           updated_at: currentTime,
//           last_sign_in: currentTime,
//         })
//         .eq("email", profile.email)

//       if (updateError) {
//         console.error("Error updating user:", updateError)
//       }
//     }
//   } catch (error) {
//     console.error("Unexpected error during user data insertion:", error)
//   }
// }

// const authOption: NextAuthOptions = {
//   secret: NEXTAUTH_SECRET,
//   debug: true,
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   cookies: {
//     sessionToken: {
//       name: `next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
//   providers: [
//     GoogleProvider({
//       clientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope:
//             "openid profile email https://www.googleapis.com/auth/youtube.readonly",
//           access_type: "offline",
//           response_type: "code",
//           prompt: "consent",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ account, profile }) {
//       console.log("SignIn callback:", { account, profile })
//       if (!profile?.email) {
//         console.error("No email in profile")
//         return false
//       }
//       await insertUserData(profile, account)
//       return true
//     },
//     async redirect({ url, baseUrl }) {
//       console.log("Redirect callback:", { url, baseUrl })
//       return `${baseUrl}/dashboard`
//     },
//     session({ session, token }) {
//       console.log("Session callback:", { session, token })
//       if (session.user) {
//         ;(session.user as any).id = token.id
//         ;(session as any).accessToken = token.access_token
//       }
//       return session
//     },
//     async jwt({ token, account }) {
//       console.log("JWT callback:", { token, account })
//       if (account?.access_token) {
//         token.access_token = account.access_token
//       }
//       return token
//     },
//   },
// }

// const handler = NextAuth(authOption)
// export { handler as GET, handler as POST }
import { User, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import { supabase } from "@/lib/supabase"

// Enhanced logging utility
const logError = (context: string, error: any) => {
  console.error(`[NextAuth Error - ${context}]`, {
    errorMessage: error?.message,
    errorCode: error?.code,
    fullError: JSON.stringify(error, null, 2),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

// Validate and log environment variables
const validateEnvironmentVariables = () => {
  const requiredEnvVars = [
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
  ]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    logError("Environment Variables", {
      message: "Missing critical environment variables",
      missingVariables: missingVars,
      presentVariables: requiredEnvVars
        .filter((varName) => !!process.env[varName])
        .map((varName) => ({
          [varName]: process.env[varName]?.substring(0, 5) + "...",
        })),
    })

    throw new Error(
      `Missing critical NextAuth configuration: ${missingVars.join(", ")}`
    )
  }
}

// Enhanced user data insertion with comprehensive logging
const insertUserData = async (profile: any, account: any) => {
  try {
    validateEnvironmentVariables()

    const currentTime = new Date().toISOString()

    // Log incoming profile and account details
    console.log("[User Profile Insertion]", {
      email: profile.email,
      name: profile.name,
      provider: account?.provider,
      providerAccountId: account?.providerAccountId,
    })

    // Check for existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("newusers")
      .select("id")
      .eq("email", profile.email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      logError("User Fetch", fetchError)
    }

    // User insertion or update logic
    if (!existingUser) {
      // New user insertion
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
        logError("User Insertion", insertError)
      } else {
        console.log("[New User Created]", profile.email)
      }
    } else {
      // Existing user update
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
        logError("User Update", updateError)
      } else {
        console.log("[User Updated]", profile.email)
      }
    }
  } catch (error) {
    logError("User Data Insertion", error)
    throw error
  }
}

// Authentication Options with Enhanced Logging
const authOption: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  // Session Configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom Pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Secure Cookie Configuration
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

  // Providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
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

  // Enhanced Callbacks with Detailed Logging
  callbacks: {
    // SignIn Callback
    async signIn({ account, profile }) {
      console.log("[SignIn Callback]", {
        accountDetails: JSON.stringify(account, null, 2),
        profileDetails: JSON.stringify(profile, null, 2),
        environment: process.env.NODE_ENV,
      })

      try {
        // Validate email presence
        if (!profile?.email) {
          console.error("[SignIn Error] No email in profile")
          return false
        }

        // Insert or update user data
        await insertUserData(profile, account)
        return true
      } catch (error) {
        logError("SignIn Callback", error)
        return false
      }
    },

    // Redirect Callback
    async redirect({ url, baseUrl }) {
      console.log("[Redirect Callback]", {
        url,
        baseUrl,
        currentEnvironment: process.env.NODE_ENV,
      })
      return `${baseUrl}/dashboard`
    },

    // Session Callback
    async session({ session, token }) {
      console.log("[Session Callback]", {
        sessionUser: JSON.stringify(session.user, null, 2),
        tokenDetails: JSON.stringify(token, null, 2),
      })

      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session as any).accessToken = token.access_token
      }
      return session
    },

    // JWT Callback
    async jwt({ token, account, profile }) {
      console.log("[JWT Callback]", {
        tokenDetails: JSON.stringify(token, null, 2),
        accountDetails: JSON.stringify(account, null, 2),
        profileDetails: JSON.stringify(profile, null, 2),
      })

      if (account?.access_token) {
        token.access_token = account.access_token
      }
      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
