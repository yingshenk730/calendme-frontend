import ScheduleConfirm from '@/components/dashboard/ScheduleConfirm'
import { useParams } from 'react-router-dom'

const ConfirmMeetingPage = () => {
  const { userUrl, meetingType, date } = useParams()
  const url = `/${userUrl}/${meetingType}`
  return <ScheduleConfirm url={url} date={date} />
}

export default ConfirmMeetingPage
