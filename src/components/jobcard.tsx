import React from 'react';
import { Job } from '../pages/offers/[id]';
import { MdLocationOn, MdWork, MdAttachMoney } from "react-icons/md";

type Props = {
  job: Job;
  onRemove?: () => void;
  onApply?: () => void;
};

const JobCard: React.FC<Props> = ({ job, onRemove, onApply }) => {
  const handleApply = () => {
    if (job.url) {
      // If the job is from scrapping and has a URL, open it in a new tab.
      window.open(job.url, "_blank");
    } else {
      // If it's not from scrapping, use the provided onApply logic.
      console.log(`Clicked apply for job: ${job.id}`);
      if (onApply) {
        onApply();
      }
    }
  };

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

      {/* Displaying requirements */}
      {job.requirements && (
        <div>
          <p className="text-xs text-gray-600">Requirements: {job.requirements}</p>
        </div>
      )}

      {/* Displaying jobSkills */}
      {job.jobSkills && (
        <div className="flex flex-wrap gap-1">
          {job.jobSkills.map((jobSkill) => (
            <span key={jobSkill.skill.id} className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs">{jobSkill.skill.name}</span>
          ))}
        </div>
      )}

<div className="flex justify-end items-center">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded text-xs"
        >
          {job.url ? "Apply on Tanijobs" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
