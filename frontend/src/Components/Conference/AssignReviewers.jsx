import React, { useEffect, useState } from 'react';
import Sidebar1 from './Sidebar1';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import { faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'react-router-dom';

const AssignReviewer = () => {
  const [reviewers, setReviewers] = useState([]);
  const { paperId } = useParams();

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await axios.get(`/reviewers`);
        setReviewers(response.data);
      } catch (error) {
        console.error('Error fetching speakers:', error);
      }
    };

    fetchReviewers();
  }, []);

  const handleAssign = async (reviewerId) => {
    try {
      console.log("Paperid: ", paperId);
      console.log("reviewerId: ", reviewerId);
      const response = await axios.post(`/assign-reviewer/${paperId}/${reviewerId}`);
      alert(response.data.message);
    } catch (error) {
      console.error('Assignment failed:', error);
      alert("Failed to assign reviewer.");
    }
  };
  console.log("Reviewers: ", reviewers)

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar1 />
      <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
        <h1 className="text-3xl font-bold mb-1 montserrat text-center">Assign Paper Reviewers</h1>
        <p className='text-lg font-medium montserrat text-gray-500 text-center'>Seamlessly assign expert reviewers to conference papers, streamline the peer review process, and ensure high-quality feedback with intelligent reviewer matching tools!</p>
        <div className='mt-4'>
          <h2 className="text-2xl font-semibold text-center mb-2">Reviewers</h2>
          <div className='flex flex-wrap justify-start'>
            {Array.isArray(reviewers) && reviewers.map((reviewer) => (
              <div key={reviewer._id} className='w-[48%] m-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:shadow-lg transition duration-200 flex flex-col justify-between'>
                <div>
                  <div className='flex justify-between items-end'>
                    <h3 className="text-xl font-semibold montserrat">{reviewer.fullname}, <span className='text-xs font-light italic'>{reviewer.affiliation}</span></h3>
                    <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110 hover:shadow-lg transition-transform duration-300 text-white px-2 py-1 rounded text-xs cursor-pointer mt-4' onClick={() => handleAssign(reviewer._id)}>Assign <FontAwesomeIcon icon={faPaperPlane} /></button>
                  </div>
                  <p className='text-xs text-gray-500 mt-2'>{reviewer.areaOfInterest}</p>
                  <p className='text-xs text-gray-500'><FontAwesomeIcon icon={faEnvelope} className='mr-2 text-gray-400' />{reviewer.email}</p>
                  <p className='text-xs text-gray-500'><FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-400' />{reviewer.phone}</p>
                </div>
                {/* <div className='flex gap-2 justify-end'>
                  <span className='text-gray-400 text-sm'>Follow on:</span>
                  <span className='text-gray-400 text-sm'><a href={reviewer.socialMediaLinks.twitter}><FontAwesomeIcon icon={faTwitter} /></a></span>
                  <span className='text-gray-400 text-sm'><a href={reviewer.socialMediaLinks.linkedin}><FontAwesomeIcon icon={faLinkedin} /></a></span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewer;