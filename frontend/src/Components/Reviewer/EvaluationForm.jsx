import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate

const criteria = [
    {
        title: "Originality & Novelty",
        key: "originality",
        questions: [
            "Does the paper propose novel concepts or methodologies?",
            "Is the problem tackled in a unique or creative way?",
            "Does the work advance the current state of the art?"
        ]
    },
    {
        title: "Technical Soundness",
        key: "technical",
        questions: [
            "Are the methodologies used appropriate?",
            "Are the results reproducible?",
            "Are all claims supported by evidence?"
        ]
    },
    {
        title: "Literature Review & References",
        key: "literature",
        questions: [
            "Does the paper include recent and relevant literature?",
            "Is the related work clearly distinguished?",
            "Is there an adequate explanation of how the work builds on previous research?"
        ]
    },
    {
        title: "Clarity & Presentation",
        key: "clarity",
        questions: [
            "Is the paper well-structured and clearly written?",
            "Are figures/tables clear and labeled?",
            "Is the abstract informative and accurate?"
        ]
    },
    {
        title: "Experimental Validation",
        key: "validation",
        questions: [
            "Are the experiments well-designed?",
            "Are datasets or sources clearly mentioned?",
            "Are the metrics and comparisons appropriate?"
        ]
    },
    {
        title: "Significance & Impact",
        key: "impact",
        questions: [
            "Does the work solve a significant problem?",
            "Is the potential impact discussed?"
        ]
    },
    {
        title: "Ethical Considerations",
        key: "ethics",
        questions: [
            "Are ethical guidelines followed?",
            "Is there no sign of plagiarism or misconduct?"
        ]
    },
    {
        title: "Completeness",
        key: "completeness",
        questions: [
            "Is the paper complete in terms of sections and data?",
            "Are all components (references, figures, etc.) present?"
        ]
    }
];

const EvaluationForm = ({ paperId }) => {
    const [responses, setResponses] = useState({});
    const [comments, setComments] = useState('');
    const [results, setResults] = useState(null);
    const [step, setStep] = useState(0); // current step
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleChange = (sectionKey, qIndex, value) => {
        setResponses((prev) => ({
            ...prev,
            [`${sectionKey}-${qIndex}`]: value
        }));
    };

    const allQuestionsAnswered = () => {
        return criteria.every(({ key, questions }) =>
            questions.every((_, idx) => responses[`${key}-${idx}`])
        );
    };

    const handleSubmit = async () => {
        if (!allQuestionsAnswered()) return;

        const scoreSummary = {};
        let totalYes = 0;
        let totalQuestions = 0;

        criteria.forEach(({ key, questions }) => {
            let yesCount = 0;
            questions.forEach((_, index) => {
                const res = responses[`${key}-${index}`];
                if (res === 'yes') yesCount++;
            });
            totalYes += yesCount;
            totalQuestions += questions.length;

            scoreSummary[key] = {
                total: questions.length,
                yes: yesCount,
                percentage: ((yesCount / questions.length) * 100).toFixed(0)
            };
        });

        const overallPercentage = ((totalYes / totalQuestions) * 100).toFixed(0);
        let verdict = "";

        if (overallPercentage >= 90) verdict = "Strong Accept";
        else if (overallPercentage >= 80) verdict = "Accept";
        else if (overallPercentage >= 70) verdict = "Weak Accept";
        else if (overallPercentage >= 60) verdict = "Borderline";
        else if (overallPercentage >= 50) verdict = "Weak Reject";
        else verdict = "Reject";

        const evaluationResults = {
            score: overallPercentage,
            verdict,
            comments,
            paperId
        };

        try {
            const response = await fetch('/api/evaluation-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(evaluationResults)
            });

            if (!response.ok) {
                throw new Error('Failed to submit evaluation');
            }

            const data = await response.json();
            console.log(data);
            setResults(evaluationResults);

            // Navigate to the review history page after form submission
            navigate('/review-history');
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

    const currentCriteria = criteria[step];

    return (
        <div className="w-full openSans">
            {!results && (
                step < criteria.length ? (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4 montserrat">{currentCriteria.title}</h3>
                        {currentCriteria.questions.map((q, idx) => (
                            <div key={idx} className="mb-4">
                                <p className="mb-2">{q}</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`${currentCriteria.key}-${idx}`}
                                            value="yes"
                                            checked={responses[`${currentCriteria.key}-${idx}`] === 'yes'}
                                            onChange={(e) => handleChange(currentCriteria.key, idx, e.target.value)}
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`${currentCriteria.key}-${idx}`}
                                            value="no"
                                            checked={responses[`${currentCriteria.key}-${idx}`] === 'no'}
                                            onChange={(e) => handleChange(currentCriteria.key, idx, e.target.value)}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setStep((prev) => prev + 1)}
                            disabled={currentCriteria.questions.some((_, idx) => !responses[`${currentCriteria.key}-${idx}`])}
                            className={`mt-4 ${currentCriteria.questions.some((_, idx) => !responses[`${currentCriteria.key}-${idx}`])
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer'
                                } text-white px-4 py-2 rounded-md`}
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-4">Feedbacks and Comments</h3>
                        <textarea
                            className="w-full h-32 p-2 border rounded-md"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Write your overall feedback here..."
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!allQuestionsAnswered()}
                            className={`mt-4 ${!allQuestionsAnswered()
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer'
                                } text-white px-4 py-2 rounded-md`}
                        >
                            Submit Evaluation
                        </button>
                    </div>
                )
            )}

            {results && (
                <div className="p-4 bg-blue-100 rounded-lg">
                    <h4 className="text-lg font-bold mb-2">Final Judgement</h4>
                    <p className="mt-4">
                        <span className="font-semibold">Overall Score:</span> {results.score}%
                    </p>
                    <p>
                        <span className="font-semibold">Verdict:</span> {results.verdict}
                    </p>
                    <p className="mt-2">
                        <span className="font-semibold">Reviewer Comments:</span><br />
                        {results.comments || "No comments provided."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default EvaluationForm;