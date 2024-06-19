import CalendMeBadge from '@/components/Badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar, Check, Earth, User, Mail } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { Link, useLocation } from 'react-router-dom'
interface StateType {
  event?: EventTypes
  timezone: string
  meeting: MeetingTypes
}

const ScheduleSuccessPage = () => {
  const location = useLocation()
  const state = location.state as StateType
  const { event, meeting, timezone } = state
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL

  const handleGoogleLogin = () => {
    window.location.href = `${api_baseUrl}/auth/google`
  }
  return (
    <div className="min-h-screen w-full  flex  sm:items-center sm:justify-center py-3 px-3 md:py-6 md:px-24 lg:px-36 xl:px-48 bg-muted/40 ">
      <div className="bg-white relative w-full max-w-[800px]   shadow-xl rounded-xl ring-1 ring-zinc-200/50 flex  items-center justify-center py-6 ">
        <CalendMeBadge />
        <div className="flex flex-col space-y-6 ">
          <div>
            <div className="flex items-center justify-center gap-4">
              <Check className="w-6 h-6 rounded-full bg-green-600 text-white" />
              <h1 className=" text-xl font-semibold">You are scheduled</h1>
            </div>
            <p className=" text-sm text-center text-zinc-500 pt-3">
              A calendar invitation has been sent to your email address.
            </p>
          </div>
          <div className="w-[500px] ring-1 ring-zinc-300 rounded-lg p-3 flex flex-col space-y-3">
            <p className="font-semibold">{event?.eventName}</p>
            <div className=" flex gap-2 text-zinc-500">
              <User className="w-6 h-6 inline-block" />
              <p>{event?.hostname}</p>
            </div>
            <div className=" flex gap-2 text-zinc-500">
              <Calendar className="w-6 h-6" />
              <p>
                {meeting.meetingStart}-{meeting.meetingEnd},{' '}
                {meeting.meetingDate}
              </p>
            </div>
            <div className=" flex gap-2 text-zinc-500">
              <Earth className="w-6 h-6" />
              <p>{timezone}</p>
            </div>
          </div>
          <div className=" w-full h-px bg-zinc-300" />
          <div>
            <p className="text-sm text-zinc-700 font-semibold pb-2">
              Schedule your own meetings with Calendly for free.
            </p>
            <p className="text-sm text-zinc-600">
              Eliminate the back-and-forth emails for finding time.
            </p>
          </div>
          <div className="flex gap-3 w-full pb-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-5 w-5 " />
              Sign up with Google
            </Button>
            <Link
              to="/auth/login"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  className: 'w-full flex items-center justify-center gap-3',
                })
              )}>
              <Mail className="mr-2 h-5 w-5 " />
              Sign Up with Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleSuccessPage
