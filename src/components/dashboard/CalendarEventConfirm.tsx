import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Calendar, ChevronLeft, Copy as CopyIcon, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EVENT_DURATIONS, EVENT_LOCATIONS } from '@/lib/data'
import moment from 'moment-timezone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useAuth } from '@/context/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'

type StateType = {
  currentStart: Date
  currentEnd: Date
}

const OneoffSchema = z.object({
  eventName: z.string().min(1, {
    message: 'Event name is required',
  }),
  eventDuration: z.string(),
})

interface OneOffTypes {
  eventDuration: string
  eventName: string
  eventTitle?: string
  type?: string
  isOpen: boolean
  locationNote?: string
  locationType: string
}

function formatString(inputString: string) {
  if (inputString.includes(' ')) {
    return inputString.toLowerCase().replace(/\s+/g, '-')
  }
  return inputString
}
const CalendarEventConfirm = ({ title }: { title: string }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const state = location.state as StateType
  const { currentStart, currentEnd } = state
  console.log('currentStart:', currentStart)
  console.log('currentEnd:', currentEnd)
  const formattedStartTime = moment(currentStart).format('HH:mm')
  const formattedEndTime = moment(currentEnd).format('HH:mm')
  const formattedDate = moment(currentStart).format('dddd, MMMM D, YYYY')

  const formattedString = `${formattedStartTime}-${formattedEndTime}, ${formattedDate}`
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
  const [oneoffTitle, setOneoffTitle] = useState('')
  const [locationType, setLocationType] = useState('')
  const [locationNote, setLocationNote] = useState('')
  const [isOneoffSuccess, setIsOneoffSuccess] = useState(false)
  const currentTimezone = moment.tz.guess()
  const vite_baseUrl = import.meta.env.VITE_BASE_URL
  const api_url = import.meta.env.VITE_API_BASE_URL
  const form = useForm<OneOffTypes>({
    resolver: zodResolver(OneoffSchema),
    defaultValues: {
      eventDuration: '30',
      eventName: title,
    },
  })
  const copyUrl =
    title === 'meeting poll'
      ? `${vite_baseUrl}/m/${oneoffTitle}`
      : `${vite_baseUrl}/d/${oneoffTitle}`
  useEffect(() => {
    if (isOneoffSuccess && !isCopyDialogOpen) {
      navigate('/dashboard/one-off')
    }
  }, [isOneoffSuccess, isCopyDialogOpen, navigate])

  const handleClick = () => {
    setOpen(false)
    if (locationType === '') {
      setLocationType('zoom')
    }
    // setLocation('')
    setError('')
  }
  const locationLabel: string | undefined = EVENT_LOCATIONS.find(
    (loc) => loc.value === locationType
  )?.label

  const onSubmit = async (values: z.infer<typeof OneoffSchema>) => {
    console.log('values:', values)
    setError('')
    const eventTitle = formatString(values.eventName)
    if (locationType === '') {
      setError('Please select a location')
      return
    }
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch(
        `${api_url}/one-off${title === 'meeting poll' ? '/meeting-poll' : ''}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            event: {
              ...values,
              eventTitle,
              locationType,
              locationNote,
              start: formattedStartTime,
              end: formattedEndTime,
              date: formattedDate,
              timezone: currentTimezone,
            },
          }),
        }
      )
      const data = await res.json()

      if (!data.success) {
        console.log('error:', data.message)
      }
      setOneoffTitle(data.data.eventTitle)
      setIsOneoffSuccess(true)
      setIsCopyDialogOpen(true)
      form.reset()
      setLocationType('')
      setLocationNote('')
    } catch (e) {
      throw new Error('An unknown error occurred')
    }
  }
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
    <div className="size-full flex flex-col">
      <div className="flex items-center gap-3">
        <Button
          variant="link"
          className="font-semibold text-left px-3"
          onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" /> Back
        </Button>
        <p className=" text-lg font-semibold">New {title}</p>
      </div>

      <div className="h-px w-full bg-zinc-300" />
      <div className=" h-full flex items-center justify-center px-3  py-3 ">
        <div className="flex flex-row w-full max-w-[700px] shadow-lg rounded-lg ring-1 ring-zinc-200 bg-white">
          <div className=" w-1/3 hidden sm:block px-3 py-6">
            <h1 className=" font-semibold ">Selections</h1>
            <div className="text-sm  mt-3">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <p>{user?.username}</p>
              </div>
              <p className=" font-semibold mt-3 mb-1">Available Time</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <p>{formattedString}</p>
              </div>
            </div>
          </div>
          <div className=" border-l-[1px] border-zinc-300 flex-grow p-6">
            <h1 className="font-semibold pb-3">Event Details</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 relative">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div
                    className={`${
                      error ? 'text-sm text-destructive' : 'text-sm text-black '
                    }`}>
                    Location
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-zinc-500 w-full justify-start pl-3 mt-3">
                        {locationLabel || 'Select location'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-0 py-6">
                      <DialogHeader className="px-6">
                        <DialogTitle>Location</DialogTitle>
                      </DialogHeader>
                      <div className="w-full px-0 bg-zinc-300 h-px" />
                      <div className="flex flex-col gap-3 py-4 px-6">
                        <Label htmlFor="location">Your Location</Label>
                        <div>
                          <Select
                            defaultValue="zoom"
                            onValueChange={(e) => setLocationType(e)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_LOCATIONS.map((location) => (
                                <SelectItem
                                  key={location.value}
                                  value={location.value}>
                                  <div className="flex items-center gap-3">
                                    <location.icon className="w-6 h-6" />
                                    {location.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Label>Location details</Label>
                        <Input
                          value={locationNote}
                          onChange={(e) => {
                            setLocationNote(e.target.value)
                          }}
                        />
                      </div>
                      <DialogFooter className="px-6">
                        <Button onClick={handleClick}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </div>
                <FormField
                  control={form.control}
                  name="eventDuration"
                  render={({ field }) => (
                    <FormItem className="space-y-3 ">
                      <FormLabel>Event Time*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-1">
                          {EVENT_DURATIONS.map((duration) => (
                            <FormItem
                              key={duration.value}
                              className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={duration.value}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover py-3 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-zinc-400 [&:has([data-state=checked])]:bg-primary ">
                                {duration.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-1 py-3 justify-center sm:gap-2">
                  <Dialog
                    open={isCopyDialogOpen}
                    onOpenChange={setIsCopyDialogOpen}>
                    <Button type="submit" className="w-28 text-xs sm:text-sm">
                      Share Link
                    </Button>

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
                          <Input id="link" defaultValue={copyUrl} readOnly />
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
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarEventConfirm
