import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    features: 'Meeting polls',
    FREE: Check,
    STANDARD: Check,
    TEAMS: Check,
  },
  {
    features: 'One-on-ones',
    FREE: Check,
    STANDARD: Check,
    TEAMS: Check,
  },
  {
    features: 'Group event types',
    FREE: null,
    STANDARD: Check,
    TEAMS: Check,
  },
  {
    features: 'Email notifications for bookings and cancellations',
    FREE: null,
    STANDARD: Check,
    TEAMS: Check,
  },
  {
    features: 'Create forms and route invitees based on answers',
    FREE: null,
    STANDARD: null,
    TEAMS: Check,
  },
] as const

const UpgradePage = () => {
  return (
    <div className="flex  flex-col justify-center items-center py-6 ">
      <h1 className=" text-xl font-semibold pb-6 text-center">
        Choose a plan that fits
      </h1>
      <div className=" w-full shadow-lg  ring-1 ring-zinc-200 bg-white rounded-xl p-6  max-w-[680px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-900 font-semibold w-[200px]  align-top">
                Core Features
              </TableHead>
              <TableHead className="text-zinc-900 text-center align-top">
                <div>
                  <h2 className="font-semibold ">Free Plan</h2>
                  <p>$0</p>
                </div>
              </TableHead>
              <TableHead className="text-zinc-900 text-center align-top">
                <div>
                  <h2 className="font-semibold  ">STANDARD</h2>
                  <p className="pb-2">$9.99</p>
                  <Link
                    to="/upgrade"
                    className=" font-semibold my-3 hover:underline text-blue-600">
                    Select
                  </Link>
                </div>
              </TableHead>
              <TableHead className="text-zinc-900 text-center align-top">
                <div>
                  <h2 className="font-semibold  ">TEAMS</h2>
                  <p className="pb-2">$19.99</p>
                  <Link
                    to="/upgrade"
                    className=" font-semibold my-3 hover:underline text-blue-600">
                    Select
                  </Link>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((invoice) => (
              <TableRow key={invoice.features}>
                <TableCell className="font-medium">
                  {invoice.features}
                </TableCell>
                <TableCell className="">
                  <div className="  flex justify-center">
                    {invoice.FREE && (
                      <invoice.FREE className="w-5 h-5 text-white rounded-full bg-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="  flex justify-center">
                    {invoice.STANDARD && (
                      <invoice.STANDARD className="w-5 h-5 text-white rounded-full bg-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {invoice.TEAMS && (
                      <invoice.TEAMS className="w-5 h-5 text-white rounded-full bg-green-500" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default UpgradePage
