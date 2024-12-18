import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface Video {
  id: string
  title: string
  duration: string
  productsAttached: number
  thumbnailUrl: string
}

interface RightSidebarProps {
  playlist: {
    id: string
    title: string
    videos: Video[]
  } | null
  playlistItems: any[]
  setSelectedPlaylist: (playlist: any) => void
}

export function RightSidebar({
  playlist,
  playlistItems,
  setSelectedPlaylist,
}: RightSidebarProps) {
  if (!playlist) return null

  const handleUpdatePlaylist = () => {
    setSelectedPlaylist(playlist)
  }

  return (
    <div className='w-4/12 border-l border-[#2E2E3A] bg-[#1C1C24] flex flex-col'>
      <div className='p-4 border-b border-[#2E2E3A]'>
        <h2 className='text-lg font-semibold mb-4 text-white'>
          Thumbnail Title
        </h2>
        <Input
          type='text'
          placeholder='Get Sporty in Style'
          className='mb-4 bg-[#13131A] border-[#2E2E3A] text-white'
        />
        <Label className='text-sm font-medium mb-2 text-white'>
          Video status
        </Label>
        <RadioGroup defaultValue='active' className='flex space-x-4'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem
              value='active'
              id='active'
              className='border-[#2E2E3A] text-blue-500'
            />
            <Label htmlFor='active' className='text-white'>
              Active
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem
              value='inactive'
              id='inactive'
              className='border-[#2E2E3A] text-blue-500'
            />
            <Label htmlFor='inactive' className='text-white'>
              Inactive
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className='flex-1 overflow-auto'>
        <ScrollArea className='h-full'>
          <div className='p-4'>
            <h3 className='text-lg font-semibold mb-4 text-white'>
              Product List
            </h3>
            {playlistItems.map((video: any) => (
              <div
                key={video.id}
                className='flex items-center justify-between bg-[#13131A] border-[#2E2E3A] p-2 rounded-xl px-4 mb-4'>
                <a
                  href={video.videoUrl}
                  target='_blank'
                  className='flex items-center rounded-xl space-x-4'>
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    width={150}
                    height={450}
                    className='h-20 rounded-md'
                  />
                  <div className='flex-1'>
                    <h4 className='font-medium text-white'>
                      {video.snippet.title}
                    </h4>
                    <p className='text-sm text-gray-400'>{video.duration}</p>
                  </div>
                </a>
                <input
                  type='checkbox'
                  className='rounded text-blue-500 bg-[#13131A] border-[#2E2E3A] px-2'
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className='p-4 border-t border-[#2E2E3A]'>
        <Button
          onClick={handleUpdatePlaylist}
          className='w-full bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
          Update Playlist
        </Button>
      </div>
    </div>
  )
}
