import { useState } from 'react'
import { STEPS } from '@/lib/data'
import moment from 'moment-timezone'
import StepOneCard from '@/components/onboarding/StepOneCard'
import Steps from '@/components/onboarding/Steps'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import StepTwoCard from '@/components/onboarding/StepTwoCard'
import StepThreeCard from '@/components/onboarding/StepThreeCard'

const Onboarding = () => {
  const [step, setStep] = useState<number>(1)
  const defaultTimezone = moment.tz.guess()
  const [selectedTimezone, setSelectedTimezone] = useState(defaultTimezone)

  return (
    <div className="w-full h-screen flex flex-col gap-12 ">
      <h1 className="mt-12 lg:mt-16 text-4xl font-bold text-primary text-center">
        Calend<span className=" text-secondary">Me</span>
      </h1>
      <div className=" flex items-center justify-center flex-col gap-12">
        <Steps step={step} />
        <div className="w-full max-w-[720px] px-6">
          <Card className="shadow-lg shadow-zinc-200/40 rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className=" text-xl">
                {STEPS[step - 1].title}
              </CardTitle>
            </CardHeader>
            <div className="w-full h-px bg-zinc-300" />
            {step === 1 ? (
              <StepOneCard
                step={step}
                onStepChange={setStep}
                selectedTimezone={selectedTimezone}
                setSelectedTimezone={setSelectedTimezone}
              />
            ) : step === 2 ? (
              <StepTwoCard step={step} onStepChange={setStep} />
            ) : (
              <StepThreeCard timezone={selectedTimezone} />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
