import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function FilterComponent({ jobs, onFilter }) {
  const formik = useFormik({
    initialValues: {
      remote: false,
      salaryRange: [0, 10000],
      education: '',
      experience: '',
      skills: [],
      industry: '',
      role: '',
      location: '',
    },
    onSubmit: (values) => {
      onFilter(values);
    },
  });

  const [maxSalary, setMaxSalary] = useState(10000); // Default maximum salary

  useEffect(() => {
    // Calculate the maximum salary from jobs
    if (jobs.length > 0) {
      const max = Math.max(...jobs.map((job) => job.salary));
      setMaxSalary(max);
      formik.setFieldValue('salaryRange', [formik.values.salaryRange[0], max]); // Update the max salary in formik values
    }
  }, [jobs]);

  return (
    <form onSubmit={formik.handleSubmit} className="w-full bg-white rounded shadow-md p-8">
      {/* Other fields here... */}
      
      <div className="mb-4">
        <label htmlFor="salaryRange" className="block mb-2 font-medium text-gray-800">
          Salary Range
        </label>
        <Slider
        range
          min={0}
          max={maxSalary}
          step={100}
          value={formik.values.salaryRange}
          onChange={(value) => formik.setFieldValue('salaryRange', value)}
        />
        <div className="flex justify-between text-gray-600">
          <span>${formik.values.salaryRange[0]}</span>
          <span>${formik.values.salaryRange[1]}</span>
        </div>
      </div>
      
      {/* Education */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="education">Education</label>
        <select
          className="w-full p-2 border rounded"
          name="education"
          onChange={formik.handleChange}
          value={formik.values.education}
        >
          <option value="">Select Education</option>
          <option value="highschool">High School</option>
          <option value="bachelors">Bachelors</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="experience">Experience</label>
        <select
          className="w-full p-2 border rounded"
          name="experience"
          onChange={formik.handleChange}
          value={formik.values.experience}
        >
          <option value="">Select Experience</option>
          <option value="entrylevel">Entry Level</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="skills">Skills</label>
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="skills"
          onChange={formik.handleChange}
          value={formik.values.skills}
          placeholder="Enter skills"
        />
      </div>

      {/* Industry */}
      <div
      className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="industry">Industry</label>
        <select
          className="w-full p-2 border rounded"
          name="industry"
          onChange={formik.handleChange}
          value={formik.values.industry}
        >
          <option value="">Select Industry</option>
          {/* Map your industries here */}
        </select>
      </div>

      {/* Role */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="role">Role</label>
        <select
          className="w-full p-2 border rounded"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
        >
          <option value="">Select Role</option>
          {/* Map your roles here */}
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-800" htmlFor="location">Location</label>
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="location"
          onChange={formik.handleChange}
          value={formik.values.location}
          placeholder="Enter location"
        />
      </div>

      <div className="mb-4">
        <input
          type="checkbox"
          name="remote"
          onChange={formik.handleChange}
          checked={formik.values.remote}
        />
        <label htmlFor="remote" className="ml-2 font-medium text-gray-800">Remote</label>
      </div>

      <button type="submit" className="w-full p-2 bg-blue-500 text-white font-medium rounded">
        Apply Filters
      </button>
    </form>
  );
}

export default FilterComponent;
