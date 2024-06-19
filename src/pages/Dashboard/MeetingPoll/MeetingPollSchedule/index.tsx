import { cn, generateTimeOptions, getOneoffEventByTitle } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EVENT_LOCATIONS } from '@/lib/data'
import { MapPin, Clock4, ThumbsUp } from 'lucide-react'
import CalendMeBadge from '@/components/Badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const MeetingPollSchedulePage = () => {
  const { oneoffTitle } = useParams()
  const navigate = useNavigate()
  const [oneoffEvent, setOneoffEvent] = useState<OneoffEventTypes | undefined>(
    undefined
  )
  const [selectedValues, setSelectedValues] = useState<string[]>([])

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

  const duration = parseInt(oneoffEvent?.eventDuration ?? '0', 10)
  const timeOptions = generateTimeOptions(
    oneoffEvent?.start as string,
    oneoffEvent?.end as string,
    duration,
    []
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle the form submission logic
    console.log('Submitted Values:', selectedValues)
  }
  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prevValues) => {
      const isAlreadySelected = prevValues.includes(value)
      if (isAlreadySelected) {
        return prevValues.filter((item) => item !== value) // Remove unselected value
      } else {
        return [...prevValues, value] // Add selected value
      }
    })
  }
  return (
    <div className="w-full min-h-screen bg-muted/40 flex justify-center  px-6 sm:px-20 lg:px-24 py-6 md:py-12 ">
      <div className="relative flex flex-col sm:grid  sm:grid-cols-3 bg-white ring-1 ring-zinc-200 shadow-lg w-full max-w-2xl max-h-[500px] rounded-xl">
        <CalendMeBadge />
        <div className="border-b-[1px] h-fit sm:h-full sm:border-b-0  sm:border-r-[1px] border-zinc-300 p-6 w-full ">
          <div className="w-full">
            <p>{oneoffEvent?.hostname}</p>
            <h1 className=" text-xl font-semibold pt-1 pb-3">
              {oneoffEvent?.eventName}
            </h1>
            <div className="flex items-center gap-2 text-zinc-600">
              <Clock4 className="w-4 h-4" />
              <p className="text-sm ">{oneoffEvent?.eventDuration} Mins</p>
            </div>
            <div className="pt-1 flex items-center gap-2 text-zinc-600">
              <MapPin className="w-4 h-4" />
              <p className="text-sm ">
                {
                  EVENT_LOCATIONS.find(
                    (loc) => loc.value === oneoffEvent?.locationType
                  )?.label
                }
              </p>
            </div>
          </div>
        </div>
        <div className=" flex-grow sm:col-span-2  p-3 md:p-6 flex ">
          <div className="w-full flex flex-col">
            <h1 className=" sm:pt-3 text-primary font-semibold">
              MEETING POLL
            </h1>
            <p>Select all the times you're available to meet</p>

            <p className=" font-semibold text-sm pt-6">Time zone</p>
            <p className="text-sm">{oneoffEvent?.date}</p>
            <div className="w-full h-px bg-zinc-300 block min-[850px]:hidden" />
            <div className="relative flex-grow w-full bg-white p-3 flex">
              <form onSubmit={handleSubmit} className=" p-3">
                <div className="flex flex-wrap gap-6">
                  {timeOptions.map((item) => (
                    <div className="w-24  flex" key={item.value}>
                      <Checkbox
                        id={item.value}
                        value={item.value}
                        checked={selectedValues.includes(item.value)}
                        onCheckedChange={() => handleCheckboxChange(item.value)}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.value}
                        className={cn(
                          'font-normal w-full cursor-pointer ring-1 ring-blue-400 hover:ring-ring rounded-lg py-2 px-3 flex justify-between',
                          {
                            'bg-primary text-white': selectedValues.includes(
                              item.value
                            ),
                          }
                        )}>
                        {item.label}
                        <ThumbsUp
                          className={cn('w-4 h-4 ml-2 hidden', {
                            'inline-block': selectedValues.includes(item.value),
                          })}
                        />
                      </Label>
                    </div>
                  ))}
                </div>
                <Button
                  type="submit"
                  className=" absolute bottom-3 sm:bottom-6 right-6">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetingPollSchedulePage
