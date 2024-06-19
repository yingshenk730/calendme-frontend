import moment from 'moment-timezone'
import { CardContent } from '../ui/card'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useState } from 'react'
import { Input } from '../ui/input'
import { CheckIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { TriangleAlert } from 'lucide-react'
const StepOneCard = ({
  step,
  onStepChange,
  selectedTimezone,
  setSelectedTimezone,
}: {
  step: number
  onStepChange: React.Dispatch<React.SetStateAction<number>>
  selectedTimezone: string
  setSelectedTimezone: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [isChecked, setIsChecked] = useState(false)
  const [error, setError] = useState('')
  const timezone = moment.tz.names()
  const defaultTimezone = moment.tz.guess()
  const [url, setUrl] = useState('')
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL
  const handleCheckUrl = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    setUrl(inputUrl)

    try {
      const res = await fetch(`${api_baseUrl}/user-url/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setIsChecked(true)
        setError('')
      } else {
        setIsChecked(false)
        setError(data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to continue')
      return
    }

    try {
      const res = await fetch(`${api_baseUrl}/user-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (data.success) {
        setError('')
        setIsChecked(false)
        onStepChange(step + 1)
      }
    } catch (e) {
      console.log(e)
      setError('Something went wrong')
    }
  }

  return (
    <CardContent className="flex flex-col py-6 pr-9 sm:pr-12 md:pr-16">
      <div className="grid grid-cols-3 relative">
        <Label
          htmlFor="url"
          className="text-xs md:text-base flex items-center justify-end pr-9">
          Create your URL
        </Label>
        <div className="col-span-2">
          <div className="flex ">
            <div className="border-[1px] w-fit px-1 text-xs md:text-base  rounded-s-lg flex items-center text-zinc-400">
              calendme.app/
            </div>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none rounded-e-lg min-w-10"
              value={url}
              onChange={handleCheckUrl}
            />
          </div>
        </div>
        {isChecked && (
          <div className=" absolute top-2.5 -right-6 bg-green-600 rounded-full text-white w-5 h-5 flex items-center justify-center">
            <CheckIcon className=" w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <div className="grid grid-cols-3 ">
          <div />
          <div className=" text-destructive text-sm col-span-2 mt-2 flex gap-1">
            <TriangleAlert className=" text-destructive w-4 h-4" /> {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 mt-6 ">
        <Label
          htmlFor="timezone"
          className="col-span-1 text-xs md:text-base flex items-center justify-end pr-9">
          Set timezone
        </Label>
        <div className="col-span-2">
          <Select
            defaultValue={defaultTimezone}
            value={selectedTimezone}
            onValueChange={setSelectedTimezone}>
            <SelectTrigger
              className="text-xs md:text-base"
              id="timezone"
              aria-label="Select status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {timezone.map((zone) => (
                <SelectItem
                  className="text-xs md:text-base"
                  key={zone}
                  value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className=" flex items-center justify-center mt-6">
        <Button
          disabled={!isChecked}
          onClick={handleSubmit}
          className="w-fit px-6">
          Confirm and next
        </Button>
      </div>
    </CardContent>
  )
}

export default StepOneCard
