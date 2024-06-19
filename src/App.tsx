// import { Button } from './components/ui/button'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import RegisterPage from './pages/Auth/Register'
import LoginPage from './pages/Auth/Login'
import DashboardPage from './pages/Dashboard'
import OneOffPage from './pages/Dashboard/OneOff'
import MeetingPollPage from './pages/Dashboard/MeetingPoll'
import AvailabilityPage from './pages/Dashboard/Availability'
import DashboardHomePage from './pages/Dashboard/Home'
import NewEvent from './pages/Dashboard/NewEvent'
import { AuthProvider } from './context/authContext'
import NotFoundPage from './pages/NotFound'
import UserEventProfile from './pages/UserEvents/UserEventProfile'
import UserEventPage from './pages/UserEvents/UserEventPage'
import HomePage from './pages/HomePage'
import ConfirmMeetingPage from './pages/UserEvents/ConfirmMeeting'
import ScheduleSuccessPage from './pages/UserEvents/ScheduleSuccess'
import PublicRouter from './routes/PublicRouter'
import RescheduleMeetingPage from './pages/UserEvents/RescheduleMeeting'
import AuthPage from './pages/Auth'
import RescheduleConfirmPage from './pages/UserEvents/RescheduleConfirm'

import OneoffSchedulePage from './pages/Dashboard/OneOff/OneoffSchedule'
import EditEventPage from './pages/Dashboard/Home/EventType/EditEvent'
import NewOneoffPage from './pages/Dashboard/OneOff/NewOneOff'
import OneoffScheduleConfirmPage from './pages/Dashboard/OneOff/OneoffScheduleConfirm'
import OneoffReschedulePage from './pages/Dashboard/OneOff/OneoffReschedule'
import UpgradePage from './pages/Dashboard/Upgrade'
import MeetingPollConfirm from './pages/Dashboard/MeetingPoll/MeetingPollConfirm'
import MeetingPollSchedulePage from './pages/Dashboard/MeetingPoll/MeetingPollSchedule'
import CalendarEventConfirm from './components/dashboard/CalendarEventConfirm'
import PrivateRouter from './routes/PrivateRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRouter>
                <HomePage />
              </PublicRouter>
            }
          />
          <Route path="/:userUrl" element={<UserEventProfile />} />
          <Route path="/:userUrl/:eventTitle" element={<UserEventPage />} />
          <Route
            path="/:userUrl/:meetingType/:date"
            element={<ConfirmMeetingPage />}
          />
          <Route
            path="/:userUrl/:meetingType/invitees/:meetingId"
            element={<ScheduleSuccessPage />}
          />
          <Route
            path="/reschedule/:meetingId"
            element={<RescheduleMeetingPage />}
          />
          <Route
            path="/d/reschedule/:meetingId"
            element={<OneoffReschedulePage />}
          />
          <Route
            path="/reschedule/:meetingId/:date"
            element={<RescheduleConfirmPage />}
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/auth/register"
            element={
              <PublicRouter>
                <RegisterPage />
              </PublicRouter>
            }
          />
          <Route
            path="/auth/login"
            element={
              <PublicRouter>
                <LoginPage />
              </PublicRouter>
            }
          />
          <Route path="/d/:oneoffTitle" element={<OneoffSchedulePage />} />
          <Route path="/m/:oneoffTitle" element={<MeetingPollSchedulePage />} />
          <Route
            path="/d/:oneoffTitle/:date"
            element={<OneoffScheduleConfirmPage />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRouter>
                <DashboardPage />
              </PrivateRouter>
            }>
            <Route index element={<DashboardHomePage />} />
            <Route path="one-off" element={<OneOffPage />} />
            <Route path="one-off/new" element={<NewOneoffPage />} />
            <Route
              path="one-off/confirm"
              element={<CalendarEventConfirm title="one-off" />}
            />
            <Route path="meetingpoll" element={<MeetingPollPage />} />
            <Route
              path="meetingpoll/confirm"
              element={<MeetingPollConfirm />}
            />
            <Route path="calendar" element={<AvailabilityPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="create-event" element={<NewEvent />} />
            <Route path="edit/:eventId" element={<EditEventPage />} />
          </Route>
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
