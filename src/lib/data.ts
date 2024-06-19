import {
  Home,
  CalendarDays,
  Text,
  Gem,
  MapPin,
  PhoneCall,
  Video,
} from 'lucide-react'
import { PiTicket } from 'react-icons/pi'

export const STEPS = [
  {
    id: 1,
    title: 'Welcome to CalendMe',
  },
  {
    id: 2,
    title: 'Connect to your Google Calendar!',
  },
  {
    id: 3,
    title: 'Set up your availibility',
  },
] as const

export const DAYS = [
  {
    id: 'monday',
    label: 'Monday',
  },
  {
    id: 'tuesday',
    label: 'Tuesday',
  },
  {
    id: 'wednesday',
    label: 'Wednesday',
  },
  {
    id: 'thursday',
    label: 'Thursday',
  },
  {
    id: 'friday',
    label: 'Friday',
  },
  {
    id: 'saturday',
    label: 'Saturday',
  },
  {
    id: 'sunday',
    label: 'Sunday',
  },
] as const

export const LINKS = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: Home,
  },
  {
    title: 'One-off',
    path: '/dashboard/one-off',
    icon: PiTicket,
  },
  {
    title: 'Meeting Poll',
    path: '/dashboard/meetingpoll',
    icon: Text,
  },

  {
    title: 'Availability',
    path: '/dashboard/calendar',
    icon: CalendarDays,
  },
  {
    title: 'Upgrade plan',
    path: '/dashboard/upgrade',
    icon: Gem,
  },
]

export const EVENT_DURATIONS = [
  {
    value: '15',
    label: '15 Mins',
  },
  {
    value: '30',
    label: '30 Mins',
  },
  {
    value: '45',
    label: '45 Mins',
  },
  {
    value: '60',
    label: '60 Mins',
  },
] as const

export const EVENT_LOCATIONS = [
  {
    value: 'zoom',
    label: 'Zoom',
    icon: Video,
  },
  {
    value: 'phonecall',
    label: 'Phone Call',
    icon: PhoneCall,
  },
  {
    value: 'in-person',
    label: 'In Person',
    icon: MapPin,
  },
] as const

export const dayMappings: DayMappings = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}
