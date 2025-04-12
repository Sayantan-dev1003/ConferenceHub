import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Signup from "../Components/Signup";
import Signin from "../Components/Signin";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-[rgba(17,22,28,0.8)] fixed w-full z-50 py-3.5 px-6 montserrat text-lg shadow-md backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <ScrollLink to="home" smooth={true} className="text-3xl font-bold text-white moonDance cursor-pointer">
            ConferenceHub
          </ScrollLink>

          <div className="flex gap-8 items-center">
            <ScrollLink to="home" smooth={true} className="text-white hover:text-blue-400 font-medium cursor-pointer transition-colors duration-300">
              Home
            </ScrollLink>
            <ScrollLink to="about" smooth={true} className="text-white hover:text-blue-400 font-medium cursor-pointer transition-colors duration-300">
              About
            </ScrollLink>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                className="text-white hover:text-blue-400 font-medium flex items-center gap-1 cursor-pointer transition-colors duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Services {" "}<FontAwesomeIcon icon={faChevronDown} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <ul className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <li>
                    <ScrollLink to="event-registration" smooth={true} className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition hover:rounded-t-lg cursor-pointer">Event Registration</ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="session-conference" smooth={true} className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition cursor-pointer">Session Conference</ScrollLink>
                  </li>
                  <li>
                    <ScrollLink to="paper-submission" smooth={true} className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition hover:rounded-b-lg cursor-pointer">Paper Submission</ScrollLink>
                  </li>
                </ul>
              )}
            </div>

            <ScrollLink to="contact" smooth={true} className="text-white hover:text-blue-400 font-medium cursor-pointer transition-colors duration-300">
              Contact
            </ScrollLink>

            <div className="p-[2px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block transition-transform duration-300 shadow-lg">
              <button
                className="bg-[#11161ce0] rounded-full text-white text-sm px-[22px] py-[6px] font-semibold cursor-pointer w-full h-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
                onClick={() => navigate("/paper-archives")}
              >
                Browse Papers
              </button>
            </div>
            <div className='p-[2px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full inline-block transition-transform duration-300 shadow-lg'>
              <button className="bg-[#11161ce0] rounded-full text-white text-sm px-[22px] py-[6px] font-semibold cursor-pointer w-full h-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600" onClick={() => setIsSignupOpen(true)}>
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isSignupOpen && <Signup setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
      {isSigninOpen && <Signin setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
    </>
  );
};

export default Navbar;
