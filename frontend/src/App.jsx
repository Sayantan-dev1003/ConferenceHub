import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from './Pages/Hero'

import AttendeeDashBoard from './Pages/AttendeeDashBoard'
import Events from "./Components/Attendee/Events"
import ExploreEvents from "./Components/Attendee/ExploreEvents"
import Feedback from "./Components/Attendee/Feedback"
import SettingsA from "./Components/Attendee/Settings"
import ViewEvent from "./Components/Attendee/ViewEvent"
import RegisterEvent from "./Components/Attendee/RegisterEvent"

import SpeakerDasboard from './Pages/SpeakerDasboard'
import Sessions from "./Components/Speaker/Sessions"
import SessionsAnalytics from "./Components/Speaker/SessionAnalytics"
import FeedbackSpeaker from "./Components/Speaker/Feedback"
import SettingsSpeaker from "./Components/Speaker/Settings"

import PublisherDashboard from './Pages/PublisherDashboard'
import ReviewerDashboard from './Pages/ReviewerDashboard'

import ConferenceDashboard from './Pages/ConferenceDashboard'
import ManageConference from './Components/Conference/ManageConference'
import ConferenceDetail from './Components/Conference/ConferenceDetail';
import ViewSubmissions from './Components/Conference/ViewSubmissions'
import AssignReviewers from './Components/Conference/AssignReviewers'
import ManageReviewers from './Components/Conference/ManageReviewers'
import AttendeeManagement from './Components/Conference/AttendeeManagement'
import SpeakerManagement from './Components/Conference/SpeakerManagement'
import Settings from './Components/Conference/Settings'
import ConferenceForm from './Components/Conference/ConferenceForm'
import EditConference from "./Components/Conference/EditConference"

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Hero />}></Route>

        <Route path='/attendee-dashboard' element={<AttendeeDashBoard />}></Route>
        <Route path='/attendee-events' element={<Events />}></Route>
        <Route path='/attendee-explore' element={<ExploreEvents />}></Route>
        <Route path='/attendee-feedback' element={<Feedback />}></Route>
        <Route path='/attendee-settings' element={<SettingsA />}></Route>
        <Route path='/view-attendee/:id' element={<ViewEvent />}></Route>
        <Route path='/register-attendee/:id' element={<RegisterEvent />}></Route>

        <Route path='/speaker-dashboard' element={<SpeakerDasboard />}></Route>
        <Route path='/my-sessions' element={<Sessions />}></Route>
        <Route path='/session-analytics' element={<SessionsAnalytics />}></Route>
        <Route path='/feedback-reviews' element={<FeedbackSpeaker />}></Route>
        <Route path='/speaker-settings' element={<SettingsSpeaker />}></Route>

        <Route path='/conference-dashboard' element={<ConferenceDashboard />}></Route>
        <Route path='/create-conference' element={<ConferenceForm />}></Route>
        <Route path='/manage-conference' element={<ManageConference />}></Route>
        <Route path="/conference/:id" element={<ConferenceDetail />} />
        <Route path="/edit-conference/:id" element={<EditConference />} />
        <Route path='/view-submissions' element={<ViewSubmissions />}></Route>
        <Route path='/assign-reviewers' element={<AssignReviewers />}></Route>
        <Route path='/manage-reviewers' element={<ManageReviewers />}></Route>
        <Route path='/attendee-management' element={<AttendeeManagement />}></Route>
        <Route path='/speaker-management' element={<SpeakerManagement />}></Route>
        <Route path='/settings' element={<Settings />}></Route>



        <Route path='/publisher-dashboard' element={<PublisherDashboard />}></Route>
        <Route path='/reviewer-dashboard' element={<ReviewerDashboard />}></Route>
      </Routes>
    </>
  )
}

export default App