import { cn } from '@/lib/utils'
import { Link } from 'lucide-react'
import { IoMdMail } from 'react-icons/io'
import { CalendarDays } from 'lucide-react'
const Steps = ({ step }: { step: number }) => {
  return (
    <div className=" flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
        <Link className=" text-white stroke-[3px]" />
      </div>
      <div
        className={cn('w-20 h-1.5 bg-zinc-300', {
          'bg-primary': step !== 1,
        })}
      />
      <div
        className={cn(
          'w-12 h-12 rounded-full bg-primary flex items-center justify-center',
          {
            'bg-zinc-300': step === 1,
          }
        )}>
        <IoMdMail className=" text-white w-6 h-6" />
      </div>
      <div
        className={cn('w-20 h-1.5 bg-zinc-300', {
          'bg-primary': step === 3,
        })}
      />
      <div
        className={cn(
          'w-12 h-12 rounded-full bg-primary flex items-center justify-center',
          {
            'bg-zinc-300': step !== 3,
          }
        )}>
        <CalendarDays className=" text-white stroke-[3px]" />
      </div>
    </div>
  )
}

export default Steps
