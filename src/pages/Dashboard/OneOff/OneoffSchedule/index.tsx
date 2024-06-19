import { generateTimeOptions, getOneoffEventByTitle } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ScheduleCalendar from '@/components/dashboard/ScheduleCalendar'

const OneoffSchedulePage = () => {
  const { oneoffTitle } = useParams()
  const navigate = useNavigate()
  const [oneoffEvent, setOneoffEvent] = useState<OneoffEventTypes | undefined>(
    undefined
  )
  const selectedDate = oneoffEvent ? new Date(oneoffEvent.date) : new Date()
  const [date, setDate] = useState<Date | undefined>(selectedDate)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const timeOptions = generateTimeOptions(
    oneoffEvent?.start as string,
    oneoffEvent?.end as string,
    15,
    []
  )

  useEffect(() => {
    const getEvent = async () => {
      try {
        const resEvent = await getOneoffEventByTitle(oneoffTitle)
        console.log('resEvent', resEvent)
        if (!resEvent.success) {
          navigate('/not-found')
        }
        setOneoffEvent(resEvent.data)
      } catch (error) {
        console.error('Failed to check URL:', error)
      }
    }
    getEvent()
  }, [oneoffTitle]) //eslint-disable-line

  const handleDateSelect = async (date: Date | undefined) => {
    setDate(date)
    setIsOpen(true)
  }

  const isDisabled = (date: Date) => {
    if (!oneoffEvent) return true
    selectedDate.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate.getTime() !== selectedDate.getTime()
  }

  return (
    <ScheduleCalendar
      isOpen={isOpen}
      event={oneoffEvent}
      timeOptions={timeOptions}
      date={date}
      handleDateSelect={handleDateSelect}
      navigateUrl={`/d/${oneoffTitle}`}
      isDisabled={isDisabled}
    />
  )
}

export default OneoffSchedulePage
