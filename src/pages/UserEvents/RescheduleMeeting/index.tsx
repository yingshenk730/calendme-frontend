import CalendMeBadge from '@/components/Badge'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EVENT_LOCATIONS, dayMappings } from '@/lib/data'
import {
  cn,
  generateTimeOptions,
  getMeetingsByToken,
  getUserAvailability,
  groupMeetingsByDate,
} from '@/lib/utils'
import { Clock4, Earth, MapPin, Calendar as CalendarIcon } from 'lucide-react'
import moment from 'moment-timezone'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface StateType {
  event?: EventTypes
  meeting: MeetingTypes
}

const RescheduleMeetingPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeBtnValue, setActiveBtnValue] = useState<string | null>(null)
  const [userAvailability, setUserAvailability] = useState<
    Availability | undefined
  >(undefined)
  const [allMeetings, setAllMeetings] = useState<MeetingTypes[]>([])
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as StateType
  const { event, meeting } = state
  const defaultTimezone = moment.tz.guess()
  const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone)
  const timezones = moment.tz.names()

  useEffect(() => {
    const getEventAndAvailability = async () => {
      try {
        const resAvailable = await getUserAvailability(event?.user)
        setUserAvailability(resAvailable.availability)
      } catch (error) {
        console.error('Failed to check URL:', error)
      }
    }
    getEventAndAvailability()
  }, [event]) //eslint-disable-line

  useEffect(() => {
    const getAllMeetings = async () => {
      try {
        const res = await getMeetingsByToken()
        if (!res.success)
          return console.error('Failed to get meetings:', res.error)
        setAllMeetings(res.meetings)
      } catch (error) {
        console.error('Failed to check URL:', error)
      }
    }
    getAllMeetings()
  }, [])

  const days = userAvailability?.days ?? []
  const dayNumbers = days.map((day) => dayMappings[day as keyof DayMappings])
  const isDisabled = (date: Date) => {
    const today = new Date()
    const dateRange = event?.eventDateRange
    if (!dateRange) return true
    const dayEnd = new Date()
    dayEnd.setDate(today.getDate() + dateRange)
    const dayOfWeek = date.getDay()
    const isBeforeToday = date < today
    const isAfterDateRange = date > dayEnd
    const isDayOff = dayNumbers.includes(dayOfWeek)
    return isBeforeToday || isAfterDateRange || !isDayOff
  }

  const handleDateSelect = async (date: Date | undefined) => {
    setDate(date)
    setIsOpen(true)
    const formattedDate = moment(date).format('dddd, MMMM D, YYYY')
    const groupMeetings = groupMeetingsByDate(allMeetings)
    const daysMeetings = groupMeetings[formattedDate] || []
    const occupiedTimes: OccupiedTime[] = daysMeetings.map((meeting) => ({
      start: moment(meeting.meetingStart, 'HH:mm'),
      end: moment(meeting.meetingEnd, 'HH:mm'),
    }))
    if (userAvailability) {
      const options = generateTimeOptions(
        userAvailability.startTime as string,
        userAvailability.endTime as string,
        15,
        occupiedTimes
      )
      setTimeOptions(options)
    }
  }
  const handleSelectTime = (value: string) => {
    if (activeBtnValue === value) {
      return setActiveBtnValue(null)
    }
    setActiveBtnValue(value)
  }

  const handleNext = () => {
    const stateObject = {
      event,
      meeting,
      timezone: selectedTimezone,
    }
    const formattedDate = date?.toISOString().split('T')[0]
    navigate(
      `/reschedule/${meeting._id}/${formattedDate}?time=${activeBtnValue}`,
      { state: stateObject }
    )
  }
  return (
    <div className="w-full min-h-screen bg-muted/40 flex justify-center  px-6 sm:px-20 lg:px-24 py-6 md:py-12 ">
      <div
        className={cn(
          ' relative grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg w-full max-w-2xl max-h-[600px] rounded-xl ',
          {
            'max-w-3xl min-[850px]:grid-cols-3': isOpen,
          }
        )}>
        <CalendMeBadge />
        <div
          className={cn('border-r-[1px] border-zinc-300 hidden md:flex p-6', {
            'md:hidden min-[850px]:flex': isOpen,
          })}>
          <div className="w-full">
            <p>{event?.hostname}</p>
            <h1 className=" text-xl font-semibold pt-1 pb-3">
              {event?.eventName}
            </h1>
            <div className="flex items-center gap-2 text-zinc-600">
              <Clock4 className="w-4 h-4" />
              <p className="text-sm ">{event?.eventDuration} Mins</p>
            </div>
            <div className="pt-1 flex items-center gap-2 text-zinc-600">
              <MapPin className="w-4 h-4" />
              <p className="text-sm ">
                {
                  EVENT_LOCATIONS.find(
                    (loc) => loc.value === event?.locationType
                  )?.label
                }
              </p>
            </div>
            <div className="pt-6 flex flex-col gap-3">
              <p className="text-sm text-zinc-700 font-semibold pb-2">
                Former Time ({meeting.name})
              </p>
              <div className="flex items-center gap-2 text-zinc-600">
                <div className="w-4">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <p className="text-sm ">
                  {meeting.meetingStart}-{meeting.meetingEnd},
                  {meeting.meetingDate}
                </p>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Earth className="w-4 h-4" />
                <p className="text-sm ">{meeting.timezone}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(' col-span-1  p-3 md:p-6 flex', {
            'col-span-2': isOpen,
          })}>
          <div className="w-full flex flex-col">
            <p className=" text-xs text-zinc-600">Reschedule Event</p>
            <h1 className="hidden md:block md:pb-3 md:pt-2 font-semibold">
              Select a Date & Time
            </h1>
            <div className="block md:hidden">
              <div className="w-full  flex flex-col items-center justify-center pb-3">
                <p>{event?.hostname}</p>
                <h1 className="font-semibold">{event?.eventName}</h1>
                <div className="flex gap-6 ">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Clock4 className="w-4 h-4" />
                    <p className="text-sm ">{event?.eventDuration} Mins</p>
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-zinc-600">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm ">
                      {
                        EVENT_LOCATIONS.find(
                          (loc) => loc.value === event?.locationType
                        )?.label
                      }
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col text-center pt-3 ">
                  <p className="text-sm text-zinc-700 font-semibold ">
                    Former Time ({meeting.name})
                  </p>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <div className="w-4">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <p className="text-sm ">
                      {meeting.meetingStart}-{meeting.meetingEnd},
                      {meeting.meetingDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-zinc-300 block min-[850px]:hidden" />
            <div className=" flex-grow w-full bg-white flex items-center ">
              <div className="w-full flex items-center justify-center ">
                <div className=" flex flex-col items-center justify-center ">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => isDisabled(date)}
                    footer={
                      <div className=" pt-4 pl-1">
                        <div className="flex gap-1 items-center text-sm font-semibold">
                          <Earth className="w-4 h-4" />
                          <p>Timezone</p>
                        </div>
                        {/* <p className="text-sm">{userAvailability?.timezone}</p> */}
                        <Select
                          defaultValue={defaultTimezone}
                          value={selectedTimezone}
                          onValueChange={setSelectedTimezone}>
                          <SelectTrigger
                            className="text-xs border-none focus:ring-0"
                            id="timezone"
                            aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((zone) => (
                              <SelectItem
                                className="text-xs"
                                key={zone}
                                value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    }
                  />
                </div>

                {isOpen && (
                  <ScrollArea className="w-full min-w-36 max-w-60 h-[340px] py-2 px-1 ">
                    <div className="flex flex-col space-y-1">
                      {timeOptions.map((option) => (
                        <div key={option.value} className="w-full flex">
                          <div
                            className={cn(
                              'my-1 mx-2 flex-1 py-2 flex items-center justify-center cursor-pointer bg-white ring-1 ring-primary rounded-md hover:ring-2 text-xs',
                              {
                                'bg-zinc-500 ring-0 hover:ring-1 text-white':
                                  activeBtnValue === option.value,
                              }
                            )}
                            onClick={() => handleSelectTime(option.value)}>
                            {option.label}
                          </div>
                          <div
                            className={cn(
                              'my-1 mx-2 cursor-pointer flex-1 py-1 flex items-center justify-center  text-xs ring-1 ring-primary rounded-md bg-primary text-white hover:ring-2',
                              {
                                hidden: activeBtnValue !== option.value,
                              }
                            )}
                            onClick={handleNext}>
                            Next
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RescheduleMeetingPage
