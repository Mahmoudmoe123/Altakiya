"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/components/auth/user-provider"

export default function Header() {
  const { user, profile, signOut } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-lg font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/campaigns" className="text-lg font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Explore Campaigns
                </Link>
                <Link href="/campaigns/create" className="text-lg font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Start a Campaign
                </Link>
                <Link href="/about" className="text-lg font-semibold" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-lg font-semibold" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">CommunityKitchen</span>
          </Link>
        </div>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/campaigns" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Explore Campaigns</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/campaigns/create" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Start a Campaign</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-amber-500 to-amber-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/about"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Our Mission</div>
                        <p className="text-sm leading-tight text-white/90">
                          Learn how we're helping community kitchens make a difference
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/about/team" title="Our Team">
                    Meet the people behind the platform
                  </ListItem>
                  <ListItem href="/about/impact" title="Impact Stories">
                    See how community kitchens are changing lives
                  </ListItem>
                  <ListItem href="/about/contact" title="Contact Us">
                    Get in touch with our support team
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name || "User"} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.full_name || "My Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/campaigns">My Campaigns</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/donations">My Donations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
