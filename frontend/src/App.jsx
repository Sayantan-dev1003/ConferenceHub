import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from './Pages/Hero'
import AttendeeDashBoard from './Pages/AttendeeDashBoard'
import SpeakerDasboard from './Pages/SpeakerDasboard'
import ConferenceDashboard from './Pages/ConferenceDashboard'
import PublisherDashboard from './Pages/PublisherDashboard'
import ReviewerDashboard from './Pages/ReviewerDashboard'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Hero />}></Route>
      <Route path='/attendee-dashboard' element={<AttendeeDashBoard />}></Route>
      <Route path='/speaker-dashboard' element={<SpeakerDasboard />}></Route>
      <Route path='/conference-dashboard' element={<ConferenceDashboard />}></Route>
      <Route path='/publisher-dashboard' element={<PublisherDashboard />}></Route>
      <Route path='/reviewer-dashboard' element={<ReviewerDashboard />}></Route>
    </Routes>
  )
}

export default App