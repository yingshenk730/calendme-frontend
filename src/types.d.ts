// types.d.ts
interface EventTypes {
  eventDateRange: number
  eventDuration: string
  eventName: string
  hostname: string
  eventTitle: string
  isOpen: boolean
  user: string
  locationNote?: string
  locationType: string
  _id: string
}

interface OneoffEventTypes {
  start: string
  end: string
  timezone: string
  eventDuration: string
  eventName: string
  hostname: string
  date: string
  eventTitle: string
  user: string
  locationNote?: string
  locationType: string
  variant?: 'oneoff' | 'meetingpoll'
  _id: string
}

interface MeetingTypes {
  _id: string
  user: string
  event: string
  name: string
  email: string
  meetingStart: string
  meetingEnd: string
  meetingDate: string
  timezone: string
  eventName: string
  message: string
  notes: string
  variant: string
}
interface Availability {
  _id: string
  user: string
  days: string[]
  startTime?: string
  endTime?: string
  timezone?: string
}

interface TimeOption {
  value: string
  label: string
}
interface OccupiedTime {
  start: moment.Moment
  end: moment.Moment
}

interface NotificationTypes {
  _id?: string
  user: string
  message: string
  title: string
  read?: boolean
  createdAt?: string
}

type DayMappings = {
  [key in
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday']: number
}
