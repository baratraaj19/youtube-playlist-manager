import { supabase } from "./supabase"
import { fetchPlaylists, fetchPlaylistItems } from "./youtube"

// Get playlists using the access token passed as argument
export const getPlaylists = async (accessToken: string) => {
  const apiKey: any = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  try {
    const playlistsData = await fetchPlaylists(apiKey, accessToken)
    return playlistsData
  } catch (error) {
    console.error("Error fetching playlists:", error)
    throw new Error("Error fetching playlists")
  }
}

// Get playlist items using the access token passed as argument
export const getPlaylistItems = async (
  playlistId: string,
  accessToken: string
) => {
  const apiKey: any = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  try {
    const items = await fetchPlaylistItems(playlistId, apiKey, accessToken)
    return items
  } catch (error) {
    console.error("Error fetching playlist items:", error)
    throw new Error("Error fetching playlist items")
  }
}

// Save the layout to the database
export const saveLayoutToDatabase = async (
  userId: string,
  layout: string[]
) => {
  try {
    const { data, error } = await supabase.from("layouts").upsert(
      [
        {
          user_id: userId,
          layout,
        },
      ],
      { onConflict: "user_id" }
    )

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error saving layout:", error)
    throw new Error("Error saving layout")
  }
}

// Load the layout from the database
export const loadLayoutFromDatabase = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("layouts")
      .select("layout")
      .eq("user_id", userId)
      .single()

    if (error) throw error

    return data?.layout || []
  } catch (error) {
    console.error("Error loading layout:", error)
    throw new Error("Error loading layout")
  }
}
