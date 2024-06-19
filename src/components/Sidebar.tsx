import { LINKS } from '@/lib/data'
import { Link, useLocation } from 'react-router-dom'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/useAuth'
import { ScrollArea } from './ui/scroll-area'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  // console.log('location:', location)
  return (
    <div className="flex h-full max-h-screen flex-col gap-2  ">
      <div className=" flex h-14 items-center px-6">
        <Link
          to="/dashboard"
          className=" text-primary text-2xl font-semibold cursor-pointer">
          Calend<span className=" text-secondary">Me</span>
        </Link>
      </div>
      <ScrollArea className="flex flex-col h-[420px]  ">
        <div className="flex flex-col items-center justify-center py-3">
          <div className="flex items-center justify-center w-12 h-12 ">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              'X'
            )}
          </div>
          {user && <p className="pb-3">{user?.username}</p>}
          <p className="hover:font-semibold cursor-pointer">free plan</p>
        </div>
        <nav className="grid gap-3 items-start text-sm font-medium p-4">
          {LINKS.map((link) => (
            <Link
              to={link.path}
              key={link.title}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className: `flex items-center justify-start gap-6 rounded-lg px-3 py-2 text-muted-foreground transition-all ${
                    location.pathname === link.path
                      ? 'bg-primary text-white hover:bg-primary hover:text-white'
                      : ''
                  }`,
                })
              )}>
              <link.icon className="h-4 w-4" />
              {link.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 ">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-6 rounded-lg px-3 py-2 text-muted-foreground transition-all"
          onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
