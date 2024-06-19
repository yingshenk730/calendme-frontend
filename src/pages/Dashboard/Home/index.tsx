import { useState } from 'react'
import EventTypePage from './EventType'
import ScheduledEventPage from './ScheduledEvent'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const DashboardHomePage = () => {
  const [active, setActive] = useState('eventTypes')
  return (
    <div className=" relative size-full  py-4 flex flex-col">
      <Link
        to="/dashboard/create-event"
        className={cn(
          buttonVariants({
            variant: 'default',
            className: 'absolute right-3 top-6 rounded-full px-6',
          })
        )}>
        <Plus className="w-4 h-4" />
        Create Event
      </Link>
      <h1 className=" text-lg px-3 pb-3 font-semibold">My Schedule</h1>
      <div className="flex gap-3">
        <div
          onClick={() => setActive('eventTypes')}
          className={`p-3 pb-2 cursor-pointer ${
            active === 'eventTypes'
              ? 'border-b-4 border-b-primary'
              : 'text-gray'
          }`}>
          Event Types
        </div>
        <div
          onClick={() => setActive('scheduledEvents')}
          className={`p-3 pb-2 cursor-pointer ${
            active === 'scheduledEvents'
              ? ' border-b-4 border-b-primary'
              : 'text-gray'
          }`}>
          Scheduled Events
        </div>
      </div>
      <div className="h-px w-full bg-zinc-300" />

      <div className=" flex-grow  ">
        {active === 'eventTypes' ? <EventTypePage /> : <ScheduledEventPage />}
      </div>
    </div>
  )
}

export default DashboardHomePage
