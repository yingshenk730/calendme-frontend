import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { DAYS } from '@/lib/data'
import moment from 'moment-timezone'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Label } from '../ui/label'
import { useAuth } from '@/context/useAuth'
import { useNavigate } from 'react-router-dom'

const generateTimeOptions = () => {
  const options = []
  const format = 'HH:mm'
  let time = moment('00:00', format)
  const endTime = moment('23:45', format)

  while (time <= endTime) {
    options.push({ value: time.format(format), label: time.format(format) })
    time = time.add(15, 'minutes')
  }

  return options
}

const FormSchema = z
  .object({
    days: z.array(z.string()).refine((value) => value.some((day) => day), {
      message: 'You have to select at least one item.',
    }),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine(
    (data) => {
      return moment(data.endTime, 'HH:mm').isAfter(
        moment(data.startTime, 'HH:mm')
      )
    },
    {
      message: 'End time must be after start time.',
      path: ['endTime'],
    }
  )

const StepThreeCard = ({ timezone }: { timezone: string }) => {
  console.log('timezone:', timezone)
  const { setUser } = useAuth()
  const navigate = useNavigate()
  // console.log('user:', user)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      days: [],
      startTime: '09:00',
      endTime: '17:00',
    },
  })
  const {
    formState: { errors },
  } = form

  const options = generateTimeOptions()
  const api_baseUrl = import.meta.env.VITE_API_BASE_URL

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // console.log('data:', data)
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    try {
      const res = await fetch(`${api_baseUrl}/user-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ availability: data, timezone }),
      })
      const resData = await res.json()
      if (resData?.success) {
        setUser(resData.user)
        navigate('/dashboard')
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 py-9 min-w-[400px] text-sm">
        <div className="flex items-center gap-3 mb-3">
          <Label className="text-nowrap mr-3">Available Time:</Label>
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className=" w-10 h-[2px] bg-primary" />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        {errors.endTime && (
          <p className=" text-destructive pb-3">{errors.endTime.message}</p>
        )}
        <Label className="text-nowrap ">Available Days:</Label>
        <FormField
          control={form.control}
          name="days"
          render={() => (
            <FormItem>
              <div className=" flex gap-3 flex-wrap">
                {DAYS.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="days"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-1 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked: boolean) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full text-center pt-3">
          <Button type="submit" className="px-9">
            Finish
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default StepThreeCard
