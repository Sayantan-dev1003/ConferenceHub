import React, { useEffect, useState } from 'react';
import Sidebar4 from './SideBar4';
import axios from 'axios';

const ReviewHistory = () => {
    const [papers, setPapers] = useState([]);
    const [conferenceTitles, setConferenceTitles] = useState({});

    useEffect(() => {
        const fetchPapersAndConferences = async () => {
            try {
                const paperResponse = await axios.get('/api/reviewer/history');
                const paperData = paperResponse.data.papers;

                setPapers(paperData);

                const uniqueConferenceIds = [...new Set(paperData.map(p => p.conferenceId))];

                const titlePromises = uniqueConferenceIds.map(async (confId) => {
                    try {
                        const response = await axios.get(`/api/conference/${confId}`);
                        return { confId, title: response.data.title };
                    } catch (error) {
                        console.error(`Error fetching title for conference ${confId}:`, error);
                        return { confId, title: 'Unknown Conference' };
                    }
                });

                const resolvedTitles = await Promise.all(titlePromises);
                const titleMap = {};
                resolvedTitles.forEach(({ confId, title }) => {
                    titleMap[confId] = title;
                });

                setConferenceTitles(titleMap);
            } catch (error) {
                console.error("Error fetching papers:", error);
            }
        };

        fetchPapersAndConferences();
    }, []);

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar4 />

            <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 bg-white p-6 shadow-lg'>
                    <h1 className="text-2xl font-bold mb-1 montserrat text-center">Evaluation History</h1>
                    <p className='text-sm font-medium montserrat text-gray-500 text-center'>
                        A comprehensive record of all manuscripts reviewed by you, detailing your past evaluations, comments, and decisions for each assigned paper.
                    </p>
                </div>

                <div className='mt-6 text-sm'>
                    <table className='w-full table-auto bg-white shadow-lg rounded-lg'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 text-center text-gray-600 font-semibold'>Title</th>
                                <th className='px-4 py-2 text-center text-gray-600 font-semibold'>Conference Name</th>
                                <th className='px-4 py-2 text-center text-gray-600 font-semibold'>Submission Date</th>
                                <th className='px-4 py-2 text-center text-gray-600 font-semibold'>Deadline Date</th>
                                <th className='px-4 py-2 text-center text-gray-600 font-semibold'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.map((paper) => (
                                <tr key={paper._id} className='border-b border-gray-200'>
                                    <td className='px-4 py-2 text-center'>{paper.title}</td>
                                    <td className='px-4 py-2 text-center'>
                                        {conferenceTitles[paper.conferenceId] || 'Loading...'}
                                    </td>
                                    <td className='px-4 py-2 text-center'>
                                        {new Date(paper.submissionDate).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className='px-4 py-2 text-center'>
                                        {new Date(paper.deadlineDate).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className='px-4 py-2 text-center'>{paper.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewHistory;