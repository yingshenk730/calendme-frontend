import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getMeetingsByToken, getUserAvailability } from '@/lib/utils'
import moment from 'moment-timezone'
import { useAuth } from '@/context/useAuth'
import { dayMappings } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

interface Event {
  allDay?: boolean
  id?: string
  start: Date
  end: Date
  title?: string
  desc?: string
}
const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

const CalendarEventSelection = ({ navigateUrl }: { navigateUrl: string }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [existingEvents, setExistingEvents] = useState<Event[]>([])
  const [eventsData, setEventsData] = useState<Event[]>([])
  const [minTime, setMinTime] = useState<Date | undefined>(undefined)
  const [maxTime, setMaxTime] = useState<Date | undefined>(undefined)
  const [availableDays, setAvailableDays] = useState<number[]>([])
  const [currentStart, setCurrentStart] = useState<Date | undefined>(undefined)
  const [currentEnd, setCurrentEnd] = useState<Date | undefined>(undefined)
  useEffect(() => {
    const getAvailability = async () => {
      const res = await getUserAvailability(user?._id)
      if (res.success) {
        setMinTime(parseTime(res.availability?.startTime ?? ''))
        setMaxTime(parseTime(res.availability?.endTime ?? ''))
        const days = res.availability?.days ?? []
        const dayNumbers = days.map(
          (day: string) => dayMappings[day as keyof DayMappings]
        )
        setAvailableDays(dayNumbers)
      } else {
        console.error('Failed to get availability:', res.error)
      }
    }
    getAvailability()
  }, []) // eslint-disable-line

  useEffect(() => {
    const getEvents = async () => {
      const res = await getMeetingsByToken()
      if (res.success) {
        const newEvents = res.meetings.map((meeting: MeetingTypes) => {
          const dateParts = meeting.meetingDate
            .split(',')
            .map((part) => part.trim())
          const datePart = `${dateParts[1]}, ${dateParts[2]}`
          const dateTimeStart = moment
            .tz(
              `${datePart} ${meeting.meetingStart}`,
              'MMMM D, YYYY HH:mm',
              meeting.timezone
            )
            .toDate()

          const dateTimeEnd = moment
            .tz(
              `${datePart} ${meeting.meetingEnd}`,
              'MMMM D, YYYY HH:mm',
              meeting.timezone
            )
            .toDate()
          return {
            title: meeting.eventName,
            start: dateTimeStart,
            end: dateTimeEnd,
            id: meeting._id,
            desc: meeting.message,
          }
        })
        setExistingEvents(newEvents)
        setEventsData(newEvents)
      } else {
        console.error('Failed to get meetings:', res.error)
      }
    }
    getEvents()
  }, [])

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setCurrentStart(start)
    setCurrentEnd(end)

    setEventsData([
      ...eventsData,
      {
        id: uuid() as string,
        start,
        end,
        title: '',
      },
    ])
  }
  const handleEventSelect = (event: Event) => {
    if (existingEvents.some((e) => e.id === event.id)) {
      return
    }

    const filteredEvents = eventsData.filter((e) => e.id !== event.id)
    setEventsData(filteredEvents)
    setCurrentStart(undefined)
    setCurrentEnd(undefined)
  }
  const handleNext = () => {
    const stateObject = {
      currentStart,
      currentEnd,
    }
    if (!currentStart || !currentEnd) return
    navigate(navigateUrl, { state: stateObject })
  }
  const dayPropGetter = (date: Date): React.HTMLAttributes<HTMLDivElement> => {
    const day = date.getDay()
    if (!availableDays.includes(day)) {
      // If it's Wednesday
      return {
        style: {
          backgroundColor: 'rgb(228 228 231)',
          backgroundImage:
            'repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(255, 255, 255, 0.2) 1px, rgba(255, 255, 255, 0.2) 15px)',
          pointerEvents: 'none', // Ensure 'none' is correctly typed
        },
      }
    }
    return {}
  }
  return (
    <div className="relative p-6 text-xs h-full grid">
      <Calendar
        views={['day', 'week', 'month']}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="week"
        events={eventsData}
        // style={{ height: '400px', width: '100%' }}
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelect}
        min={minTime}
        max={maxTime}
        step={30}
        timeslots={1}
        dayPropGetter={dayPropGetter}
      />

      <div className=" flex justify-end mt-3">
        <Button onClick={handleNext} className=" rounded-full w-32">
          Next
        </Button>
      </div>
    </div>
  )
}

export default CalendarEventSelection
