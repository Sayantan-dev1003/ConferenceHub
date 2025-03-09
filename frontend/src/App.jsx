import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Hero from './Pages/Hero'
import Feed from './Pages/Feed'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Hero />}></Route>
      <Route path='/feed' element={<Feed />}></Route>
    </Routes>
  )
}

export default App