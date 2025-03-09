import React from "react";
import { Link as ScrollLink } from 'react-scroll';
import conferenceBG from "../assets/ConferenceBG.jpg";
import Navbar from "../Components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div
        className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 backdrop-blur-md brightness-90"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url(${conferenceBG})`
        }}
      >
        {/* Content Box */}
        <div className="w-4/5 rounded-xl p-8 text-center mt-32">
          <h1 className="text-7xl font-bold text-blue-200 mb-4 montserrat" style={{textShadow: "3px 3px 5px rgba(0, 0, 0, 0.8)"}}>
            Transform the Way You Organize Conferences
          </h1>
          <p className="text-3xl text-blue-200 mb-16 font-semibold montserrat" style={{textShadow: "3px 3px 5px rgba(0, 0, 0, 0.8)"}}>
            Smart, Simple, and Seamless Event Management.
          </p>

          {/* Button */}
          <ScrollLink to="about" smooth={true} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-8 py-3 rounded-full text-xl font-semibold cursor-pointer">
            Get Started
          </ScrollLink>
        </div>
      </div>
    </>
  );
};

export default Home;