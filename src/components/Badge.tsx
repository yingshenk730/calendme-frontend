import { Link } from 'react-router-dom'

const CalendMeBadge = () => {
  return (
    <div className="-z-1  scale-[0.8] md:scale-100  absolute  overflow-hidden pb-4 pt-4 -top-[17px] -right-6  md:-top-1 md:-right-1  ">
      <div className=" relative  w-52 h-24 ">
        <Link
          to="/"
          className="z-10 cursor-pointer absolute  bg-zinc-300 hover:bg-zinc-400 ease-in-out duration-200 px-[135px] py-1 rotate-[45deg] ">
          <p className="text-center text-zinc-500 text-[10px]">Powered by</p>
          <div className=" text-primary text-sm font-semibold">
            Calend<span className=" text-secondary">Me</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CalendMeBadge
