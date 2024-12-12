// import { createClient } from "@supabase/supabase-js"
// import { User, getServerSession } from "next-auth"

// // Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// // This function will be used to get the user session
// export const session = async ({ session, token }: any) => {
//   session.user.id = token.id
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

// import { NextAuthOptions } from "next-auth"
// import NextAuth from "next-auth/next"
// import GoogleProvider from "next-auth/providers/google"

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

// if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
//   throw new Error("Missing Google OAuth Credentials")
// }

// const authOption: NextAuthOptions = {
//   debug: true, // Enable debug messages
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login", // Error code passed in query string as ?error=
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
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           access_type: "offline",
//           response_type: "code",
//           prompt: "consent",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ account, profile }) {
//       // Always allow sign in
//       if (!profile?.email) {
//         console.error("No email in profile")
//         return false
//       }

//       try {
//         // First check if user exists
//         const { data: existingUser, error: fetchError } = await supabase
//           .from("users")
//           .select("*")
//           .eq("email", profile.email)
//           .single()

//         if (fetchError && fetchError.code !== "PGRST116") {
//           console.error("Error fetching user:", fetchError)
//           // Continue anyway - we don't want to block sign in due to DB issues
//         }

//         if (!existingUser) {
//           // Create new user if doesn't exist
//           const { error: insertError } = await supabase.from("users").insert([
//             {
//               email: profile.email,
//               name: profile.name,
//               avatar_url: profile.image,
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//             },
//           ])

//           if (insertError) {
//             console.error("Error creating user:", insertError)
//             // Continue anyway - we don't want to block sign in due to DB issues
//           }
//         } else {
//           // Update existing user
//           const { error: updateError } = await supabase
//             .from("users")
//             .update({
//               name: profile.name,
//               avatar_url: profile.image,
//               updated_at: new Date().toISOString(),
//             })
//             .eq("email", profile.email)

//           if (updateError) {
//             console.error("Error updating user:", updateError)
//             // Continue anyway - we don't want to block sign in due to DB issues
//           }
//         }

//         return true
//       } catch (error) {
//         console.error("Unexpected error during sign in:", error)
//         // Continue anyway - we don't want to block sign in due to DB issues
//         return true
//       }
//     },
//     async redirect({ url, baseUrl }) {
//       // Always redirect to dashboard after sign in
//       return `${baseUrl}/dashboard`
//     },
//     session,
//     async jwt({ token, user, account, profile }) {
//       if (profile) {
//         try {
//           // Fetch user from Supabase based on email
//           const { data, error } = await supabase
//             .from("users")
//             .select("id")
//             .eq("email", profile.email)
//             .single()

//           if (error) {
//             console.error("Error fetching user for JWT:", error)
//             // Don't throw error, just continue with basic token
//           } else if (data) {
//             token.id = data.id
//           }
//         } catch (error) {
//           console.error("Unexpected error in JWT callback:", error)
//           // Don't throw error, just continue with basic token
//         }
//       }
//       return token
//     },
//   },
// }

// const handler = NextAuth(authOption)
// export { handler as GET, handler as POST }

import { createClient } from "@supabase/supabase-js"
import { User, getServerSession } from "next-auth"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// This function will be used to get the user session
export const session = async ({ session, token }: any) => {
  session.user.id = token.id
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

import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth Credentials")
}

const insertUserData = async (profile: any, account: any) => {
  const currentTime = new Date().toISOString()

  try {
    // Check if the user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("newusers")
      .select("id")
      .eq("email", profile.email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user:", fetchError)
    }

    if (!existingUser) {
      // Create new user if not found
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
      // Update the existing user
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
  debug: true, // Enable debug messages
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

      // Call the insertUserData function to store or update user data
      await insertUserData(profile, account)

      return true
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`
    },
    session,
    async jwt({ token, profile }) {
      if (profile) {
        try {
          const { data, error } = await supabase
            .from("newusers")
            .select("id")
            .eq("email", profile.email)
            .single()

          if (error) {
            console.error("Error fetching user for JWT:", error)
          } else if (data) {
            token.id = data.id
          }
        } catch (error) {
          console.error("Unexpected error in JWT callback:", error)
        }
      }
      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
