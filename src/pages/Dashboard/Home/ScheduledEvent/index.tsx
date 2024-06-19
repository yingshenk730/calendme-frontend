import { useEffect, useState } from 'react'
import Meeting from '@/components/dashboard/Meeting'
import { getMeetingsByToken, groupMeetingsByDate } from '@/lib/utils'

const ScheduledEventPage = () => {
  const [active, setActive] = useState('upcoming')
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingTypes[]>([])
  const [pastMeetings, setPastMeetings] = useState<MeetingTypes[]>([])
  const upcomingGroupedMeetings = groupMeetingsByDate(upcomingMeetings)
  const pastGroupedMeetings = groupMeetingsByDate(pastMeetings)

  useEffect(() => {
    const getMeetings = async () => {
      const res = await getMeetingsByToken()
      if (res.success) {
        const now = new Date()
        const upcoming: MeetingTypes[] = []
        const past: MeetingTypes[] = []
        res.meetings.forEach((meeting: MeetingTypes) => {
          const meetingDateTime = new Date(
            `${meeting.meetingDate} ${meeting.meetingStart}`
          )
          if (meetingDateTime > now) {
            upcoming.push(meeting)
          } else {
            past.push(meeting)
          }
        })

        setUpcomingMeetings(upcoming)
        setPastMeetings(past)
      } else {
        console.error('Failed to get meetings:', res.error)
      }
    }
    getMeetings()
  }, [])
  return (
    <div className="  h-full p-3 pt-6">
      <div className="bg-white ring-1 ring-zinc-200 size-full rounded-lg shadow-md">
        <div className="flex gap-3">
          <div
            onClick={() => setActive('upcoming')}
            className={`p-3 pb-2 cursor-pointer ${
              active === 'upcoming'
                ? 'border-b-2 border-b-primary'
                : 'text-gray'
            }`}>
            Upcoming
          </div>
          <div
            onClick={() => setActive('past')}
            className={`p-3 pb-2 cursor-pointer ${
              active === 'past' ? ' border-b-2 border-b-primary' : 'text-gray'
            }`}>
            Past
          </div>
        </div>
        <div className="h-px w-full bg-zinc-300" />

        <div className="pb-3">
          {active === 'upcoming' ? (
            <div className="w-full">
              {Object.entries(upcomingGroupedMeetings).map(
                ([date, dayMeetings]) => (
                  <div key={date} className=" ">
                    <h2 className=" text-base py-3 bg-accent px-3">{date}</h2>
                    <div className="flex flex-col ">
                      {dayMeetings.map((meeting, index) => (
                        <Meeting
                          key={index}
                          meetingId={meeting._id}
                          status="upcoming"
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="w-full">
              {Object.entries(pastGroupedMeetings).map(
                ([date, dayMeetings]) => (
                  <div key={date} className=" ">
                    <h2 className=" text-base py-3 bg-accent px-3">{date}</h2>
                    <div className="flex flex-col ">
                      {dayMeetings.map((meeting, index) => (
                        <Meeting
                          key={index}
                          meetingId={meeting._id}
                          status="past"
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScheduledEventPage
