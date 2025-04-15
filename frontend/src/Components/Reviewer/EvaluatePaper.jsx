import React, { useState } from 'react';
import Sidebar4 from './SideBar4';
import { Link } from 'react-router-dom';
import EvaluationForm from './EvaluationForm';

const EvaluatePapers = () => {
    const [selectedSection, setSelectedSection] = useState("originality");

    const sectionLinks = [
        { key: "originality", title: "Originality & Novelty", path: "/originality-novelty" },
        { key: "technical", title: "Technical Soundness", path: "/technical-soundness" },
        { key: "literature", title: "Literature Review & References", path: "/literature-review-references" },
        { key: "clarity", title: "Clarity & Presentation", path: "/clarity-presentation" },
        { key: "validation", title: "Experimental Validation", path: "/experimental-validation" },
        { key: "impact", title: "Significance & Impact", path: "/significance-impact" },
        { key: "ethics", title: "Ethical Considerations", path: "/ethical-considerations" },
        { key: "completeness", title: "Completeness", path: "/completeness" },
        { key: "feedbacks", title: "Feedbacks and Comments", path: "/feedbacks-comments" },
        { key: "final", title: "Final Judgment", path: "/final-judgment" }
    ];

    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar4 />
            <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
                    <h1 className="text-2xl font-bold mb-1 montserrat text-center">Papers Under Review</h1>
                    <p className='text-base font-medium montserrat text-gray-500 text-center'>
                        Manage and track the manuscripts currently assigned to you. Begin reviewing or check deadlines for each paper.
                    </p>
                </div>

                <div className='mt-2 w-full flex gap-4'>
                    <ul className='bg-white p-4 rounded-lg shadow-md'>
                        {sectionLinks.map(link => (
                            <li key={link.key} className="my-1">
                                <button
                                    onClick={() => setSelectedSection(link.key)}
                                    className="block p-2 w-full text-left hover:bg-gray-200 rounded"
                                >
                                    {link.title}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className='w-full'>
                        <EvaluationForm selectedSection={selectedSection} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluatePapers;