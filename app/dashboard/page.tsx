"use client"

import { useState, useCallback, useEffect } from "react"
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

// Mock data for playlists
const initialPlaylists = [
  {
    id: "1",
    title: "Product Playlists Name 1",
    imageUrl: "/placeholder.svg?height=200&width=400",
    videoCount: 5,
    videos: [
      {
        id: "v1",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v2",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v3",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v4",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v5",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
    ],
  },
  {
    id: "2",
    title: "Product Playlists Name 2",
    imageUrl: "/placeholder.svg?height=200&width=400",
    videoCount: 5,
    videos: [
      {
        id: "v6",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v7",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v8",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v9",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v10",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
    ],
  },
  {
    id: "3",
    title: "Product Playlists Name 3",
    imageUrl: "/placeholder.svg?height=200&width=400",
    videoCount: 5,
    videos: [
      {
        id: "v11",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v12",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v13",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v14",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
      {
        id: "v15",
        title: "Video Title Name",
        duration: "4:05:60",
        productsAttached: 5,
      },
    ],
  },
]

const orderArray = [1, 3, 2]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState(initialPlaylists)
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    (typeof initialPlaylists)[0] | null
  >(null)
  const [activeView, setActiveView] = useState("product-playlists")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

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

  useEffect(() => {
    // Arrange playlists according to the orderArray
    const orderedPlaylists = orderArray
      .map((order) =>
        playlists.find((playlist) => playlist.id === order.toString())
      )
      .filter(Boolean) as typeof initialPlaylists
    setPlaylists(orderedPlaylists)
  }, [])

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setPlaylists((prevPlaylists) => {
      const newPlaylists = [...prevPlaylists]
      const draggedItem = newPlaylists[dragIndex]
      newPlaylists.splice(dragIndex, 1)
      newPlaylists.splice(hoverIndex, 0, draggedItem)
      return newPlaylists
    })
  }, [])

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
                    onClick={() => setSelectedPlaylist(playlist)}
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
              <RightSidebar playlist={selectedPlaylist} />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
