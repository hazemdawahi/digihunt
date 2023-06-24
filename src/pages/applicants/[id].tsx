import React, { useEffect, useState } from 'react';
import SideNavbar from '../../components/SideNavbar';
import { getSession, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck, faBan, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function Applicants() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  
  const router = useRouter(); // Use the router
  const { id } = router.query; // Get the jobId from the URL

  const fetchApplications = async () => {
    if (session && session.user) {
      const response = await fetch('/api/auth/job_applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: id }),
      });
      const data = await response.json();
      const pendingApplications = data.applications.filter(app => app.status === 'pending');
      setApplications(pendingApplications);
    }
  };
  
  
  const acceptApplication = async (id) => {
    try {
      const response = await fetch('/api/auth/accept_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });
    
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Application Accepted',
          text: 'The application has been accepted successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  const rejectApplication = async (id) => {
    try {
      const response = await fetch('/api/auth/reject_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Application Rejected',
          text: 'The application has been rejected successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [session]);

  return (
    <div className="flex justify-center">
      <SideNavbar />
      <main className="container mx-auto text-center py-20">
        {Array.isArray(applications) && applications.length > 0 ? (
          <table className="table-auto mx-auto">
            <thead>
              <tr>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">First Name</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Last Name</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Email</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Location</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">CV</th>
        <th className="py-2 px-4 border border-blue-300 bg-blue-100">Action</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(applications) && applications.map((app) => (
        <tr key={app.id} className="text-center hover:bg-blue-50">
          <td className="py-2 px-4 border border-blue-300">{app.user.firstname}</td>
          <td className="py-2 px-4 border border-blue-300">{app.user.lastname}</td>
          <td className="py-2 px-4 border border-blue-300">{app.user.email}</td>
          <td className="py-2 px-4 border border-blue-300">{app.user.location}</td>
          <td className="py-2 px-4 border border-blue-300">
          {app.user.resume ? (
  <FontAwesomeIcon 
    icon={faFilePdf} 
    onClick={() => window.open(`/cv_view/${app.user.id}`, "_blank")}
    style={{ cursor: 'pointer' }} // make the icon look clickable
  />
) : (
  <p>No CV provided</p>
)}

</td>


          <td className="py-2 px-4 border border-blue-300 flex justify-around">
            <button onClick={() => acceptApplication(app.id)} className="bg-green-500 text-white rounded p-1">
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={() => rejectApplication(app.id)} className="bg-red-500 text-white rounded p-1">
              <FontAwesomeIcon icon={faBan} />
            </button>
          </td>
        </tr>
      ))}
  </tbody>
          </table>
        ) : (
          <p className="text-xl text-center py-10">No applications to display</p>
        )}
      </main>
    </div>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req }); // corrected syntax
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
