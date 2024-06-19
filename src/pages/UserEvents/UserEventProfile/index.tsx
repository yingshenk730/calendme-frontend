import CalendMeBadge from '@/components/Badge'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { checkUrlExsiting, getOpenEventsByUserId } from '@/lib/utils'

const UserEventProfile = () => {
  const { userUrl } = useParams()
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openEvents, setOpenEvents] = useState<EventTypes[]>([])
  // const [username, setUsername] = useState('')
  console.log('openEvents:', openEvents)
  useEffect(() => {
    const checkUserUrl = async () => {
      try {
        const data = await checkUrlExsiting(userUrl)
        if (!data.success) {
          setIsValid(false)
        }
        setIsValid(true)
        const eventData = await getOpenEventsByUserId(data.userUrl.user)
        if (eventData.success) {
          setOpenEvents(eventData.events)
        }
      } catch (error) {
        console.error('Failed to check URL:', error)
      }
      setLoading(false)
    }
    checkUserUrl()
  }, [userUrl])
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isValid) {
    return <Navigate to="/not-found" />
  }
  return (
    <div className="min-h-screen w-full  flex  md:items-center md:justify-center py-3 px-3 md:py-6 md:px-24 lg:px-36 xl:px-48 bg-muted/40 ">
      <div className="bg-white relative w-full max-w-[800px] h-[400px] lg:h-[500px]  shadow-xl rounded-xl p-6 ring-1 ring-zinc-200/50  ">
        <CalendMeBadge />
        <div className="flex justify-center">
          <header className="text-center w-72 py-1 sm:py-3">
            <h1 className=" text-lg text-zinc-700 pb-3 sm:pb-6">
              {openEvents[0].hostname}
            </h1>
            <p className=" text-zinc-400 text-sm">
              Welcome to my scheduling page. Please follow the instructions to
              add an event to my calendar.
            </p>
          </header>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6 md:px-12 md:gap-12">
          {openEvents.map((event) => (
            <div key={event._id}>
              <Link
                to={`/${userUrl}/${event.eventTitle}`}
                className=" border-t-[1px]  hover:bg-zinc-100 p-3 flex justify-between">
                <div className="flex items-center gap-3 ">
                  <div className="rounded-full w-4 h-4 bg-primary" />
                  <div className="text-sm">{event.eventName}</div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserEventProfile
