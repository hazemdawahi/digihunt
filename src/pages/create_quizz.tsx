import { useEffect, useState } from 'react';
import SideNavbar from '../components/SideNavbar';
import { getSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';
import SideNavbar_admin from '../components/SideNavbar_admin';
import Modal from 'react-modal';

const CreateQuizz = ({ companyId }) => {
  const { data: session } = useSession(); // Add this line

  const [quizTitle, setQuizTitle] = useState(''); 
  const [quizType, setQuizType] = useState('');  
  const [timeInMins, setTimeInMins] = useState(''); // State for timer in minutes
  const [level, setLevel] = useState(''); // New state for quiz type
  const [questions, setQuestions] = useState([
    { id: 1, question: '', answers: [''], correctAnswer: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const handleQuizMe = async () => {
    // Logic for the AI Quiz API call
    // Close the modal and handle your logic as needed
    setIsModalOpen(false);
  };

  
  const handlePublish = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/createQuizz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          questions, 
          quizTitle, 
          quizType, 
          companyId, 
          timeInMins, 
          level, 
          questionNum: questions.length 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      // Show success message
      Swal.fire(
        'Quiz Created!',
        'Your quiz has been successfully created.',
        'success'
      );
    } catch (error) {
      console.error(error);
      // Show error message
      Swal.fire(
        'Error!',
        'An error occurred while creating your quiz.',
        'error'
      );
    }
  };
  const handleGenerateQuiz = async () => {
    console.log("quizTopic,numberOfQuestions,difficulty", quizTopic,numberOfQuestions,difficulty)
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/ai_quizz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: quizTopic,
          numberOfQuestions: numberOfQuestions,
          difficulty: difficulty
        })
      });
      console.log(response);
      
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      setIsLoading(false);

  
      // Update state based on received data
      setQuizTitle(data.quizName);
      setQuizType(data.type);
      setTimeInMins(data.estimatedTime.split(' ')[0]); // assuming format "xx minutes"
      setDifficulty(data.difficulty);
  
      // Map the received questions to match the format of the state
      const formattedQuestions = data.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        answers: q.options,
        correctAnswer: q.correctAnswer
      }));
      setQuestions(formattedQuestions);
      
      setIsModalOpen(false);
  
    } catch (error) {
      console.error(error);
      // Handle the error or show an error message here
    }
  };
  
  const handleQuestionAdd = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: '',
      answers: [''],
      correctAnswer: '', // updated from -1 to ''
    };
  
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleQuestionChange = (index, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = value;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex] = value;
      return updatedQuestions;
    });
  };

  const handleAnswerAdd = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: [...updatedQuestions[questionIndex].answers, ''],
      };
      return updatedQuestions;
    });
  };
  
  const handleCorrectAnswerSelect = (questionIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswer = value; // directly assign value to correctAnswer
      return updatedQuestions;
    });
  };

  const handleQuestionRemove = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };
 
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          {session.user.role === 'admin' ? <SideNavbar_admin /> : <SideNavbar />}

      <header className="bg-white py-2 px-4 flex justify-end">
      <button onClick={handleQuestionAdd} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
    Add question
</button>
<button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">
    Generate Quiz
</button>


      </header>
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl mb-4">Generate Quiz</h2>

      <div className="mb-4">
        <label className="block mb-2">Topic:</label>
        <input type="text" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Number of Questions:</label>
        <input type="number" value={numberOfQuestions} onChange={(e) => setNumberOfQuestions(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 border rounded">
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

      </div>

      <div className="flex justify-center">
      <button onClick={handleGenerateQuiz} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 flex items-center">
  {isLoading ? (
    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : 'Quiz Me!'}
</button>


        <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <main className="container mx-auto text-center pl-50 flex-grow">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

          <div className="mb-4">
            <label htmlFor="quizTitle" className="block mb-2 font-medium">
              Quiz Title
            </label>
            <input
              id="quizTitle"
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter the quiz title"
              className="border border-gray-300 rounded px-3 py-2 mb-2  h-12"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quizType" className="block mb-2 font-medium">
              Quiz Type
            </label>
            <select
              id="quizType"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-2  h-12 resize-none"
            >
              <option value=''>Select Quiz Type</option>
              <option value='psychometric'>Psychometric Quiz</option>
              <option value='skillset'>Skill Set Quiz</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="timeInMins" className="block mb-2 font-medium">
              Time in Minutes
            </label>
            <input
              id="timeInMins"
              type="number"
              value={timeInMins}
              onChange={(e) => setTimeInMins(e.target.value)}
              placeholder="Enter the quiz time in minutes"
              className="border border-gray-300 rounded px-3 py-2 mb-2  h-12"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="level" className="block mb-2 font-medium">
              Quiz Level
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-2  h-12 resize-none"
            >
              <option value=''>Select Quiz Level</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
          </div>

          {questions.map((question, index) => (
            <div key={question.id} className="mb-4 p-4 bg-white rounded">
              <label htmlFor={`question${question.id}`} className="block mb-2 font-medium">
                Question {question.id}
              </label>
              <textarea
                id={`question${question.id}`}
                placeholder="Enter a question"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 mb-2  h-12 resize-none"
              />

              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="mb-2">
                  <label htmlFor={`answer${question.id}-${answerIndex}`} className="block mb-2 font-medium">
                    Answer {answerIndex + 1}
                  </label>
                  <textarea
                    id={`answer${question.id}-${answerIndex}`}
                    placeholder="Enter an answer"
                    value={answer || ''}
                    onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-2  h-12 resize-none"
                  />
                </div>
              ))}

              <div>
                <label htmlFor={`correctAnswer${question.id}`} className="block mb-2 font-medium">
                  Correct Answer
                </label>
                <select
                  id={`correctAnswer${question.id}`}
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerSelect(index, e.target.value)} // directly pass e.target.value
                  className="border border-gray-300 rounded px-3 py-2 mb-2  h-12 resize-none"
                >
                  <option value=''>Select Correct Answer</option>
                  {question.answers.map((_, answerIndex) => (
                    <option key={answerIndex} value={String.fromCharCode(97 + answerIndex)}>
                      Answer {String.fromCharCode(97 + answerIndex).toUpperCase()} {/* map index to letter starting from 'A' */}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button onClick={() => handleAnswerAdd(index)} className="bg-green-500 text-white px-4 py-2 rounded">
                  Add Answer
                </button>
                <button onClick={() => handleQuestionRemove(index)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white py-4 text-center">
        <button onClick={handlePublish} className="bg-blue-500 text-white px-4 py-2 rounded">
          Publish
        </button>
      </footer>
    </div>
  );
};

export default CreateQuizz;

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
  // Check if the user's role is 'admin' or 'company'
  if (!(session.user.role === 'admin' || session.user.role === 'company')) {
    return {
      redirect: {
        destination: '/', // Redirect to home page or any other page
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      companyId: session.user.id, // Assuming you have companyId in your session
    },
  };
}
