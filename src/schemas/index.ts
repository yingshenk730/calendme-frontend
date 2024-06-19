import * as z from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Must be a valid email address',
    })
    .email({
      message: 'email is required',
    }),
  password: z.string().min(1, {
    message: 'password is required',
  }),
})

export const RegisterSchema = z
  .object({
    email: z
      .string({
        invalid_type_error: 'Must be a valid email address',
      })
      .email({
        message: 'email is required',
      }),
    password: z.string().min(6, {
      message: 'Must be at least 6 characters',
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Must be at least 6 characters',
    }),
    username: z.string().min(1, {
      message: 'name is required',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  })

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'email is required',
  }),
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Must be at least 6 characters',
  }),
})

export const EventSchema = z.object({
  eventName: z.string().min(1, {
    message: 'Event name is required',
  }),
  eventDuration: z.string(),
  eventDateRange: z.number().int().positive(),
})
