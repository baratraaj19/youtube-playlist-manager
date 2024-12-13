import { getAccessToken } from "@/app/api/auth/[...nextauth]/route"

export const fetchToken = async () => {
  const token = await getAccessToken()
  console.log("accetoken : ", token)
  return token
}
