import ScheduleConfirm from '@/components/dashboard/ScheduleConfirm'
import { useParams } from 'react-router-dom'

const OneoffScheduleConfirmPage = () => {
  const { oneoffTitle, date } = useParams()

  return <ScheduleConfirm url={`/d/${oneoffTitle}`} date={date} />
}

export default OneoffScheduleConfirmPage
