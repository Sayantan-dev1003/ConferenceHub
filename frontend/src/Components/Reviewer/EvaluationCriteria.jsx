import React from 'react'
import Sidebar4 from './SideBar4'

const EvaluationCriteria = () => {
  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar4 />
      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <div className='w-full sticky top-0 right-0 z-50 border-b-2 pb-4 mb-4 border-b-gray-300'>
          <h1 className="text-2xl font-bold mb-1 montserrat text-center">Paper Evaluation Criteria</h1>
          <p className='text-base font-medium montserrat text-gray-500 text-center'>Submitted manuscripts are assessed rigorously to ensure the highest standards of scholarly contribution, technical soundness, and presentation quality. The evaluation process is based on the following core criteria:</p>
        </div>

        <div className='w-full flex flex-col gap-4 text-gray-700'>
          {/* 1. Originality and Novelty */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">1. Originality and Novelty</h2>
            <p className="text-sm font-medium">The degree to which the paper presents new and innovative ideas, approaches, or results.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Does the paper propose novel concepts or methodologies?</li>
              <li>Is the problem tackled in a unique or creative way?</li>
              <li>Does the work advance the current state of the art?</li>
            </ul>
          </div>

          {/* 2. Technical Soundness */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">2. Technical Soundness</h2>
            <p className="text-sm font-medium">The correctness, rigor, and appropriateness of the methodologies, models, or analyses used.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Are the assumptions valid and well-justified?</li>
              <li>Are the experiments or theoretical analyses well-designed and correctly executed?</li>
              <li>Are the conclusions logically supported by the results?</li>
            </ul>
          </div>

          {/* 3. Significance and Impact */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">3. Significance and Impact</h2>
            <p className="text-sm font-medium">The potential influence of the work on the field, industry, or future research.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Does the work address a significant or relevant problem?</li>
              <li>Can the findings benefit the broader scientific or engineering community?</li>
              <li>Does the paper open avenues for further research or applications?</li>
            </ul>
          </div>

          {/* 4. Clarity and Organization */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">4. Clarity and Organization</h2>
            <p className="text-sm font-medium">The overall quality of writing, structure, and presentation of the manuscript.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Is the paper clearly written and logically structured?</li>
              <li>Are the objectives, methodology, results, and conclusions easy to follow?</li>
              <li>Are illustrations, figures, and tables relevant, well-labeled, and informative?</li>
            </ul>
          </div>

          {/* 5. Literature Review and Related Work */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">5. Literature Review and Related Work</h2>
            <p className="text-sm font-medium">The thoroughness with which previous relevant work is reviewed and positioned.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Does the paper acknowledge and critically engage with existing research?</li>
              <li>Are key references included and discussed?</li>
              <li>Is the proposed work clearly situated in the context of prior studies?</li>
            </ul>
          </div>

          {/* 6. Experimental Evaluation / Results */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">6. Experimental Evaluation / Results</h2>
            <p className="text-sm font-medium">The design, execution, and reporting of experiments or simulations.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Are the experiments reproducible and statistically valid?</li>
              <li>Are benchmarks and datasets clearly identified?</li>
              <li>Are comparative evaluations included where applicable?</li>
            </ul>
          </div>

          {/* 7. Ethical Considerations */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">7. Ethical Considerations</h2>
            <p className="text-sm font-medium">The compliance of the work with ethical research standards.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Does the research involve human or animal subjects? If yes, are ethical approvals mentioned?</li>
              <li>Are privacy, data security, and fairness issues addressed?</li>
              <li>Are any potential conflicts of interest disclosed?</li>
            </ul>
          </div>

          {/* 8. Relevance to the Conference Scope */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">8. Relevance to the Conference Scope</h2>
            <p className="text-sm font-medium">The alignment of the paper’s subject matter with the themes and topics outlined in the Call for Papers.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Is the topic relevant to the conference's core themes?</li>
              <li>Does the work contribute to the conference's academic discourse?</li>
            </ul>
          </div>

          {/* 9. Overall Recommendation */}
          <div className='w-full p-6 bg-white rounded-xl shadow-md'>
            <h2 className="text-lg font-semibold mb-2">9. Overall Recommendation</h2>
            <p className="text-sm font-medium">The reviewer’s general assessment based on all above criteria.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Strong Accept</li>
              <li>Accept</li>
              <li>Weak Accept</li>
              <li>Borderline</li>
              <li>Weak Reject</li>
              <li>Reject</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvaluationCriteria;