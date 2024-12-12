// "use client"

// import { useEffect, useState } from "react"
// import { useSession } from "next-auth/react"
// import axios from "axios"

// interface Playlist {
//   id: string
//   title: string
//   description: string
//   itemCount: number
//   thumbnailUrl: string
// }

// interface PlaylistItem {
//   id: string
//   title: string
//   description: string
//   thumbnailUrl: string
//   videoId: string
//   channelTitle: string
//   publishedAt: string
// }

// export default function Playlists() {
//   const { data: session } = useSession()
//   const [playlists, setPlaylists] = useState<Playlist[]>([])
//   const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
//     null
//   )
//   const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       if (session) {
//         try {
//           const response = await axios.get("/api/playlists")
//           setPlaylists(response.data.playlists)
//         } catch (err) {
//           console.error("Error fetching playlists:", err)
//           setError("Error fetching playlists.")
//         } finally {
//           setLoading(false)
//         }
//       }
//     }

//     if (session) {
//       fetchPlaylists()
//     }
//   }, [session])

//   useEffect(() => {
//     const fetchPlaylistItems = async () => {
//       if (selectedPlaylist) {
//         try {
//           setLoading(true)
//           const response = await axios.get(
//             `/api/playlistItems?playlistId=${selectedPlaylist.id}`
//           )
//           setPlaylistItems(response.data.items)
//         } catch (err) {
//           console.error("Error fetching playlist items:", err)
//           setError("Error fetching playlist items.")
//         } finally {
//           setLoading(false)
//         }
//       }
//     }

//     if (selectedPlaylist) {
//       fetchPlaylistItems()
//     }
//   }, [selectedPlaylist])

//   const handlePlaylistSelect = (playlist: Playlist) => {
//     setSelectedPlaylist(playlist)
//   }

//   if (!session) {
//     return <div>Please sign in to view your playlists.</div>
//   }

//   return (
//     <div className='container mx-auto p-4'>
//       <h1 className='text-2xl font-bold mb-4'>Your YouTube Playlists</h1>

//       {loading && <p>Loading...</p>}
//       {error && <p className='text-red-500'>{error}</p>}

//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//         <div>
//           <h2 className='text-xl font-semibold mb-2'>Playlists</h2>
//           {playlists.length > 0 ? (
//             <ul>
//               {playlists.map((playlist) => (
//                 <li
//                   key={playlist.id}
//                   onClick={() => handlePlaylistSelect(playlist)}
//                   className={`cursor-pointer p-2 mb-2 rounded ${
//                     selectedPlaylist?.id === playlist.id
//                       ? "bg-blue-200"
//                       : "hover:bg-gray-100"
//                   }`}>
//                   <div className='flex items-center'>
//                     {playlist.thumbnailUrl && (
//                       <img
//                         src={playlist.thumbnailUrl}
//                         alt={playlist.title}
//                         className='w-16 h-16 mr-4 object-cover'
//                       />
//                     )}
//                     <div>
//                       <h3 className='font-medium'>{playlist.title}</h3>
//                       <p className='text-sm text-gray-500'>
//                         {playlist.itemCount} items
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No playlists found.</p>
//           )}
//         </div>

//         {selectedPlaylist && (
//           <div className='md:col-span-1 lg:col-span-2'>
//             <h2 className='text-xl font-semibold mb-2'>
//               Playlist: {selectedPlaylist.title}
//             </h2>
//             {playlistItems.length > 0 ? (
//               <ul>
//                 {playlistItems.map((item) => (
//                   <li
//                     key={item.id}
//                     className='flex items-center mb-4 p-2 border-b'>
//                     {item.thumbnailUrl && (
//                       <img
//                         src={item.thumbnailUrl}
//                         alt={item.title}
//                         className='w-24 h-24 mr-4 object-cover'
//                       />
//                     )}
//                     <div>
//                       <h3 className='font-medium'>{item.title}</h3>
//                       <p className='text-sm text-gray-500'>
//                         {item.channelTitle} | Published:{" "}
//                         {new Date(item.publishedAt).toLocaleDateString()}
//                       </p>
//                       <p className='text-sm text-gray-700 mt-1 line-clamp-2'>
//                         {item.description}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No items in this playlist.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { getAccessToken } from "@/app/api/auth/[...nextauth]/route"
import React from "react"

const Page = () => {
  const fetchUserPlaylists = async (apiKey: any, accessToken: any) => {
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

  ;(async () => {
    const apiKey = process.env.YOUTUBE_API_KEY
    const accessToken = await getAccessToken()

    console.log("access token in new", accessToken)

    try {
      const playlists = await fetchUserPlaylists(apiKey, accessToken)
      console.log("User Playlists:", playlists)
    } catch (error) {
      console.error("Failed to fetch user playlists:", error)
    }
  })()

  return <div>page</div>
}

export default Page
