import React, { useEffect, useState } from 'react';
import SideNavbar from '../components/SideNavbar';
import { getSession, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export default function QuizHistory() {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    if (session && session.user) {
      const response = await fetch(`http://localhost:3000/api/auth/quizz_done?userId=${session.user.id}`);
      const data = await response.json();
      setQuizzes(data);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [session]);
  const handlePdfClick = async (quizHistory) => {
    // Send a POST request to the generate-pdf API endpoint with the quizHistory as the body
    const response = await fetch('/api/auth/pdf_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizHistory),
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      // Open the PDF in a new tab
      window.open(url);
    } else {
      console.error('Error generating PDF', await response.text());
    }
  };
  
  return (
    <div className="flex justify-center">
      <SideNavbar />
      <main className="container mx-auto text-center py-20">
        <table className="table-auto mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-blue-300 bg-blue-100">Quiz Title</th>
              <th className="py-2 px-4 border border-blue-300 bg-blue-100">Quiz Type</th>
              <th className="py-2 px-4 border border-blue-300 bg-blue-100">Quiz Level</th>
              <th className="py-2 px-4 border border-blue-300 bg-blue-100">Number of Questions</th>
              <th className="py-2 px-4 border border-blue-300 bg-blue-100">PDF</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(quizzes) && quizzes.map((quizHistory) => (
              <tr key={quizHistory.id} className="text-center hover:bg-blue-50">
                <td className="py-2 px-4 border border-blue-300">{quizHistory.quiz.title}</td>
                <td className="py-2 px-4 border border-blue-300">{quizHistory.quiz.type}</td>
                <td className="py-2 px-4 border border-blue-300">{quizHistory.quiz.level}</td>
                <td className="py-2 px-4 border border-blue-300">{quizHistory.quiz.questionNum}</td>
                <td className="py-2 px-4 border border-blue-300">
                  {/* Replace `pdfUrl` with the correct field once you have the URL to the PDF */}
                  <a href={quizHistory.quiz.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFilePdf} onClick={() => handlePdfClick(quizHistory)} />
                  </a>
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