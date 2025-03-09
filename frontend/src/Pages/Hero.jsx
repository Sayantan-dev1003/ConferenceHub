import React from 'react'
import Home from './Home'
import About from './About'
import Registration from './Registration'
import CreateConf from './CreateConf'
import Paper from './Paper'
import Contact from './Contact'
import Footer from '../Components/Footer'

const Hero = () => {
  return (
    <>
      <div id='home'><Home /></div>
      <div id='about'><About /></div>
      <div id='event-registration'><Registration /></div>
      <div id='session-conference'><CreateConf /></div>
      <div id='paper-submission'><Paper /></div>
      <div id='contact'><Contact /></div>
      <div id='footer'><Footer /></div>
    </>
  )
}

export default Hero