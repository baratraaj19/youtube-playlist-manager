// "use client"
// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { redirect } from "next/navigation"
// import { DndProvider } from "react-dnd"
// import { HTML5Backend } from "react-dnd-html5-backend"
// import { Sidebar } from "@/components/sidebar"
// import { PlaylistCard } from "@/components/playlist-card"
// import { RightSidebar } from "@/components/right-sidebar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, HelpCircle, ArrowRight } from "lucide-react"
// import ProfileButton from "@/components/profile-button"
// import { fetchPlaylists } from "@/lib/youtube" // Import the helper function

// export default function DashboardPage() {
//   const { data: session, status } = useSession()
//   const [playlists, setPlaylists] = useState<any[]>([])
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null)
//   const [activeView, setActiveView] = useState("product-playlists")

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       redirect("/login")
//     }
//   }, [status])

//   // Fetch playlists when the component mounts
//   useEffect(() => {
//     if (session) {
//       const fetchData = async () => {
//         const apiKey: any = process.env.YOUTUBE_API_KEY
//         const accessToken: any = (session as any).accessToken // Use the session's access token
//         try {
//           const playlistsData = await fetchPlaylists(apiKey, accessToken)
//           setPlaylists(playlistsData)
//         } catch (error) {
//           console.error("Error fetching playlists:", error)
//         }
//       }

//       fetchData()
//     }
//   }, [session])

//   // Show loading state while checking authentication
//   if (status === "loading") {
//     return (
//       <div className='h-screen w-screen flex items-center justify-center bg-[#13131A]'>
//         <div className='text-white'>Loading...</div>
//       </div>
//     )
//   }

//   // Only render dashboard content if authenticated
//   if (!session) {
//     return null
//   }

//   const moveCard = (dragIndex: number, hoverIndex: number) => {
//     setPlaylists((prevPlaylists) => {
//       const newPlaylists = [...prevPlaylists]
//       const draggedItem = newPlaylists[dragIndex]
//       newPlaylists.splice(dragIndex, 1)
//       newPlaylists.splice(hoverIndex, 0, draggedItem)
//       return newPlaylists
//     })
//   }

//   const saveLayout = () => {
//     localStorage.setItem("playlistLayout", JSON.stringify(playlists))
//   }

//   const loadLayout = () => {
//     const savedLayout = localStorage.getItem("playlistLayout")
//     if (savedLayout) {
//       setPlaylists(JSON.parse(savedLayout))
//     }
//   }

//   const renderContent = () => {
//     switch (activeView) {
//       case "product-playlists":
//         return (
//           <>
//             <div className='flex justify-between items-center mb-6'>
//               <h2 className='text-2xl font-bold text-white'>
//                 Product Playlists
//               </h2>
//               <div className='space-x-4'>
//                 <Button
//                   onClick={saveLayout}
//                   className='bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
//                   Save Layout
//                 </Button>
//                 <Button
//                   onClick={loadLayout}
//                   variant='outline'
//                   className='border-[#3A3AF1] text-[#3A3AF1] hover:bg-[#3A3AF1]/10'>
//                   Load Layout
//                 </Button>
//               </div>
//             </div>
//             <div className='bg-[#1C1C24] rounded-xl border border-[#2E2E3A] p-6 flex-1 overflow-auto'>
//               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//                 {playlists.map((playlist, index) => (
//                   <PlaylistCard
//                     key={playlist.id}
//                     id={playlist.id}
//                     index={index}
//                     title={playlist.title}
//                     imageUrl={playlist.imageUrl}
//                     videoCount={playlist.videoCount}
//                     moveCard={moveCard}
//                     onClick={() => setSelectedPlaylist(playlist)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </>
//         )
//       case "youtube-playlists":
//         return (
//           <div className='flex items-center justify-center h-full'>
//             <h2 className='text-2xl font-bold text-white'>YouTube Playlists</h2>
//           </div>
//         )
//       default:
//         return (
//           <div className='flex items-center justify-center h-full'>
//             <h2 className='text-2xl font-bold text-white'>Coming Soon</h2>
//           </div>
//         )
//     }
//   }

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className='flex h-screen bg-[#13131A]'>
//         <Sidebar onViewChange={setActiveView} />
//         <div className='flex-1 overflow-hidden flex flex-col'>
//           <header className='border-b border-[#2E2E3A] p-4'>
//             <div className='flex items-center justify-between'>
//               <h1 className='text-xl font-semibold text-white'>
//                 Design Studio
//               </h1>
//               <div className='flex items-center space-x-4'>
//                 <Button
//                   variant='outline'
//                   className='border-[#2E2E3A] text-white hover:bg-[#2E2E3A]/50 bg-transparent'>
//                   <HelpCircle className='h-5 w-5 mr-2' />
//                   Support Request
//                 </Button>
//                 <Button className='bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
//                   <ArrowRight className='h-5 w-5 mr-2' />
//                   Product Tour
//                 </Button>
//                 <div className='relative'>
//                   <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
//                   <Input
//                     placeholder='Search Project...'
//                     className='pl-10 w-64 bg-[#1C1C24] border-[#2E2E3A] text-white'
//                   />
//                 </div>
//                 <div>
//                   <ProfileButton />
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className='flex-1 overflow-hidden flex'>
//             <main className='flex-1 overflow-auto p-6 flex flex-col'>
//               {renderContent()}
//             </main>
//             {activeView === "product-playlists" && (
//               <RightSidebar playlist={selectedPlaylist} />
//             )}
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   )
// }

"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Sidebar } from "@/components/sidebar"
import { PlaylistCard } from "@/components/playlist-card"
import { RightSidebar } from "@/components/right-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, ArrowRight } from "lucide-react"
import ProfileButton from "@/components/profile-button"
import { fetchPlaylists, fetchPlaylistItems } from "@/lib/youtube" // Import the helper function

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<any[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)
  const [activeView, setActiveView] = useState("product-playlists")
  const [playlistItems, setPlaylistItems] = useState<any[]>([]) // Store fetched playlist items

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  // Fetch playlists when the component mounts
  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const apiKey: any = process.env.YOUTUBE_API_KEY
        const accessToken: any = (session as any).accessToken // Use the session's access token
        try {
          const playlistsData = await fetchPlaylists(apiKey, accessToken)
          setPlaylists(playlistsData)
        } catch (error) {
          console.error("Error fetching playlists:", error)
        }
      }

      fetchData()
    }
  }, [session])

  // Fetch playlist items when a playlist is selected
  useEffect(() => {
    if (selectedPlaylist) {
      const fetchItems = async () => {
        const apiKey: any = process.env.YOUTUBE_API_KEY
        const accessToken: any = (session as any).accessToken
        try {
          const items = await fetchPlaylistItems(
            selectedPlaylist.id,
            apiKey,
            accessToken
          )
          setPlaylistItems(items)
        } catch (error) {
          console.error("Error fetching playlist items:", error)
        }
      }

      fetchItems()
    }
  }, [selectedPlaylist])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-[#13131A]'>
        <div className='text-white'>Loading...</div>
      </div>
    )
  }

  // Only render dashboard content if authenticated
  if (!session) {
    return null
  }

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    setPlaylists((prevPlaylists) => {
      const newPlaylists = [...prevPlaylists]
      const draggedItem = newPlaylists[dragIndex]
      newPlaylists.splice(dragIndex, 1)
      newPlaylists.splice(hoverIndex, 0, draggedItem)
      return newPlaylists
    })
  }

  const saveLayout = () => {
    localStorage.setItem("playlistLayout", JSON.stringify(playlists))
  }

  const loadLayout = () => {
    const savedLayout = localStorage.getItem("playlistLayout")
    if (savedLayout) {
      setPlaylists(JSON.parse(savedLayout))
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case "product-playlists":
        return (
          <>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-white'>
                Product Playlists
              </h2>
              <div className='space-x-4'>
                <Button
                  onClick={saveLayout}
                  className='bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
                  Save Layout
                </Button>
                <Button
                  onClick={loadLayout}
                  variant='outline'
                  className='border-[#3A3AF1] text-[#3A3AF1] hover:bg-[#3A3AF1]/10'>
                  Load Layout
                </Button>
              </div>
            </div>
            <div className='bg-[#1C1C24] rounded-xl border border-[#2E2E3A] p-6 flex-1 overflow-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {playlists.map((playlist, index) => (
                  <PlaylistCard
                    key={playlist.id}
                    id={playlist.id}
                    index={index}
                    title={playlist.title}
                    imageUrl={playlist.imageUrl}
                    videoCount={playlist.videoCount}
                    moveCard={moveCard}
                    onClick={() => setSelectedPlaylist(playlist)} // Set the selected playlist
                  />
                ))}
              </div>
            </div>
          </>
        )
      case "youtube-playlists":
        return (
          <div className='flex items-center justify-center h-full'>
            <h2 className='text-2xl font-bold text-white'>YouTube Playlists</h2>
          </div>
        )
      default:
        return (
          <div className='flex items-center justify-center h-full'>
            <h2 className='text-2xl font-bold text-white'>Coming Soon</h2>
          </div>
        )
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-screen bg-[#13131A]'>
        <Sidebar onViewChange={setActiveView} />
        <div className='flex-1 overflow-hidden flex flex-col'>
          <header className='border-b border-[#2E2E3A] p-4'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold text-white'>
                Design Studio
              </h1>
              <div className='flex items-center space-x-4'>
                <Button
                  variant='outline'
                  className='border-[#2E2E3A] text-white hover:bg-[#2E2E3A]/50 bg-transparent'>
                  <HelpCircle className='h-5 w-5 mr-2' />
                  Support Request
                </Button>
                <Button className='bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
                  <ArrowRight className='h-5 w-5 mr-2' />
                  Product Tour
                </Button>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                  <Input
                    placeholder='Search Project...'
                    className='pl-10 w-64 bg-[#1C1C24] border-[#2E2E3A] text-white'
                  />
                </div>
                <div>
                  <ProfileButton />
                </div>
              </div>
            </div>
          </header>
          <div className='flex-1 overflow-hidden flex'>
            <main className='flex-1 overflow-auto p-6 flex flex-col'>
              {renderContent()}
            </main>
            {activeView === "product-playlists" && (
              <RightSidebar
                playlist={selectedPlaylist}
                playlistItems={playlistItems}
              />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
