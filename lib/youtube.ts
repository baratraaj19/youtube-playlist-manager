// lib/youtube.ts

// Function to fetch the user's channel ID
export async function fetchChannelId(accessToken: string) {
  try {
    console.log("Step 1: Fetching channel ID...")

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

    return channelData.items[0].id // Return channel ID
  } catch (error) {
    console.error("Error during fetch operation for channel ID:", error)
    throw error
  }
}

// // Function to fetch the user's playlists
// export async function fetchPlaylists(apiKey: string, accessToken: string) {
//   try {
//     console.log("Step 2: Fetching playlists...")

//     const playlistResponse = await fetch(
//       `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${apiKey}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: "application/json",
//         },
//       }
//     )

//     if (!playlistResponse.ok) {
//       throw new Error(
//         `Failed to fetch playlists: ${playlistResponse.statusText}`
//       )
//     }

//     const data = await playlistResponse.json()
//     return data.items // Return the playlists data
//   } catch (error) {
//     console.error("Error during fetch operation for playlists:", error)
//     throw error
//   }
// }

export async function fetchPlaylists(apiKey: string, accessToken: string) {
  try {
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

    if (!playlistResponse.ok) {
      throw new Error(
        `Failed to fetch playlists: ${playlistResponse.statusText}`
      )
    }

    const data = await playlistResponse.json()

    // Map the API response to match the component's format
    return data.items.map((playlist: any) => ({
      id: playlist.id,
      title: playlist.snippet.title,
      imageUrl: playlist.snippet.thumbnails.high.url,
      videoCount: playlist.contentDetails.itemCount,
    }))
  } catch (error) {
    console.error("Error during fetch operation for playlists:", error)
    throw error
  }
}

// Function to fetch the items from a specific playlist
export async function fetchPlaylistItems(
  playlistId: string,
  apiKey: string,
  accessToken: string
) {
  try {
    console.log("Fetching playlist items...")

    // Construct the API URL with the provided playlistId
    const playlistItemsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    )

    if (!playlistItemsResponse.ok) {
      throw new Error(
        `Failed to fetch playlist items: ${playlistItemsResponse.statusText}`
      )
    }

    const data = await playlistItemsResponse.json()

    // Return the playlist items from the response
    return data.items
  } catch (error) {
    console.error("Error during fetch operation for playlist items:", error)
    throw error
  }
}
