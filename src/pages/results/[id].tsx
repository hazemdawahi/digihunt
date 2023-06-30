import React, { useEffect, useState } from 'react';
import SideNavbar from '../../components/SideNavbar';
import { getSession, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';

export default function Results() {
  const router = useRouter();
  const { id } = router.query; // Access the ID from the URL
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    const response = await fetch(`http://localhost:3000/api/auth/quizz_done?userId=${id}`);
    const data = await response.json();
    setQuizzes(data);
  };

  useEffect(() => {
    if (id) { // Only fetch quizzes if an ID is available
      fetchQuizzes();
    }
  }, [id]); // Rerun useEffect if the ID changes
  const handlePdfClick = async (quizHistory) => {
    console.log("quizzhistory",quizHistory);

    const response = await fetch('/api/auth/pdf_company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizHistory),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
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
