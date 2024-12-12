// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { ScrollArea } from "@/components/ui/scroll-area"

// interface Video {
//   id: string
//   title: string
//   duration: string
//   productsAttached: number
// }

// interface RightSidebarProps {
//   playlist: {
//     id: string
//     title: string
//     videos: Video[]
//   } | null
// }

// export function RightSidebar({ playlist }: RightSidebarProps) {
//   if (!playlist) return null

//   return (
//     <div className='w-80 border-l border-[#2E2E3A] bg-[#1C1C24] flex flex-col'>
//       <div className='p-4 border-b border-[#2E2E3A]'>
//         <h2 className='text-lg font-semibold mb-4 text-white'>
//           Thumbnail Title
//         </h2>
//         <Input
//           type='text'
//           placeholder='Get Sporty in Style'
//           className='mb-4 bg-[#13131A] border-[#2E2E3A] text-white'
//         />
//         <Label className='text-sm font-medium mb-2 text-white'>
//           Video status
//         </Label>
//         <RadioGroup defaultValue='active' className='flex space-x-4'>
//           <div className='flex items-center space-x-2'>
//             <RadioGroupItem
//               value='active'
//               id='active'
//               className='border-[#2E2E3A] text-blue-500'
//             />
//             <Label htmlFor='active' className='text-white'>
//               Active
//             </Label>
//           </div>
//           <div className='flex items-center space-x-2'>
//             <RadioGroupItem
//               value='inactive'
//               id='inactive'
//               className='border-[#2E2E3A] text-blue-500'
//             />
//             <Label htmlFor='inactive' className='text-white'>
//               Inactive
//             </Label>
//           </div>
//         </RadioGroup>
//       </div>
//       <div className='flex-1 overflow-auto'>
//         <ScrollArea className='h-full'>
//           <div className='p-4'>
//             <h3 className='text-lg font-semibold mb-4 text-white'>
//               Product List
//             </h3>
//             {playlist.videos.map((video) => (
//               <div key={video.id} className='flex items-center space-x-4 mb-4'>
//                 <div className='w-12 h-12 bg-[#2E2E3A] rounded-md flex items-center justify-center text-2xl font-bold text-white'>
//                   M
//                 </div>
//                 <div className='flex-1'>
//                   <h4 className='font-medium text-white'>{video.title}</h4>
//                   <p className='text-sm text-gray-400'>{video.duration}</p>
//                   <p className='text-sm text-gray-400'>
//                     Products Attached: {video.productsAttached}
//                   </p>
//                 </div>
//                 <input
//                   type='checkbox'
//                   className='rounded text-blue-500 bg-[#13131A] border-[#2E2E3A]'
//                 />
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </div>
//       <div className='p-4 border-t border-[#2E2E3A]'>
//         <Button className='w-full bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
//           Update Playlist
//         </Button>
//       </div>
//     </div>
//   )
// }

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Video {
  id: string
  title: string
  duration: string
  productsAttached: number
  thumbnailUrl: string // Add thumbnail URL
}

interface RightSidebarProps {
  playlist: {
    id: string
    title: string
    videos: Video[]
  } | null
  playlistItems: any[] // Playlist items fetched using the API
}

export function RightSidebar({ playlist, playlistItems }: RightSidebarProps) {
  if (!playlist) return null

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
                className='flex items-center bg-[#13131A] border-[#2E2E3A]  p-2 rounded-xl px-4 space-x-4 mb-4'>
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className=' h-20 rounded-md'
                />
                <div className='flex-1'>
                  <h4 className='font-medium text-white'>
                    {video.snippet.title}
                  </h4>
                </div>
                <input
                  type='checkbox'
                  className='rounded text-blue-500 bg-[#13131A] border-[#2E2E3A]'
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className='p-4 border-t border-[#2E2E3A]'>
        <Button className='w-full bg-[#3A3AF1] hover:bg-[#3A3AF1]/80 text-white'>
          Update Playlist
        </Button>
      </div>
    </div>
  )
}
