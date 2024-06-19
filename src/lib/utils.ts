import { type ClassValue, clsx } from 'clsx'
import moment from 'moment-timezone'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const api_url = import.meta.env.VITE_API_BASE_URL

export async function getUserUrlByUserId(userId: string | undefined) {
  try {
    const res = await fetch(`${api_url}/user-url/user/${userId}`)
    const data = await res.json()
    if (data.success) {
      return data
    } else {
      return null
    }
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function checkUrlExsiting(userUrl: string | undefined) {
  try {
    const res = await fetch(`${api_url}/user-url/check/${userUrl}`)
    const data = await res.json()
    if (data.success) {
      return data
    } else {
      return null
    }
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function getOpenEventsByUserId(userId: string | undefined) {
  try {
    const res = await fetch(`${api_url}/user-event/search/${userId}`)
    const openEvents = await res.json()
    return openEvents
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function getEventByEventTitle(eventTitle: string | undefined) {
  try {
    const res = await fetch(`${api_url}/user-event/${eventTitle}`)
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function getEventByEventId(
  eventId: string | undefined,
  variant: string | undefined
) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const res = await fetch(
      `${api_url}/${
        variant === 'regular' ? 'user-event' : 'one-off'
      }/event/${eventId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}
export async function getOpenEventByUserId(userId: string | undefined) {
  try {
    const resEvent = await fetch(`${api_url}/user-event/${userId}`)
    const eventData = await resEvent.json()
    return eventData
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function getUserAvailability(userId: string | undefined) {
  try {
    const res = await fetch(`${api_url}/user-availability/${userId}`)
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to check URL')
  }
}

export async function getUsernameByUserUrl(userUrl: string | undefined) {
  try {
    const res = await checkUrlExsiting(userUrl)
    if (!res.success) {
      return null
    }
    const userId = res.userUrl.user
    const resUsername = await fetch(`${api_url}/auth/uname/${userId}`)
    const data = await resUsername.json()
    if (data.success) {
      return data.username
    } else {
      return null
    }
  } catch (error) {
    throw new Error('Failed to get username')
  }
}

export async function getMeetingByMeetingId(meetingId: string | undefined) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const res = await fetch(`${api_url}/user-meeting/${meetingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (data && data.success) {
      return data
    } else {
      return null
    }
  } catch (error) {
    throw new Error('Failed to get meeting')
  }
}

export async function addOrUpdateMeetingNotes(
  meetingId: string | undefined,
  notes: string | undefined
) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const res = await fetch(`${api_url}/user-meeting/notes/${meetingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    })
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to add notes')
  }
}

export const generateTimeOptions = (
  startTime: string,
  endTime: string,
  step: number,
  occupiedTimes: OccupiedTime[]
) => {
  const options = []
  const format = 'HH:mm'
  let time = moment(startTime, format)
  const end = moment(endTime, format)

  while (time <= end) {
    const isOccupied = occupiedTimes.some(({ start, end }) =>
      time.isBetween(start, end, undefined, '[)')
    )
    if (!isOccupied) {
      options.push({ value: time.format(format), label: time.format(format) })
      time = time.add(step, 'minutes')
    } else {
      time = time.add(step, 'minutes')
    }
  }
  return options
}

export const groupMeetingsByDate = (
  meetings: MeetingTypes[]
): Record<string, MeetingTypes[]> => {
  const groups: Record<string, MeetingTypes[]> = {}
  meetings.forEach((meeting) => {
    const { meetingDate } = meeting
    if (!groups[meetingDate]) {
      groups[meetingDate] = []
    }
    groups[meetingDate].push(meeting)
  })
  return groups
}

export const groupOneoffEventsByDate = (
  events: OneoffEventTypes[]
): Record<string, OneoffEventTypes[]> => {
  const groups: Record<string, OneoffEventTypes[]> = {}
  events.forEach((event) => {
    const { date } = event
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
  })
  return groups
}

export const getMeetingsByToken = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const res = await fetch(`${api_url}/user-meeting`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to get meeting')
  }
}

export const getMeetingsByUserId = async (userId: string | undefined) => {
  try {
    if (!userId) {
      return
    }
    const res = await fetch(`${api_url}/user-meeting/user/${userId}`)
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to get meeting')
  }
}

export const createNotification = async (
  message: string,
  title: string,
  userId: string
) => {
  try {
    const res = await fetch(`${api_url}/notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, title, userId }),
    })
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to create notification')
  }
}

export const getOneoffEventByTitle = async (eventTitle: string | undefined) => {
  try {
    const res = await fetch(`${api_url}/one-off/${eventTitle}`)
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to get oneoff event')
  }
}

export const getOpenOneoffEventsByToken = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const res = await fetch(`${api_url}/one-off/search/open`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Failed to get oneoff event')
  }
}
