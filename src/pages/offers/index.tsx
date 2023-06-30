import React, { useEffect, useState } from 'react';
import FilterComponent from '../../components/filtercomponent';
import SideNavbar from '../../components/SideNavbar';
import JobCard from '../../components/jobcard';
import { getSession, useSession } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import Swal from 'sweetalert2';



export type Job = {
  id: string;
  jobTitle: string;
  salaryType: string;
  isRemote: boolean;
  isFullTime: boolean;
  isInternship: boolean;
  requirements: string;
  description: string;
  expiryDate: Date | null;
  postDate: string;
  companyId: string;
  location: string;
  experience: string;
  education:string;
  salary: number;
  company: {
    id: string;
    name: string;
    image: string; // Add the 'image' property here
    // Add other company fields as necessary
  };
};

export default function Offers({
  jobs
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status: loading } = useSession();
  const [handleApply, setHandleApply] = useState(() => () => {});
  const [handleCheckQuiz, setHandleCheckQuiz] = useState(() => async (jobId: string) => {});
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  useEffect(() => {
    if (loading === 'authenticated') {
      setHandleApply(() => async (jobId: string) => {
        console.log(`Applying for job: ${jobId}`);
        try {
          const quizData = await handleCheckQuiz(jobId);
  
          if (!quizData.hasCompletedRequiredQuizzes) {
            Swal.fire({
              icon: 'warning',
              title: 'Quizzes Missing',
              text: `You have not taken the following quizzes: ${quizData.missingQuizzes.join(", ")}`,
            });
            return; // Do not proceed with applying if quizzes are not complete
          }
  
          console.log(session)
          const response = await fetch('/api/auth/apply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.id, jobId }),
          });
  
          if (!response.ok) {
            const responseBody = await response.text();
            console.error("Server response:", responseBody);
            throw new Error("Failed to apply for job");
          }
  
          console.log("Successfully applied for job");
          window.location.reload();
    
        } catch (error) {
          console.error("An error occurred:", error);
        }
      });
  
      const handleCheckQuiz = async (jobId: string) => {
        try {
          const response = await fetch('/api/auth/checkQuizz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.id, jobId }),
          });
  
          
  
          if (!response.ok) {
            const responseBody = await response.text();
            console.error("Server response:", responseBody);
            throw new Error("Failed to check quiz");
          }
  
          console.log("Successfully checked quiz");
          const quizData = await response.json();
          return quizData; // Return quiz data for further processing
    
        } catch (error) {
          console.error("An error occurred:", error);
        }
      };
  
      // Set the function to state so it can be used outside of the useEffect hook
      setHandleCheckQuiz(() => handleCheckQuiz);
    }
  }, [session, loading]);
  
 
  const handleFilter = (filters) => {
    // Check if all filter values are empty first
    const isEmptyFilter = Object.values(filters).some(value => value !== '' && value !== false && !(Array.isArray(value) && value.length === 0));
  
    // If all filter values are empty, show all jobs
    if (!isEmptyFilter) {
      setFilteredJobs(jobs);
      return; // Return here to avoid running the rest of the code
    }
  
    let tempJobs = [...jobs];
  
    // Filter by remote
    if (filters.remote) {
      tempJobs = tempJobs.filter((job) => job.isRemote === filters.remote);
    }
  
    // Filter by salary range
    tempJobs = tempJobs.filter(
      (job) => job.salary >= filters.salaryRange[0] && job.salary <= filters.salaryRange[1]
    );
  
    // Filter by education, experience, skills, industry, role, location
    // Assuming these fields exist in the job object
    if (filters.education) {
      tempJobs = tempJobs.filter((job) => job.education === filters.education);
    }
    if (filters.experience) {
      tempJobs = tempJobs.filter((job) => job.experience === filters.experience);
    }
    if (filters.skills.length > 0) {
      tempJobs = tempJobs.filter((job) =>
        job.jobSkills.some((jobSkill) => filters.skills.includes(jobSkill.skill.name))
      );
    }
    if (filters.industry) {
      tempJobs = tempJobs.filter((job) => job.industry === filters.industry);
    }
    if (filters.role) {
      tempJobs = tempJobs.filter((job) => job.role === filters.role);
    }
    if (filters.location) {
      tempJobs = tempJobs.filter((job) => job.location === filters.location);
    }
  
    setFilteredJobs(tempJobs);
  };

  
  return (
    <div className="container mx-auto py-10 h-screen">
      <div className="flex justify-center items-center">
        <SideNavbar />
      </div>
      <div className="flex pl-60 relative">
        <div className="w-1/4 h-full sticky top-0 overflow-y-auto">
          <FilterComponent jobs={jobs} onFilter={handleFilter} />
        </div>
        <div className="flex flex-col w-3/4 overflow-y-auto">
          {filteredJobs.map((job: Job) => (
      <JobCard key={job.id} job={job} onRemove={() => handleRemove(job.id)} onApply={() => handleApply(job.id)} />
      ))}
        </div>
      </div>
    </div>
  );
}



export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  console.log("session",session)
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

  const jobsRes = await fetch('http://localhost:3000/api/auth/fetch_jobs');
  const jobsData = await jobsRes.json();
  // Fetch applications by the user
  const applicationsRes = await fetch(`http://localhost:3000/api/auth/fetch_application?userId=${session.user.id}`);
  const applicationsData = await applicationsRes.json();
console.log(applicationsData)

const appliedJobIds = applicationsData.map(application => application.jobId);
  const jobs = jobsData.jobs.filter(job => !appliedJobIds.includes(job.id));
  return {
    props: {
      session,
      jobs
    },
  };
}
