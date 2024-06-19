import ScheduleCalendar from '@/components/dashboard/ScheduleCalendar'
import { generateTimeOptions } from '@/lib/utils'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

interface StateType {
  event: OneoffEventTypes
  meeting: MeetingTypes
}

const OneoffReschedulePage = () => {
  const location = useLocation()
  const state = location.state as StateType
  const { event, meeting } = state
  const selectedDate = new Date(event.date)
  const date = new Date(event.date)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const timeOptions = generateTimeOptions(
    event?.start as string,
    event?.end as string,
    15,
    []
  )

  const handleDateSelect = async (date: Date | undefined) => {
    console.log('handle selected date', date)
    setIsOpen(true)
  }

  const isDisabled = (date: Date) => {
    selectedDate.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate.getTime() !== selectedDate.getTime()
  }
  return (
    <ScheduleCalendar
      isOpen={isOpen}
      event={event}
      timeOptions={timeOptions}
      date={date}
      handleDateSelect={handleDateSelect}
      navigateUrl={`/reschedule/${meeting._id}`}
      isDisabled={isDisabled}
      meeting={meeting}
    />
  )
}

export default OneoffReschedulePage
