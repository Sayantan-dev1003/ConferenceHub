import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from './Pages/Hero'
import AttendeeDashBoard from './Pages/AttendeeDashBoard'
import SpeakerDasboard from './Pages/SpeakerDasboard'
import PublisherDashboard from './Pages/PublisherDashboard'
import ReviewerDashboard from './Pages/ReviewerDashboard'

import ConferenceDashboard from './Pages/ConferenceDashboard'
import ConferenceForm1 from './Components/Conference/ConferenceForm1'
import ConferenceForm2 from './Components/Conference/ConferenceForm2'
import ConferenceForm3 from './Components/Conference/ConferenceForm3'
import ManageConference from './Components/Conference/ManageConference'
import ViewSubmissions from './Components/Conference/ViewSubmissions'
import AssignReviewers from './Components/Conference/AssignReviewers'
import ManageReviewers from './Components/Conference/ManageReviewers'
import AttendeeManagement from './Components/Conference/AttendeeManagement'
import SpeakerManagement from './Components/Conference/SpeakerManagement'
import Settings from './Components/Conference/Settings'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Hero />}></Route>
        <Route path='/attendee-dashboard' element={<AttendeeDashBoard />}></Route>
        <Route path='/speaker-dashboard' element={<SpeakerDasboard />}></Route>

        <Route path='/conference-dashboard' element={<ConferenceDashboard />}></Route>
        <Route path='/create-conference/1' element={<ConferenceForm1 />}></Route>
        <Route path='/create-conference/2' element={<ConferenceForm2 />}></Route>
        <Route path='/create-conference/3' element={<ConferenceForm3 />}></Route>
        <Route path='/manage-conference' element={<ManageConference />}></Route>
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