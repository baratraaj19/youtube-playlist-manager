"use client"

import { useDrag, useDrop } from "react-dnd"
import { Card } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

interface PlaylistCardProps {
  id: string
  index: number
  title: string
  imageUrl: string
  videoCount: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onClick: () => void
}

export function PlaylistCard({
  id,
  index,
  title,
  imageUrl,
  videoCount,
  moveCard,
  onClick,
}: PlaylistCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "PLAYLIST_CARD",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "PLAYLIST_CARD",
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index)
        item.index = index
      }
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className='transition-shadow duration-200 hover:shadow-lg cursor-pointer'
      onClick={onClick}>
      <Card className='relative overflow-hidden group bg-[#1C1C24] rounded-xl border border-[#2E2E3A]'>
        <Image
          src={imageUrl}
          alt={title}
          className='w-full aspect-video object-cover rounded-t-xl'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/80 rounded-xl' />
        <div className='absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end'>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-white font-semibold text-lg'>{title}</h3>
            <button className='text-white opacity-0 group-hover:opacity-100 transition-opacity'>
              <MoreHorizontal className='h-5 w-5' />
            </button>
          </div>
          <div className='flex items-center text-white/80 text-sm'>
            <span>{videoCount} Videos</span>
          </div>
        </div>

        {/* Badge for videoCount greater than 5 */}
        {videoCount > 5 && (
          <div className='absolute top-2 right-2 bg-[#3A3AF1] text-white text-xs px-2 py-1 rounded-full'>
            <span>🔥{videoCount}</span>
          </div>
        )}
      </Card>
    </div>
  )
}
