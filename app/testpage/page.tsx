// import { getAccessToken } from "@/app/api/auth/[...nextauth]/route"
// import React from "react"

// const Page = () => {
//   const fetchUserPlaylists = async (apiKey: any, accessToken: any) => {
//     try {
//       console.log("Step 1: Fetching channel ID...")

//       // Step 1: Fetch the user's channel ID
//       const channelResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )

//       if (!channelResponse.ok) {
//         throw new Error(
//           `Failed to fetch channel ID. Status: ${channelResponse.status}`
//         )
//       }

//       const channelData = await channelResponse.json()
//       if (!channelData.items || channelData.items.length === 0) {
//         throw new Error("No channel found for the authenticated user.")
//       }

//       const channelId = channelData.items[0].id
//       console.log("Channel ID:", channelId)

//       // Step 2: Fetch the user's playlists
//       console.log("Step 2: Fetching playlists...")
//       const playlistResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${apiKey}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: "application/json",
//           },
//         }
//       )

//       if (playlistResponse.ok) {
//         const data = await playlistResponse.json()
//         const playlists = data.items.map((item: any) => ({
//           id: item.id,
//           snippet: item.snippet,
//           contentDetails: item.contentDetails,
//         }))
//         return playlists // Return the processed playlist data
//       } else {
//         throw new Error(
//           `Failed to fetch playlists: ${playlistResponse.statusText}`
//         )
//       }
//     } catch (error) {
//       console.error("Error during fetch operations:", error)
//       throw error // Re-throw the error to handle it outside if needed
//     }
//   }

//   ;(async () => {
//     const apiKey = process.env.YOUTUBE_API_KEY
//     const accessToken = await getAccessToken()

//     console.log("access token in new", accessToken)

//     try {
//       const playlists = await fetchUserPlaylists(apiKey, accessToken)
//       console.log("User Playlists:", playlists)
//     } catch (error) {
//       console.error("Failed to fetch user playlists:", error)
//     }
//   })()

//   return <div>page</div>
// }

// export default Page

// app/page.js or app/your-page/page.js

import { getAccessToken } from "@/app/api/auth/[...nextauth]/route"
import React from "react"

async function fetchUserPlaylists(apiKey: string, accessToken: string) {
  try {
    console.log("Step 1: Fetching channel ID...")

    // Step 1: Fetch the user's channel ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!channelResponse.ok) {
      throw new Error(
        `Failed to fetch channel ID. Status: ${channelResponse.status}`
      )
    }

    const channelData = await channelResponse.json()
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("No channel found for the authenticated user.")
    }

    const channelId = channelData.items[0].id
    console.log("Channel ID:", channelId)

    // Step 2: Fetch the user's playlists
    console.log("Step 2: Fetching playlists...")
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    )

    if (playlistResponse.ok) {
      const data = await playlistResponse.json()
      const playlists = data.items.map((item: any) => ({
        id: item.id,
        snippet: item.snippet,
        contentDetails: item.contentDetails,
      }))
      return playlists // Return the processed playlist data
    } else {
      throw new Error(
        `Failed to fetch playlists: ${playlistResponse.statusText}`
      )
    }
  } catch (error) {
    console.error("Error during fetch operations:", error)
    throw error // Re-throw the error to handle it outside if needed
  }
}

const Page = async () => {
  const apiKey: any = process.env.YOUTUBE_API_KEY
  const accessToken: any = await getAccessToken()

  console.log("Access token:", accessToken)

  try {
    const playlists = await fetchUserPlaylists(apiKey, accessToken)
    console.log("User Playlists:", playlists)
    return (
      <div>
        <h1>User Playlists</h1>
        <pre>{JSON.stringify(playlists, null, 2)}</pre>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch user playlists:", error)
    return <div>Error fetching playlists.</div>
  }
}

export default Page
