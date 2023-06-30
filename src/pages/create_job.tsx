import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import SideNavbar from '../components/SideNavbar';
import {
  Container,
  Card,
  Row,
  Text,
  Avatar,
  Grid,
  Input,
  Button,
  
} from '@nextui-org/react';
import ChipInput  from 'material-ui-chip-input'
import { FaEdit, FaPlus } from 'react-icons/fa';
import { BiPen } from 'react-icons/bi';
import { CgPen } from 'react-icons/cg';
import { useFormik } from 'formik';
import router from 'next/router';
import Swal from 'sweetalert2';
import { CountryDropdown } from 'react-country-region-selector';
import JobPostCard from '../components/jobpost';
import { PrismaClient } from '@prisma/client';
import Modal from 'react-modal';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
  root: {
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none',
    },
  },
});

export default function create_job({ jobs }) {
  const classes = useStyles();

  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };

  console.log(session);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await fetch('/api/auth/quizz_titles');
      const data = await res.json();
      setQuizzes(data);
    };
  
    fetchQuizzes();
  }, []);
  const handleSkillsChange = (skills) => {
    formik.setFieldValue('skills', skills);
  };
  const handleRemoveJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/auth/delete_job?jobId=${jobId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Optional: Handle the success message
        router.reload(); // Assuming you have imported 'router' from 'next/router'

        // Reload the page or update the job list as needed
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (error) {
      console.error('Failed to delete job', error);
      // Optional: Handle the error
    }
  };
  
  const handleSkillDelete = (index) => {
    const newSkills = [...formik.values.skills];
    newSkills.splice(index, 1);
    formik.setFieldValue('skills', newSkills);
  };
  const formik = useFormik({
    initialValues: {
      quizId: '',
      jobTitle: '',
      requirements: '',
      description: '',
      isFullTime: false,
      isInternship: false,
      isRemote: false,
      location: '',
      industry: '',
      role: '',
      salary: '',
      skills: [],
      education: '', // Added education here
      experience: '', // Added experience here
    },
    onSubmit: async (values) => {
      const session = await getSession();
      const userId = session?.user?.id;
      console.log(values)
      const response = await fetch('/api/auth/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: values.quizId,
          jobTitle: values.jobTitle,
          requirements: values.requirements,
          description: values.description,
          isRemote: values.isRemote,
          isFullTime: values.isFullTime,
          isInternship: values.isInternship,
          companyId: userId,
          location: values.location,
          industry: values.industry,
          role: values.role,
          salary: values.salary,
          skills: values.skills,
          education:values.education,
          experience:values.experience,
          expiryDate: new Date(),
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to add job');
        return;
      }
  
      closeHandler();
      router.reload();
    },
  });
  return (
    <div className="flex">
      <SideNavbar />
      <main className="container mx-auto text-center py-20 pl-50">
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Job Posts</h1>
          <Grid.Container justify="center" gap={4}>
          {jobs.map((job, index) => {
  return (
    <Grid xs={12} sm={6} md={4} lg={3} key={index}>
      <JobPostCard
        job={job}
        onRemove={() => handleRemoveJob(job.id)}
      />
    </Grid>
  )
})}

</Grid.Container>

        </div>
        <div className="absolute top-0 right-0 m-4">
          <Button color="primary" onPress={handler} icon={<FaPlus />} auto>
            Add Job
          </Button>
          <Modal
  style={{
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '30%', // adjust as needed
      maxHeight: '70%', // adjust as needed
      overflowY: 'auto' // makes the content inside modal scrollable
    },
  }}
  isOpen={visible}
  onRequestClose={closeHandler}
  contentLabel="Job Modal"
>
  <h2 className="text-2xl font-bold mb-4 text-center">Add Job</h2>
  <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Job Title"
          name="jobTitle"
          onChange={formik.handleChange}
          value={formik.values.jobTitle}
        />
        <input
          className="border p-2 w-full"
          placeholder="Location"
          name="location"
          onChange={formik.handleChange}
          value={formik.values.location}
        />
        <input
          className="border p-2 w-full"
          placeholder="Salary"
          name="salary"
          onChange={formik.handleChange}
          value={formik.values.salary}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Job Requirements"
          name="requirements"
          onChange={formik.handleChange}
          value={formik.values.requirements}
        />
        <div className="border p-2 w-full">
  <select
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

<div className="border p-2 w-full">
  <select
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
        <textarea
          className="border p-2 w-full"
          placeholder="Job Description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            name="isFullTime"
            onChange={formik.handleChange}
            checked={formik.values.isFullTime}
          />
          <label>Full Time</label>
        </div>
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            name="isInternship"
            onChange={formik.handleChange}
            checked={formik.values.isInternship}
          />
          <label>Internship</label>
        </div>
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            name="isRemote"
            onChange={formik.handleChange}
            checked={formik.values.isRemote}
          />
          <label>Remote</label>
        </div>
        <input
          className="border p-2 w-full"
          placeholder="Industry"
          name="industry"
          onChange={formik.handleChange}
          value={formik.values.industry}
        />
        <input
          className="border p-2 w-full"
          placeholder="Role"
          name="role"
          onChange={formik.handleChange}
          value={formik.values.role}
        />
<div className="border p-2 w-full">
<ChipInput
  classes={{ inputRoot: classes.inputRoot }}
  value={formik.values.skills}
  onAdd={(chip) => formik.setFieldValue('skills', [...formik.values.skills, chip])}
  onDelete={(chip, index) => {
    const newSkills = formik.values.skills;
    newSkills.splice(index, 1);
    formik.setFieldValue('skills', newSkills);
  }}
  onBlur={() => formik.setFieldTouched('skills', true)}
  placeholder="Skills"
/>
</div>
<div className="border p-2 w-full">
<select
  className="w-full" // added w-full here
  name="quizId"
  onChange={formik.handleChange}
  value={formik.values.quizId}
>
  <option value="">Select Quiz</option>
  {quizzes.map(quiz => (
    <option key={quiz.id} value={quiz.id}>{quiz.title} ({quiz.type})</option>
  ))}
</select>

</div>

        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg w-full" type="button" onClick={closeHandler}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full" type="submit">
            Save
          </button>
        </div>
        </form>
</Modal>


        </div>
      </main>
    </div>
  );
}
const prisma = new PrismaClient();
export async function getServerSideProps({ req }) {
  
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  if (session.user.role === 'admin') {
    return {
      redirect: {
        destination: '/admin_user_pages',
        permanent: false,
      },
    };
  }

  const companyId = session?.user?.id.toString();
  let jobs = await prisma.job.findMany({
    where: {
      companyId: companyId
    },
    include: {
      jobSkills: {
        include: {
          skill: true
        }
      },
      company: true // Add this line to include the company in the query
    }
  });
  
  jobs = jobs.map(job => {
    console.log('Before filter:', job.jobSkills);
    
    const filteredJobSkills = job.jobSkills 
      ? job.jobSkills.filter(js => js.skill) 
      : [];
    
    console.log('After filter:', filteredJobSkills);
    
    return {
      ...job,
      expiryDate: new Date(job.expiryDate).toISOString(),
      postDate: new Date(job.postDate).toISOString(),
    };
  });

  return {
    props: {
      session,
      jobs,
    },
  };
}
