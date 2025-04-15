import React, { useEffect, useState } from 'react'
import Sidebar4 from './SideBar4'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AssignedPapers = () => {
  const [papers, setPapers] = useState([]);
  const [conferenceNames, setConferenceNames] = useState({});
  const [speakerNames, setSpeakerNames] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get('/api/reviewer/assigned-papers');
        setPapers(response.data.papers);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, []);

  useEffect(() => {
    const fetchConferenceNames = async () => {
      try {
        const conferenceIds = papers.map(paper => paper.conferenceId);
        const responses = await Promise.all(conferenceIds.map(id => axios.get(`/api/conference/${id}`)));
        const conferenceNames = responses.reduce((acc, response, index) => ({ ...acc, [conferenceIds[index]]: response.data.title }), {});
        setConferenceNames(conferenceNames);
      } catch (error) {
        console.error('Error fetching conference names:', error);
      }
    };

    const fetchSpeakerNames = async () => {
      try {
        const speakerIds = papers.map(paper => paper.speakerId);
        const responses = await Promise.all(speakerIds.map(id => axios.get(`/api/speaker/paper/${id}`)));
        const speakerNames = responses.reduce((acc, response, index) => ({ ...acc, [speakerIds[index]]: response.data.fullname }), {});
        setSpeakerNames(speakerNames);
      } catch (error) {
        console.error('Error fetching speaker names:', error);
      }
    };

    if (papers.length > 0) {
      fetchConferenceNames();
      fetchSpeakerNames();
    }
  }, [papers]);

  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar4 />
      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
          <h1 className="text-2xl font-bold mb-1 montserrat text-center">Papers Under Review</h1>
          <p className='text-base font-medium montserrat text-gray-500 text-center'>Manage and track the manuscripts currently assigned to you. Begin reviewing or check deadlines for each paper.</p>
        </div>

        <div className='mt-4'>
          <div className='flex flex-wrap justify-start'>
            {Array.isArray(papers) && papers.map((paper) => (
              <div key={paper._id} className='w-[48%] m-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:shadow-lg transition duration-200 flex flex-col justify-between'>
                <div>
                  <h3 className="text-xl font-semibold montserrat">{paper.title}</h3>
                  <p className="text-gray-500 text-xs mt-3"><span className='font-semibold'>Conference: </span>{conferenceNames[paper.conferenceId]}</p>
                  <p className="text-gray-500 text-xs"><span className='font-semibold'>Submitted by: </span>{speakerNames[paper.speakerId]}</p>
                  <p className='text-xs text-gray-500'><span className='font-semibold'>Status: </span>{paper.status}</p>
                  <p className="text-gray-500 text-xs"><span className='font-semibold'>Submitted on: </span>{new Date(paper.submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                  <p className="text-gray-500 text-xs"><span className='font-semibold'>Review deadline: </span>{new Date(paper.deadlineDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className='flex gap-2 justify-end'>
                  <button className='py-1 px-2.5 rounded-lg text-xs shadow cursor-pointer text-blue-900 font-medium bg-gradient-to-r from-blue-300 to-violet-300 hover:from-blue-400 hover:to-violet-400' onClick={() => navigate(`/review-paper/${paper._id}`)}>View More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignedPapers;