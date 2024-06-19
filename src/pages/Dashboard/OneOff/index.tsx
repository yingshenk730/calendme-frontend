import Meeting from '@/components/dashboard/Meeting'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  cn,
  getMeetingsByToken,
  getOpenOneoffEventsByToken,
  groupMeetingsByDate,
  groupOneoffEventsByDate,
} from '@/lib/utils'
import { Copy as CopyIcon, ExternalLink, MapPin, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const OneOffPage = () => {
  const [active, setActive] = useState('upcoming')
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingTypes[]>([])
  const [pastMeetings, setPastMeetings] = useState<MeetingTypes[]>([])
  const [openEvents, setOpenEvents] = useState<OneoffEventTypes[]>([])
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
  const upcomingGroupedMeetings = groupMeetingsByDate(upcomingMeetings)
  const pastGroupedMeetings = groupMeetingsByDate(pastMeetings)
  const openGroupedEvents = groupOneoffEventsByDate(openEvents)
  const vite_baseUrl = import.meta.env.VITE_BASE_URL

  const { toast } = useToast()
  useEffect(() => {
    const getOpenEvents = async () => {
      const res = await getOpenOneoffEventsByToken()
      setOpenEvents(res.openOneoffEvents)
    }
    getOpenEvents()
  }, [])

  useEffect(() => {
    const getMeetings = async () => {
      const res = await getMeetingsByToken()
      if (res.success) {
        const now = new Date()
        const upcoming: MeetingTypes[] = []
        const past: MeetingTypes[] = []
        res.meetings.forEach((meeting: MeetingTypes) => {
          if (meeting.variant === 'oneoff') {
            const meetingDateTime = new Date(
              `${meeting.meetingDate} ${meeting.meetingStart}`
            )
            if (meetingDateTime > now) {
              upcoming.push(meeting)
            } else {
              past.push(meeting)
            }
          }
        })
        setUpcomingMeetings(upcoming)
        setPastMeetings(past)
      } else {
        console.error('Failed to get meetings:', res.error)
      }
    }
    getMeetings()
  }, [])

  const handleCopy = async () => {
    const link = document.getElementById('link') as HTMLInputElement
    if (link) {
      await navigator.clipboard.writeText(link.value)
      toast({
        title: 'Link copied to clipboard!',
      })
    }
    setIsCopyDialogOpen(false)
  }
  return (
    <div className=" relative size-full  py-4 flex flex-col">
      <Link
        to="/dashboard/one-off/new"
        className={cn(
          buttonVariants({
            variant: 'default',
            className: 'absolute right-3 top-6 rounded-full px-6',
          })
        )}>
        <Plus className="w-4 h-4 mr-2" />
        Create New
      </Link>
      <h1 className=" text-lg px-3 py-4 font-semibold">My Schedule</h1>
      <div className="flex-grow gap-3">
        <div className="bg-white ring-1 ring-zinc-200 size-full rounded-lg shadow-md">
          <div className="flex gap-3">
            <div
              onClick={() => setActive('upcoming')}
              className={`p-3 pb-2 cursor-pointer ${
                active === 'upcoming'
                  ? 'border-b-2 border-b-primary'
                  : 'text-gray'
              }`}>
              Upcoming
            </div>
            <div
              onClick={() => setActive('pending')}
              className={`p-3 pb-2 cursor-pointer ${
                active === 'pending'
                  ? 'border-b-2 border-b-primary'
                  : 'text-gray'
              }`}>
              Pending
            </div>
            <div
              onClick={() => setActive('past')}
              className={`p-3 pb-2 cursor-pointer ${
                active === 'past' ? ' border-b-2 border-b-primary' : 'text-gray'
              }`}>
              Past
            </div>
          </div>
          <div className="h-px w-full bg-zinc-300" />

          <div className="pb-3">
            {active === 'upcoming' ? (
              <div className="w-full">
                {Object.entries(upcomingGroupedMeetings).map(
                  ([date, dayMeetings]) => (
                    <div key={date} className=" ">
                      <h2 className=" text-base py-3 bg-accent px-3">{date}</h2>
                      <div className="flex flex-col ">
                        {dayMeetings.map((meeting, index) => (
                          <Meeting
                            key={index}
                            meetingId={meeting._id}
                            status="upcoming"
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : active === 'pending' ? (
              <div className="w-full">
                {Object.entries(openGroupedEvents).map(([date, dayEvents]) => (
                  <div key={date} className=" ">
                    <h2 className=" text-base py-3 bg-accent px-3">{date}</h2>
                    <div className="flex flex-col gap-2 ">
                      {dayEvents.map((event, index) => (
                        <p key={index}>
                          <div className="  p-3 text-sm grid lg:grid-cols-4 border-b-[1px] border-zinc-400">
                            <div>
                              <div className="flex  gap-2 items-center py-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <p className="cols-span-1">
                                  {event.start}-{event.end}
                                </p>
                              </div>
                            </div>
                            <div className=" col-span-3 flex justify-between">
                              <div className="p-3 flex flex-col gap-2">
                                <p>{event.eventName}</p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.locationType}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Link
                                  to={`/d/${event.eventTitle}`}
                                  className={cn(
                                    buttonVariants({
                                      variant: 'ghost',
                                      className:
                                        'flex items-center gap-1 justify-start',
                                    })
                                  )}>
                                  <ExternalLink className="w-5 h-5" />
                                  <p>View link page</p>
                                </Link>
                                <Dialog
                                  open={isCopyDialogOpen}
                                  onOpenChange={setIsCopyDialogOpen}>
                                  <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 justify-start ">
                                    <CopyIcon className="w-5 h-5" />
                                    <p>Copy Link</p>
                                  </Button>

                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Share link</DialogTitle>
                                      <DialogDescription>
                                        Copy and paste your scheduling link into
                                        a message.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                      <div className="grid flex-1 gap-2">
                                        <Label
                                          htmlFor="link"
                                          className="sr-only">
                                          Link
                                        </Label>
                                        <Input
                                          id="link"
                                          defaultValue={`${vite_baseUrl}/d/${event.eventTitle}`}
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
                              </div>
                            </div>
                          </div>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full">
                {Object.entries(pastGroupedMeetings).map(
                  ([date, dayMeetings]) => (
                    <div key={date} className=" ">
                      <h2 className=" text-base py-3 bg-accent px-3">{date}</h2>
                      <div className="flex flex-col ">
                        {dayMeetings.map((meeting, index) => (
                          <Meeting
                            key={index}
                            meetingId={meeting._id}
                            status="past"
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OneOffPage
