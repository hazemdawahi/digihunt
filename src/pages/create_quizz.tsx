import { useState } from 'react';
import SideNavbar from '../components/SideNavbar';
import { getSession } from 'next-auth/react';

const CreateQuizz = () => {
  const [quizTitle, setQuizTitle] = useState('');  // New state for quiz title
  const [questions, setQuestions] = useState([
    { id: 1, question: '', answers: [''], correctAnswer: '' },
  ]);

  const handlePublish = async () => {
    console.log(questions)
    try {
      const response = await fetch('http://localhost:3000/api/auth/createQuizz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions,quizTitle }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
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


  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = value;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex] = value;
      return updatedQuestions;
    });
  };

  const handleAnswerAdd = (questionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: [...updatedQuestions[questionIndex].answers, ''],
      };
      return updatedQuestions;
    });
  };
  

  const handleCorrectAnswerSelect = (questionIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswer = value; // directly assign value to correctAnswer
      return updatedQuestions;
    });
  };


  const handleQuestionRemove = (index: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <SideNavbar />
      <header className="bg-white py-2 px-4 flex justify-end">
        <button onClick={handleQuestionAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add question
        </button>
      </header>
      <main className="container mx-auto text-center  pl-50 flex-grow">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

          <input  // new input field for quiz title
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter the quiz title"
            className="border border-gray-300 rounded px-3 py-2 mb-2 w-600 h-12"
          />
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
                className="border border-gray-300 rounded px-3 py-2 mb-2 w-600 h-12 resize-none"
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
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-600 h-12 resize-none"
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
            className="border border-gray-300 rounded px-3 py-2 mb-2 w-600 h-12 resize-none"
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
