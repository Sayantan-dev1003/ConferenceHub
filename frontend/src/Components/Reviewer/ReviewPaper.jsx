import React, { useEffect, useState } from 'react'
import Sidebar4 from './SideBar4'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AssignedPapers = () => {

    const [papers, setPapers] = useState([]);
    const [conferenceNames, setConferenceNames] = useState({});
    const [speakerNames, setSpeakerNames] = useState({});
    const { paperId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get(`/api/reviewer/paper-review/${paperId}`);
                setPapers(response.data.papers);
            } catch (error) {
                console.error('Error fetching papers:', error);
            }
        };

        fetchPapers();
    }, [paperId]); // Added paperId as a dependency to trigger the effect when paperId changes

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

    const downloadPaper = (paper) => {
        try {
            // Extract the raw byte array
            const byteArray = new Uint8Array(paper.file.data.data);

            // Create a Blob using the contentType
            const blob = new Blob([byteArray], { type: paper.file.contentType });

            // Determine file extension from contentType
            const mimeToExtension = {
                'application/pdf': 'pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'application/msword': 'doc',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
                'application/vnd.ms-powerpoint': 'ppt'
            };

            const extension = mimeToExtension[paper.file.contentType] || 'file';

            // Generate filename
            const filename = `${paper.title || 'paper'}.${extension}`;

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error while downloading the file:', error);
            alert('Something went wrong while downloading the file.');
        }
    };

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar4 />
            <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
                    <h1 className="text-2xl font-bold mb-1 montserrat text-center">Papers Under Review</h1>
                    <p className='text-base font-medium montserrat text-gray-500 text-center'>Manage and track the manuscripts currently assigned to you. Begin reviewing or check deadlines for each paper.</p>
                </div>

                <div className='mt-4 w-full'>
                    <div className='flex flex-wrap justify-start w-full'>
                        {Array.isArray(papers) && papers.map((paper) => (
                            <div key={paper._id} className='w-full space-y-5'>
                                <div className='w-full bg-white rounded-lg shadow-md p-6 space-y-2.5'>
                                    <h3 className="text-lg font-semibold montserrat">{paper.title}</h3>
                                    <p className="text-gray-500 text-sm mt-4"><span className='font-semibold'>Conference: </span>{conferenceNames[paper.conferenceId]}</p>
                                    <p className="text-gray-500 text-sm"><span className='font-semibold'>Submitted by: </span>{speakerNames[paper.speakerId]}</p>
                                    <p className='text-sm text-gray-500'><span className='font-semibold'>Status: </span>{paper.status}</p>
                                    <p className="text-gray-500 text-sm"><span className='font-semibold'>Submitted on: </span>{new Date(paper.submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                    <p className="text-gray-500 text-sm"><span className='font-semibold'>Review deadline: </span>{new Date(paper.deadlineDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className='w-full bg-white rounded-lg shadow-md p-6'>
                                    <h3 className="text-lg font-semibold montserrat">Abstract</h3>
                                    <p className="text-gray-500 text-sm">{paper.abstract}</p>
                                </div>
                                <div className='space-x-5'>
                                    <button onClick={() => downloadPaper(paper)} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[1rem] py-2 rounded-lg font-medium cursor-pointer'>Download Paper</button>
                                    <button onClick={() => navigate(`/evaluate-paper/${paper._id}`)} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white text-base px-[1rem] py-2 rounded-lg font-medium cursor-pointer'>Start Evaluation</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssignedPapers;