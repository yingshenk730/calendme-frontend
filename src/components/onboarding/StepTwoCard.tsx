import { useAuth } from '@/context/useAuth'
import { Button } from '../ui/button'

const StepTwoCard = ({
  step,
  onStepChange,
}: {
  step: number
  onStepChange: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { user } = useAuth()
  const handleClick = () => {
    onStepChange(step + 1)
  }
  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex justify-center ">
        <div className="  w-fit px-6 tracking-wider">
          <h1 className="text-3xl font-medium">Hi, we will</h1>
          <p className="py-6">check youremail@gmail.com for conflicts,</p>
          <p>
            And add events to{' '}
            <span className="font-semibold">{user?.email}</span>.
          </p>
        </div>
      </div>
      <div className=" flex items-center justify-center">
        <Button onClick={handleClick} className="w-fit px-6">
          Confirm and next
        </Button>
      </div>
    </div>
  )
}

export default StepTwoCard
