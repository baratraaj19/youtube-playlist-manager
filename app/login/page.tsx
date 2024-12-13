"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn, useSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-[400px]'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            className='w-full mt-4'
            onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}