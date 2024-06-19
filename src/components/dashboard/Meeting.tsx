import {
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Trash2,
  NotebookPen,
  PencilLine,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  addOrUpdateMeetingNotes,
  createNotification,
  getEventByEventId,
  getMeetingByMeetingId,
} from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { useNavigate } from 'react-router-dom'
const Meeting = ({
  meetingId,
  status,
}: {
  meetingId: string
  status: string
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [event, setEvent] = useState<EventTypes | undefined>(undefined)
  const [isNotesDailogOpen, setIsNotesDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const reasonCancelRef = useRef<HTMLTextAreaElement>(null)
  const [meeting, setMeeting] = useState<MeetingTypes | undefined>(undefined)
  const navigate = useNavigate()
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const getMeeting = async () => {
      const res = await getMeetingByMeetingId(meetingId)
      if (res.success) {
        setMeeting(res.meeting)
      }
    }
    getMeeting()
  }, [noteRef.current]) // eslint-disable-line

  const handleClick = async () => {
    setIsDetailsOpen((prev) => !prev)
    try {
      const resEvent = await getEventByEventId(meeting?.event, meeting?.variant)
      if (resEvent.success) {
        setEvent(resEvent.event)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdate = async () => {
    setIsNotesDialogOpen(false)
    const resNotes = await addOrUpdateMeetingNotes(
      meeting?._id,
      noteRef.current?.value
    )
    if (resNotes.success) {
      console.log(resNotes)
    }
  }
  const handleReschedule = () => {
    const stateObject = {
      event,
      meeting,
    }
    navigate(
      `/${
        meeting?.variant === 'oneoff' ? 'd/reschedule' : 'reschedule'
      }/${meetingId}`,
      { state: stateObject }
    )
  }

  const handleCancel = async () => {
    setIsCancelDialogOpen(false)
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(
      `${api_baseUrl}/user-meeting/meeting/${meetingId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    const data = await res.json()
    if (data.success) {
      const message = `Your meeting with ${meeting?.name} has been cancelled. Reason: ${reasonCancelRef.current?.value}`
      const title = 'Meeting Cancelled'
      const userId = meeting?.user || ''
      const res = await createNotification(message, title, userId)
      console.log(res)
      if (res.success) {
        console.log('notification sent')
        window.location.reload()
      } else {
        console.log('error')
        navigate('/error')
      }
    } else {
      console.log('error')
    }
  }
  return (
    <>
      <div className="grid sm:grid-cols-4 bg-white p-3 px-6">
        <div className="flex gap-2 items-center py-2 lg:py-0">
          <div className="flex-none w-4 h-4 bg-destructive rounded-full" />
          <p className="text-sm">
            {meeting?.meetingStart} - {meeting?.meetingEnd}
          </p>
        </div>
        <div
          className=" col-span-3 flex justify-between items-center cursor-pointer px-3"
          onClick={handleClick}>
          <div className="">
            <div className="font-bold">{meeting?.name}</div>
            <div className="text-sm text-gray-600">{meeting?.eventName}</div>
          </div>

          <div className="text-sm flex">
            <p> See Details</p>

            {isDetailsOpen ? (
              <ChevronUp className="w-4 h-4 inline-block" />
            ) : (
              <ChevronDown className="w-4 h-4 inline-block" />
            )}
          </div>
        </div>
      </div>
      {isDetailsOpen && (
        <div className="grid sm:grid-cols-4 bg-accent px-3">
          <div className="pt-2">
            {status === 'upcoming' && (
              <>
                <div className="w-full pr-3 flex sm:flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg text-gray-600 justify-center"
                    onClick={handleReschedule}>
                    <RefreshCcw className=" hidden lg:flex w-4 h-4 mr-3" />
                    Reschedule
                  </Button>
                  <Dialog
                    open={isCancelDialogOpen}
                    onOpenChange={setIsCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-center rounded-lg mb-3 text-gray-600 ">
                        <Trash2 className="hidden lg:flex  w-4 h-4 mr-3" />
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Cancel Event</DialogTitle>
                      </DialogHeader>
                      <div className="w-full h-px bg-zinc-300" />
                      <div className="  flex flex-col space-y-3">
                        <div className=" flex flex-col items-center space-y-1 text-sm">
                          <p>{meeting?.eventName}</p>
                          <p className="font-semibold">{meeting?.name}</p>
                          <p>
                            {meeting?.meetingStart}-{meeting?.meetingEnd}
                          </p>
                        </div>
                        <p className="text-sm text-zinc-500">
                          Please confirm that you would like to cancel this
                          event. A cancellation email will also go out to the
                          invitee.
                        </p>
                        <Textarea
                          ref={reasonCancelRef}
                          placeholder="Reason for cancellation"
                          className="w-full mt-3"
                        />
                      </div>
                      <DialogFooter className="grid grid-cols-2">
                        <Button
                          variant="outline"
                          className="rounded-full ring-1 ring-zinc-600"
                          onClick={() => setIsCancelDialogOpen(false)}>
                          No, don't cancel
                        </Button>
                        <Button className="rounded-full" onClick={handleCancel}>
                          Yes,cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>

          <div className="col-span-3 flex flex-col space-y-3 py-3 px-3 text-sm">
            <div>
              <h2 className="font-semibold">Email</h2>
              <p>{meeting?.email}</p>
            </div>
            <div>
              <h2 className="font-semibold">Location</h2>
              <p>{event?.locationType}</p>
              {event?.locationNote && <p>{event.locationNote}</p>}
            </div>
            <div>
              <h2 className="font-semibold">INVITEE TIME ZONE</h2>
              <p>{meeting?.timezone}</p>
            </div>
            {meeting?.message && (
              <div>
                <h2 className="font-semibold">Message</h2>
                <p>{meeting?.message}</p>
              </div>
            )}
            <Dialog
              open={isNotesDailogOpen}
              onOpenChange={setIsNotesDialogOpen}>
              {meeting?.notes ? (
                <div>
                  <h2 className="font-semibold">Meeting Notes</h2>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <p>{meeting?.notes}</p>
                    <DialogTrigger asChild>
                      <PencilLine className="w-4 h-4 hover:w-5 hover:h-5 " />
                    </DialogTrigger>
                  </div>
                </div>
              ) : (
                <DialogTrigger asChild>
                  <div className="flex items-center gap-1 hover:font-semibold cursor-pointer">
                    <NotebookPen className="w-4 h-4 " />
                    <p>Add meeting notes</p>
                  </div>
                </DialogTrigger>
              )}

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Meeting Notes</DialogTitle>
                </DialogHeader>
                <div className="w-full h-px bg-zinc-300" />
                <div className="">
                  <Label className="">Your Notes</Label>
                  <Textarea
                    defaultValue={`${meeting?.notes ? meeting?.notes : ''}`}
                    ref={noteRef}
                    className="w-full mt-3"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsNotesDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  )
}

export default Meeting
