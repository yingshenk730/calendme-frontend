import EventTypeCard from '@/components/dashboard/EventTypeCard'
import { useAuth } from '@/context/useAuth'
import { useEffect, useState } from 'react'

const EventTypePage = () => {
  const { user } = useAuth()
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([])
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const getEventTypes = async () => {
      if (!user || !user._id) {
        return
      }
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      try {
        const response = await fetch(
          `${api_baseUrl}/user-event/user/${user._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        if (data.events) {
          setEventTypes(data.events)
        }
      } catch (error) {
        console.error(error)
      }
    }

    getEventTypes()
  }, [user]) // eslint-disable-line
  return (
    <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 min-[1500px]:grid-cols-3 gap-6 min-[1500px]:gap-y-12 py-6 lg:py-9">
      {eventTypes.map((event) => (
        <EventTypeCard
          key={event._id}
          event={event}
          setEventTypes={setEventTypes}
        />
      ))}
    </div>
  )
}

export default EventTypePage
