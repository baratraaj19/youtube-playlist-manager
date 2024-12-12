import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"

interface Playlist {
  id: string
  title: string
}

export default function Playlists() {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.accessToken) {
      const fetchPlaylists = async () => {
        try {
          const response = await axios.get("/api/getPlaylists")
          setPlaylists(response.data.playlists)
        } catch (err) {
          setError("Error fetching playlists.")
        } finally {
          setLoading(false)
        }
      }

      fetchPlaylists()
    }
  }, [session])

  if (!session) {
    return <div>Please sign in to view your playlists.</div>
  }

  return (
    <div>
      <h1>Your Playlists</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.title}</li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  )
}
