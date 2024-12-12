"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  BarChart,
  Video,
  BookOpen,
  ShoppingCart,
  List,
  Calendar,
  Users,
  ChevronDown,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  { icon: BarChart, label: "Revenue", href: "/dashboard/revenue" },
  { icon: Video, label: "Shoppable Video", href: "/dashboard/video" },
  { icon: BookOpen, label: "Story", href: "/dashboard/story" },
  { icon: ShoppingCart, label: "Live Commerce", href: "/dashboard/commerce" },
  {
    icon: List,
    label: "Playlist Manager",
    href: "/dashboard/playlists",
    subItems: [
      { label: "YouTube Playlists", href: "/dashboard/playlists/youtube" },
    ],
  },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Users, label: "Hire Influencer", href: "/dashboard/influencers" },
]

interface SidebarProps {
  onViewChange: (view: string) => void
}

export function Sidebar({ onViewChange }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleItemClick = (href: string) => {
    if (href === "/dashboard") {
      onViewChange("dashboard")
    } else {
      onViewChange("coming-soon")
    }
  }

  return (
    <div className='w-64 bg-[#1C1C24] border-r border-[#2E2E3A] h-screen overflow-y-auto'>
      <div className='p-5 border-b border-[#2E2E3A]'>
        <Link href='/dashboard' className='flex items-center space-x-2'>
          <span className='text-2xl font-bold text-white'>bleash</span>
        </Link>
      </div>

      {/* User Profile Section */}
      {session?.user && (
        <div className='px-5 py-4 border-b border-[#2E2E3A]'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || ""}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-white'>
                {session.user.name}
              </span>
              <span className='text-xs text-gray-400'>
                {session.user.email}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className='px-2 py-4'>
        {menuItems.map((item, index) =>
          item.subItems ? (
            <Accordion type='single' collapsible key={index}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className='py-2 px-4 hover:bg-[#2E2E3A]/50 rounded-lg text-white'>
                  <div className='flex items-center space-x-3'>
                    <item.icon className='h-5 w-5' />
                    <span>{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='pl-11 space-y-1'>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`block py-2 px-4 rounded-lg ${
                          pathname === subItem.href
                            ? "bg-[#2E2E3A] text-white"
                            : "text-gray-400 hover:bg-[#2E2E3A]/50 hover:text-white"
                        }`}
                        onClick={() => handleItemClick(subItem.href)}>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 py-2 px-4 rounded-lg ${
                pathname === item.href
                  ? "bg-[#2E2E3A] text-white"
                  : "text-gray-400 hover:bg-[#2E2E3A]/50 hover:text-white"
              }`}
              onClick={() => handleItemClick(item.href)}>
              <item.icon className='h-5 w-5' />
              <span>{item.label}</span>
            </Link>
          )
        )}
      </div>
    </div>
  )
}
