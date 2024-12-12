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

export async function fetchPlaylistItems(
  playlistId: string,
  apiKey: string,
  accessToken: string
) {
  try {
    console.log("Fetching playlist items...")

    // Construct the API URL with the provided playlistId
    const playlistItemsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`,
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

    const playlistData = await playlistItemsResponse.json()

    // Process each video and fetch the duration
    const itemsWithDuration = await Promise.all(
      playlistData.items.map(async (item: any) => {
        const videoId = item.snippet.resourceId.videoId

        // Fetch video details to get the duration
        const videoDetailsResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        )

        if (!videoDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch video details: ${videoDetailsResponse.statusText}`
          )
        }

        const videoDetailsData = await videoDetailsResponse.json()
        const durationIso = videoDetailsData.items[0]?.contentDetails?.duration

        // Convert ISO 8601 duration to a time format
        const duration = iso8601ToTimeFormat(durationIso)

        return {
          ...item,
          duration, // Add the duration to the item
        }
      })
    )

    return itemsWithDuration
  } catch (error) {
    console.error("Error during fetch operation for playlist items:", error)
    throw error
  }
}
// Convert ISO 8601 duration (e.g., PT2H3M40S) to a time format (e.g., 2:03:40)
function iso8601ToTimeFormat(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(\d+)S/)

  if (match) {
    const hours = match[1] ? match[1] : "0" // Default to 0 if no hours part
    const minutes = match[2] ? match[2] : "0" // Default to 0 if no minutes part
    const seconds = match[3].padStart(2, "0") // Ensure seconds are always 2 digits

    if (hours !== "0") {
      // If hours are present, return in "H:MM:SS" format
      return `${hours}:${minutes.padStart(2, "0")}:${seconds}`
    } else {
      // If hours are not present, return in "MM:SS" format
      return `${minutes}:${seconds}`
    }
  }

  return "0:00" // Default fallback in case of invalid duration
}
