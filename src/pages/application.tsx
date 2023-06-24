import React, { useEffect, useState } from 'react';
import SideNavbar from '../components/SideNavbar';
import { getSession, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Application() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    console.log(session.user.id)
    if (session && session.user) {
      const response = await fetch(`http://localhost:3000/api/auth/fetch_application?userId=${session.user.id}`);
      const data = await response.json();
      setApplications(data);
    }
  };

  const deleteApplication = async (id) => {
    const response = await fetch('/api/auth/delete_application', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
  
    // Check if the request was successful
    if (response.ok) {
      // Refetch the applications
      fetchApplications();
    } else {
      console.error('Failed to delete application');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [session]);

  return (
   
      <div className="flex justify-center">
      <SideNavbar />
      <main className="container mx-auto text-center py-20">
        <table className="table-auto mx-auto">
    <thead>
      <tr>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Job Name</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Description</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Company Name</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Role</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Location</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Status</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Action</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(applications) && applications.map((app) => (
        <tr key={app.id} className="text-center hover:bg-blue-50">
          <td className="py-2 px-4 border border-blue-300">{app.job.jobTitle}</td>
          <td className="py-2 px-4 border border-blue-300">{app.job.description}</td>
          <td className="py-2 px-4 border border-blue-300">{app.job.company.company_name}</td>
          <td className="py-2 px-4 border border-blue-300">{app.job.role}</td>
          <td className="py-2 px-4 border border-blue-300">{app.job.location}</td>
          <td className="py-2 px-4 border border-blue-300">{app.status}</td>
          <td className="py-2 px-4 border border-blue-300">
  {app.status !== 'accepted' && app.status !== 'rejected' ? (
    <button onClick={() => deleteApplication(app.id)}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  ) : (
    <FontAwesomeIcon icon={faTimes} className="opacity-50" />
  )}
</td>


        </tr>
      ))}
    </tbody>
  </table>
</main>


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

  return {
    props: {
      session,
    },
  };
}
