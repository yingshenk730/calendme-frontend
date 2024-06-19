import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EventSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { EVENT_DURATIONS, EVENT_LOCATIONS } from '@/lib/data'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

type EventFormValues = z.infer<typeof EventSchema>

function formatString(inputString: string) {
  if (inputString.includes(' ')) {
    return inputString.toLowerCase().replace(/\s+/g, '-')
  }
  return inputString
}
const NewEvent = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [locationType, setLocationType] = useState('')
  const [locationNote, setLocationNote] = useState('')
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      eventDuration: '30',
      eventDateRange: 30,
      eventName: '',
    },
  })

  const handleClick = () => {
    setOpen(false)
    if (locationType === '') {
      setLocationType('zoom')
    }
    // setLocation('')
    setError('')
  }
  const locationLabel: string | undefined = EVENT_LOCATIONS.find(
    (loc) => loc.value === locationType
  )?.label

  const onSubmit = async (values: z.infer<typeof EventSchema>) => {
    setError('')
    const eventTitle = formatString(values.eventName)
    if (locationType === '') {
      setError('Please select a location')
      return
    }
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch(`${api_baseUrl}/user-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event: { ...values, eventTitle, locationType, locationNote },
        }),
      })
      const data = await res.json()
      // console.log('data:', data)
      if (data.success) {
        setLocationType('')
        setLocationNote('')
        form.reset()
        navigate('/dashboard')
      }
    } catch (e) {
      throw new Error('An unknown error occurred')
    }
  }

  return (
    <div className="size-full flex flex-col">
      <div>
        <Button
          variant="link"
          className="font-semibold text-left px-3"
          onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" /> Back
        </Button>
      </div>
      <h1 className=" text-lg px-3 pb-3 font-semibold">Add New Meeting</h1>

      <div className="h-px w-full bg-zinc-300" />
      <div className=" h-full flex items-center justify-center px-3  py-9">
        <Card className="w-full max-w-[700px]">
          <CardHeader className="pb-3">
            <CardTitle className=" text-xl">What event is this?</CardTitle>
            <CardDescription>get location</CardDescription>
          </CardHeader>
          <div className="w-full h-px bg-zinc-300 mb-3" />
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 relative">
                <div className="absolute -top-16 right-0 flex gap-1  sm:gap-2">
                  <Button
                    variant="ghost"
                    className="rounded-full text-xs sm:text-sm"
                    onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full text-xs sm:text-sm">
                    Submit
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Name your event" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div
                    className={`${
                      error ? 'text-sm text-destructive' : 'text-sm text-black '
                    }`}>
                    Location
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-zinc-500 w-full justify-start pl-3 mt-3">
                        {locationLabel || 'Select location'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-0 py-6">
                      <DialogHeader className="px-6">
                        <DialogTitle>Location</DialogTitle>
                      </DialogHeader>
                      <div className="w-full px-0 bg-zinc-300 h-px" />
                      <div className="flex flex-col gap-3 py-4 px-6">
                        <Label htmlFor="location">Your Location</Label>
                        <div>
                          <Select
                            defaultValue="zoom"
                            onValueChange={(e) => setLocationType(e)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_LOCATIONS.map((location) => (
                                <SelectItem
                                  key={location.value}
                                  value={location.value}>
                                  <div className="flex items-center gap-3">
                                    <location.icon className="w-6 h-6" />
                                    {location.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Label>Location details</Label>
                        <Input
                          value={locationNote}
                          onChange={(e) => {
                            setLocationNote(e.target.value)
                          }}
                        />
                      </div>
                      <DialogFooter className="px-6">
                        <Button onClick={handleClick}>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </div>
                <FormField
                  control={form.control}
                  name="eventDuration"
                  render={({ field }) => (
                    <FormItem className="space-y-3 ">
                      <FormLabel>Event Time*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-1">
                          {EVENT_DURATIONS.map((duration) => (
                            <FormItem
                              key={duration.value}
                              className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={duration.value}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover py-3 px-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-zinc-400 [&:has([data-state=checked])]:bg-primary ">
                                {duration.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date range*</FormLabel>
                      <p className="text-zinc-500 text-sm">
                        calendar days into the future
                      </p>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="w-16"
                            onChange={(e) => {
                              const num = parseInt(e.target.value)
                              field.onChange(num)
                            }}
                          />
                        </FormControl>
                        <p className="text-sm">calendar days into the future</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewEvent
