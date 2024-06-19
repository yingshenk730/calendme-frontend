import { Navigate, Outlet } from 'react-router-dom'
import { Bell, Menu, ChevronDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/context/useAuth'

const DashboardPage = () => {
  const { user, logout } = useAuth()

  if (user?.isNewUser) return <Navigate to="/onboarding" />

  return (
    <div className="grid h-screen w-full md:grid-cols-[280px_1fr] bg-muted/40">
      <div className="hidden md:block px-2 py-3 max-h-screen ">
        <div className="size-full rounded-lg shadow-lg bg-white">
          <Sidebar />
        </div>
      </div>
      <div className="flex flex-col  max-h-screen  overflow-y-auto px-6 lg:px-9">
        <nav className="sticky z-[100] inset-x-0 top-0 py-3 w-full  backdrop-blur-lg flex items-center justify-between px-3 gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-1/2">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 ">
            <div>
              Hello,{' '}
              {user && <span className=" font-semibold">{user.username}</span>}
            </div>
          </div>
          <div className=" w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-4 h-4 rounded-full" />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ChevronDown className="h-5 w-5 cursor-pointer" />
                  <span className="sr-only">Toggle user menu</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div>
          <div className=" bg-zinc-300 h-px" />
        </div>

        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
