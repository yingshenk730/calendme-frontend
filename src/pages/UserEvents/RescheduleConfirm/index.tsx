import CalendMeBadge from '@/components/Badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  ChevronLeft,
  Clock4,
  Earth,
  Calendar as CalendarIcon,
} from 'lucide-react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import moment from 'moment-timezone'
import { useEffect, useState } from 'react'
import { getMeetingByMeetingId } from '@/lib/utils'

const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' }),
  message: z.string(),
})
interface StateType {
  event: EventTypes | OneoffEventTypes
  meeting: MeetingTypes
  timezone: string
}

const RescheduleConfirmPage = () => {
  const { meetingId, date } = useParams()
  const [meeting, setMeeting] = useState<MeetingTypes | undefined>(undefined)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const state = location.state as StateType
  const { event, timezone } = state
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const getMeeting = async () => {
      const res = await getMeetingByMeetingId(meetingId)
      console.log('res:', res)
      if (res.success) {
        setMeeting(res.meeting)
        form.setValue('email', res.meeting.email)
      }
    }
    getMeeting()
  }, []) // eslint-disable-line
  const meetingTime = searchParams.get('time')
  const startTime = moment.tz(
    `${date} ${meetingTime}`,
    'YYYY-MM-DD HH:mm',
    timezone
  )
  const endTime = moment(startTime).add(
    parseInt(event?.eventDuration ?? '0', 10),
    'minutes'
  )

  const formattedStartTime = startTime.format('HH:mm')
  const formattedEndTime = endTime.format('HH:mm')
  const formattedDate = startTime.format('dddd, MMMM D, YYYY')

  const finalOutput = `${formattedStartTime}-${formattedEndTime}, ${formattedDate}`

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: meeting?.email,
      message: '',
    },
  })
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('data:', data)
    try {
      const res = await fetch(`${api_baseUrl}/user-meeting/${meetingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting: {
            ...data,
            meetingStart: formattedStartTime,
            meetingEnd: formattedEndTime,
            meetingDate: formattedDate,
            timezone,
          },
        }),
      })
      const resData = await res.json()
      console.log('resData:', resData)
      if (resData.success && resData.meeting) {
        form.reset()
        navigate('/dashboard')
      } else {
        navigate('/error')
      }
    } catch (e) {
      console.log(e)
      throw new Error('Failed to schedule meeting')
    }
  }

  return (
    <div className="min-h-screen w-full  flex  sm:items-center sm:justify-center py-3 px-3 md:py-6 md:px-24 lg:px-36 xl:px-48 bg-muted/40 ">
      <div className="bg-white relative w-full max-w-[800px] h-[450px]  shadow-xl rounded-xl ring-1 ring-zinc-200/50 flex flex-col sm:grid  sm:grid-cols-3 ">
        <CalendMeBadge />

        <div className=" relative flex flex-col items-center justify-center sm:flex-none sm:items-start sm:justify-start sm:pt-20 border-b-[1px] sm:border-b-0 sm:border-r-[1px] border-zinc-300 p-6 ">
          <div className=" absolute top-6 left-0">
            <Button
              variant="link"
              className="font-semibold text-left px-3"
              onClick={() => navigate(-1)}>
              <ChevronLeft className="w-6 h-6" /> Back
            </Button>
          </div>
          <p>{event?.hostname}</p>
          <h1 className=" text-lg font-semibold pb-3">{event?.eventName}</h1>
          <div className="flex flex-col space-y-2 pt-2">
            <div className="flex items-center gap-2 text-zinc-600">
              <Clock4 className="w-4 h-4" />
              <p className="text-sm ">{event?.eventDuration} Mins</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <div className="w-4">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-sm ">{finalOutput}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Earth className="w-4 h-4" />
              <p className="text-sm ">{timezone}</p>
            </div>
          </div>
          <div className="text-sm pt-6">
            <p className=" text-zinc-700 font-semibold pb-2">
              Former Time ({meeting?.name})
            </p>
            <div className="flex items-center gap-2 text-zinc-600 pb-2">
              <div className="w-4">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <p className="line-through">
                {meeting?.meetingStart}-{meeting?.meetingEnd},
                {meeting?.meetingDate}
              </p>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Earth className="w-4 h-4" />
              <p className="line-through">{meeting?.timezone}</p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 p-6  flex w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full max-w-[400px]">
              <h1 className=" font-semibold text-lg">Enter Details</h1>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for change</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs">
                By proceeding, you confirm that you have read and agree to
                <span className="text-primary font-semibold hover:underline cursor-pointer">
                  {' '}
                  Calendly's Terms
                </span>{' '}
                of Use and{' '}
                <span className="text-primary font-semibold hover:underline cursor-pointer">
                  Privacy Notice
                </span>{' '}
                .
              </p>
              <Button type="submit" className="rounded-lg">
                Update Event
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RescheduleConfirmPage
