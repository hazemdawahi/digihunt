import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import SideNavbar_admin from '../components/SideNavbar_admin';

export default function Companies() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    if (session && session.user) {
      const response = await fetch('/api/auth/fetch_companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();      
      console.log(data)

      setCompanies(data);
    }
  };
  
  const deleteCompany = async (id) => {
    try {
      const response = await fetch(`/api/auth/delete_companies?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Company Deleted',
          text: 'The company has been deleted successfully!',
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
    fetchCompanies();
  }, [session]);

  return (
    <div className="flex justify-center">
      <SideNavbar_admin />
      <main className="container mx-auto text-center py-20">
        {Array.isArray(companies) && companies.length > 0 ? (
          <table className="table-auto mx-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-blue-300 bg-blue-100">Company Name</th>
                <th className="py-2 px-4 border border-blue-300 bg-blue-100">Industry</th>
                <th className="py-2 px-4 border border-blue-300 bg-blue-100">Email</th>
                <th className="py-2 px-4 border border-blue-300 bg-blue-100">Location</th>
                <th className="py-2 px-4 border border-blue-300 bg-blue-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(companies) && companies.map((company) => (
                <tr key={company.id} className="text-center hover:bg-blue-50">
                  <td className="py-2 px-4 border border-blue-300">{company.company_name}</td>
                  <td className="py-2 px-4 border border-blue-300">{company.industry}</td>

                  <td className="py-2 px-4 border border-blue-300">{company.email}</td>
                  <td className="py-2 px-4 border border-blue-300">{company.location}</td>
                  <td className="py-2 px-4 border border-blue-300 flex justify-center">
                    <button onClick={() => deleteCompany(company.id)} className="bg-red-500 text-white rounded p-1">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xl text-center py-10">No companies to display</p>
        )}
      </main>
    </div>
  );
}

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
  if (session.user.role !== 'admin') { // only admin users should be able to delete companies
    return {
      redirect: {
        destination: '/',
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
