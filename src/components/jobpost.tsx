import React from 'react';
import { Job } from '../pages/offers';
import { MdLocationOn, MdWork, MdAttachMoney } from "react-icons/md";
import { useRouter } from 'next/router'

type Props = {
  job: Job;
  onRemove?: () => void;
  onApply?: () => void; // Add onApply prop here
};

const JobPost: React.FC<Props> = ({ job, onRemove, onApply }) => {
  const router = useRouter()

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md mb-4 space-y-2 pl-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img className="w-10 h-10 rounded-full" src={job.company.image} alt="Company Logo" />
          <div>
            <h3 className="text-sm font-bold text-blue-600">{job.jobTitle}</h3>
            <p className="text-xs text-blue-400">{job.company.name}</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 text-xs text-white">
        <span className="flex items-center bg-blue-500 px-2 py-1 rounded"><MdLocationOn /> {job.location}</span>
        <span className="flex items-center bg-green-500 px-2 py-1 rounded"><MdWork /> {job.salaryType}</span>
        <span className="flex items-center bg-purple-500 px-2 py-1 rounded"><MdAttachMoney /> {job.salary}</span>
      </div>
      <p className="text-xs text-gray-600">{job.description}</p>
      <p className="text-xs text-blue-600">Posted on: {job.postDate || "Date not available"}</p>
      <p className="text-xs text-gray-600">Experience: {job.experience}</p>
      <p className="text-xs text-gray-600">Education: {job.education}</p>
      <div>
        <p className="text-xs text-gray-600">Requirements: {job.requirements}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {job.jobSkills.map((jobSkill) => (
          <span key={jobSkill.skill.id} className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs">{jobSkill.skill.name}</span>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-2">
  <button
    onClick={() => {
      console.log(`Clicked remove job: ${job.id}`);
      if (onRemove) {
        onRemove();
      }
    }}
    className="bg-red-600 text-white px-4 py-2 rounded text-xs"
  >
    Remove
  </button>
  <button
   onClick={() => router.push(`/applicants/${job.id}`)}
    className="bg-green-600 text-white px-4 py-2 rounded text-xs">
     Applicants
  </button>

</div>

    </div>
  );
};

export default JobPost;
