export async function fetchPlaylists(apiKey: string, accessToken: string) {
  try {
    // Fetch the channel ID first
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&key=${apiKey}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
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

    const channelId = channelData.items[0].id // Extract the channel ID

    // Fetch playlists for the channel ID
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&channelId=${channelId}&key=${apiKey}`,
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
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
        const duration = iso8601ToTimeFormat(durationIso)

        return {
          ...item,
          duration,
          videoUrl,
        }
      })
    )

    return itemsWithDuration
  } catch (error) {
    console.error("Error during fetch operation for playlist items:", error)
    throw error
  }
}
function iso8601ToTimeFormat(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(\d+)S/)

  if (match) {
    const hours = match[1] ? match[1] : "0"
    const minutes = match[2] ? match[2] : "0"
    const seconds = match[3].padStart(2, "0")

    if (hours !== "0") {
      return `${hours}:${minutes.padStart(2, "0")}:${seconds}`
    } else {
      return `${minutes}:${seconds}`
    }
  }

  return "0:00"
}
