"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, CreditCard, DollarSign, LayoutDashboard, LogOut, Settings, Utensils, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/components/auth/user-provider"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: <Utensils className="mr-2 h-4 w-4" />,
  },
  {
    title: "Donations",
    href: "/dashboard/donations",
    icon: <DollarSign className="mr-2 h-4 w-4" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: <CreditCard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useUser()

  return (
    <div className="hidden border-r bg-gray-50/40 lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg font-bold">CommunityKitchen</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {sidebarNavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === item.href && "bg-gray-100 text-gray-900",
                  )}
                >
                  {item.icon}
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-2 rounded-lg border bg-background p-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name || "User"} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile?.full_name || "User"}</span>
              <span className="text-xs text-gray-500">{profile?.username || "user"}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
