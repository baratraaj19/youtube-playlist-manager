import { google } from "googleapis"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

interface Playlist {
  id: string
  title: string
}

interface PlaylistsResponse {
  playlists: Playlist[]
}

interface ErrorResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaylistsResponse | ErrorResponse>
) {
  const session = await getSession({ req })

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {
    const youtube = google.youtube({
      version: "v3",
      auth: session.accessToken,
    })

    const response = await youtube.playlists.list({
      part: "snippet",
      mine: true,
    })

    const playlists: Playlist[] = response.data.items.map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet.title,
    }))

    res.status(200).json({ playlists })
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Unknown error" })
  }
}
