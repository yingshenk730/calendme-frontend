import { UserAuthForm } from '@/components/form/UserAuthForm'

export default function HomePage() {
  return (
    // <div className=" w-sreen h-screen ">
    <div className="w-sreen h-screen relative  flex-col items-center justify-center md:grid md:max-w-none md:grid-flow-row-dense md:grid-cols-2  md:min-h-[600px]">
      <div className="absolute left-8 md:left-12 lg:left-24 top-12  text-primary text-xl lg:text-2xl font-semibold">
        Calend<span className="text-secondary">Me</span>
      </div>
      <div className="size-full p-12 flex items-center justify-center">
        <div className=" flex flex-col space-y-6 min-w-min max-w-lg">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
      <div className=" col-span-1 relative hidden h-full flex-col  p-10 text-white md:flex bg-primary bg-[url('/bg.png')] bg-cover bg-center ">
        <div className=" absolute top-12 z-20 font-medium text-white text-2xl lg:text-4xl space-y-3 lg:space-y-6">
          <h1>Master Your Calendar </h1>
          <h1>Elevate Your Life</h1>
        </div>
      </div>
    </div>
    // </div>
  )
}
