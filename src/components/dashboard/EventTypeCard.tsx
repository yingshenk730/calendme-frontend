import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { getUserUrlByUserId } from '@/lib/utils'
import {
  Settings,
  Copy as CopyIcon,
  Link as LinkIcon,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
const EventTypeCard = ({
  event,
  setEventTypes,
}: {
  event: EventTypes
  setEventTypes: React.Dispatch<React.SetStateAction<EventTypes[]>>
}) => {
  const [open, setOpen] = useState(event.isOpen)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userUrl, setUserUrl] = useState('')
  const navigate = useNavigate()
  const { toast } = useToast()
  const vite_baseUrl = import.meta.env.VITE_BASE_URL
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const getUserUrl = async () => {
      try {
        const data = await getUserUrlByUserId(event.user)
        if (data) {
          setUserUrl(data.userUrl.url)
        } else {
          setUserUrl('')
        }
      } catch (error) {
        console.error('Failed to check URL:', error)
      }
    }
    getUserUrl()
  }, [event])

  const handleSwitch = async (newOpenStatus: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    setOpen(newOpenStatus)
    await fetch(`${api_baseUrl}/api/user-event/status/${event._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isOpen: newOpenStatus }),
    })
  }
  const handleCopy = async () => {
    const link = document.getElementById('link') as HTMLInputElement
    if (link) {
      await navigator.clipboard.writeText(link.value)
      toast({
        title: 'Link copied to clipboard!',
      })
    }
  }

  const handleDelete = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    try {
      const res = await fetch(`${api_baseUrl}/api/user-event/${event._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: 'Event deleted successfully!',
          variant: 'destructive',
        })
      }
      setEventTypes((prevEvents) =>
        prevEvents.filter((e) => e._id !== event._id)
      )
    } catch (e) {
      console.error('Failed to delete event:', e)
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div
        className={`w-2 rounded-l-lg ${
          open ? 'bg-destructive' : 'bg-zinc-500'
        }`}
      />
      <Card className="w-full relative rounded-none rounded-r-lg min-w-[320px] max-w-[420px] ">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between">
            <p>{event.eventName}</p>
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}>
                  <Settings className=" w-6 h-6 top-4 right-6" />
                  {isDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 inline-block" />
                  ) : (
                    <ChevronDown className="w-4 h-4 inline-block" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-10">
                <DropdownMenuItem
                  className=" cursor-pointer"
                  onClick={() => {
                    navigate(`/dashboard/edit/${event._id}`)
                  }}>
                  <Pencil className="w-4 h-4 inline-block mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className=" cursor-pointer"
                  onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 inline-block mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription>{event.locationType}</CardDescription>
        </CardHeader>

        <CardContent className="pb-3 mt-6">
          <div className=" w-full flex justify-between">
            <div
              className={`flex items-center gap-1 text-sm  font-medium ${
                open
                  ? 'text-primary cursor-pointer'
                  : 'text-zinc-500 select-none'
              }`}>
              <LinkIcon className=" w-4 h-4" />
              {open ? (
                <Link to={`/${userUrl}/${event.eventTitle}`}>
                  View booking link
                </Link>
              ) : (
                <div>View booking link</div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={open} onCheckedChange={handleSwitch} />
            </div>
          </div>
          <div className="w-full h-px bg-zinc-300 mt-3 mb-0" />
        </CardContent>
        <CardFooter className="flex justify-between pb-3">
          <div className={`text-sm ${open ? 'text-primary' : 'text-zinc-500'}`}>
            {event.eventDuration} Mins
          </div>
          {open ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-lg border-primary text-primary ">
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Copy and paste your scheduling link into a message.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      defaultValue={`${vite_baseUrl}/${userUrl}/${event.eventTitle}`}
                      readOnly
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="px-3"
                    onClick={handleCopy}>
                    <span className="sr-only">Copy</span>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="h-10 px-4 py-2 rounded-lg border  border-zinc-500 text-zinc-500">
              Turn On
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default EventTypeCard
