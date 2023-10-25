/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import {  useState } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import Question from "../components/Question";
import ExerciseList from "../components/ExerciceList";
import SideNavbar from "../components/SideNavbar";
import QuizResults from './doughuntchart';
import { getSession, useSession } from 'next-auth/react';
import styles from '../styles/quizz.module.css';
import Swal from "sweetalert2";


export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

 // Fetch your API
// Fetch your API
const res = await fetch('http://localhost:3000/api/auth/fetchquizz');
const data = await res.json();

let transformedExercises = [];

// If there's a message in the response, it means there's no more quizzes available
if (data.message) {
  console.log(data.message);
} else if (Array.isArray(data)) {
  // If data is an array, it means the quizzes are returned as expected
  let exercises = data;
  
  // Transform your exercises data to match your app structure
  transformedExercises = exercises.map(exercise => ({
    id: exercise.id,
    title: exercise.quizTitle,
    exerciseId: exercise.exerciseId,
    question: exercise.question,
    answers: exercise.answers,
    correctAnswer: exercise.correctAnswer,  // assuming 'a' maps to 0 and 'b' maps to 1
    company: exercise.company,
    type: exercise.type,
    timeInMins: exercise.timeInMins,
    level: exercise.level,
    questionNum: exercise.questionNum,
    jobQuizzes: exercise.jobQuizzes
  }));
  
  
  console.log("transformedExercises",transformedExercises)
}

return {
  props: {
    exercises: transformedExercises,
    session,
  }
};
}

function letterToIndex(letter, returnLetter = false) {
  if (!letter) return -1;
  if (returnLetter) return letter;
  const lowerLetter = letter.toLowerCase();
  return lowerLetter.charCodeAt(0) - 'a'.charCodeAt(0);
}

const checkWebcamPermission = async () => {
  try {
      // Try to access the user's webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // If successful, close the stream and return true
      stream.getTracks().forEach(track => track.stop());
      return true;
  } catch (err) {
      // If failed, return false
      return false;
  }
};
const callApi_user = async (questions, score, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime,user) => {

  const apiUrl = "http://localhost:3000/api/auth/pdf_user";
  const percentage = (score / questions.length) * 100;

  const data = {
    questions: questions.map((question, index) => {
      const userAnswerLetter = answers[index];
      const correctAnswerLetter = question.correctAnswer;
      const tabchanges= tabSwitchCount[index];
      const duration_per_question = formattedTimeSpent[index];
      

      return {
        question: question.question,
        userAnswer: question.answers[letterToIndex(userAnswerLetter)],
        correctAnswer: question.answers[letterToIndex(correctAnswerLetter)],
        tabChanges: tabchanges,
        durationPerQuestion: duration_per_question,
      };
    }),
    score: score,
    percentage: percentage,
    user_time: formattedTotalDuration,
    total_duration: remainingTime,
  };
  console.log(data);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Handle the response as a Blob
    const pdfBlob = await response.blob();
    return pdfBlob;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

function QuizResultsPDF({ questions, score,answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime,images }) {
  const { data: session } = useSession();

  
  
  const renderButton = () => {
    return (
      <button
        className="flex items-center gap-1 bg-gray-400 p-2 rounded-sm shadow-md text-white"
        onClick={handleDownload}
      >
        <span>
          <FaDownload />
        </span>
        <span>Download Company PDF</span>
      </button>
      
    );
  };
 

  const handleDownload = async () => {
    const pdfBlob = await callApi(questions, score, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime, session.user,images
      )
     

    if (pdfBlob) {
      // Download the PDF file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quiz-results.pdf";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return renderButton() ;
}

function QuizResultsPDF_user({ questions, score,answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime }) {
  const { data: session } = useSession();
  
  
  const renderButton = () => {
    return (
      <button
        className="flex items-center gap-1 bg-gray-400 p-2 rounded-sm shadow-md text-white"
        onClick={handleDownload_user}
      >
        <span>
          <FaDownload />
        </span>
        <span>Download User PDF</span>
      </button>
      
    );
  };

  const handleDownload_user = async () => {
    const pdfBlob = await callApi_user(questions, score, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime, session.user
      )
     

    if (pdfBlob) {
      // Download the PDF file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quiz-results.pdf";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return renderButton() ;
}


  export default function Home ({ exercises }) {
    console.log("exercises",exercises)
     const { data: session } = useSession();
const userId = session?.user?.id || null;
    const initialState = {
      isExerciseShown: false,
      exerciseId: null,
      questions: exercises, // use exercises data from props
      isExerciseDone: false,
      score: 0,
      answers:[],
      formattedTimeSpent: [], 
      tabSwitchCount:[],
      formattedTotalDuration:null,
      remainingTime:null,
      images:[]
    
    };
    
    const [state, setState] = useState(initialState);
    const { isExerciseShown, questions, isExerciseDone, score,answers,formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime,images} = state;

    const callApi = async (questions, score, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration, remainingTime, user, images) => {
      const apiUrl = "http://localhost:3000/api/auth/quiz-history";
      const totalTabSwitchCount = tabSwitchCount.reduce((acc, curr) => acc + curr, 0);

      const data = {
        quizId: exercises[0].id, // Send the quiz ID
        userId: user.id,
        exerciseTitle: exercises[0].title,
        score: score,
        questions: questions.map((question, index) => {
          const userAnswerLetter = answers[index];
          const correctAnswerLetter = question.correctAnswer;
          const tabchanges= totalTabSwitchCount;
          const duration_per_question = formattedTimeSpent[index];
          
          return {
            question: question.question,
            userAnswer: question.answers[letterToIndex(userAnswerLetter)],
            correctAnswer: question.answers[letterToIndex(correctAnswerLetter)],
            tabChanges: tabchanges,
            durationPerQuestion: duration_per_question,
          };
        }),
        answers: answers,
        timeSpent: formattedTotalDuration,
        tabSwitchCount: tabSwitchCount,
        totalDuration: remainingTime, // This might need to be formatted
        remainingTime: remainingTime, // This might need to be formatted
        images: images
      };
    
      console.log(data);
    
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        // Handle the response as JSON
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };
    const showExercise = async (id) => {
      // Check if the user has given permissions to access the webcam
      const hasWebcamPermission = await checkWebcamPermission();
      if (!hasWebcamPermission) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'We need camera access to verify your identity!',
          footer: '<a href="">Why do I have this issue?</a>'
        });
        return;
      }
    
      // Start the exercise
      setState({
        ...state,
        isExerciseShown: true,
      });
    };
    
    
    const hideExercise = () => {
      window.location.reload();


    };
     const finishTest =(score,answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime,images) => {
     console.log("score",score)
     console.log("answers",answers)
      console.log("formattedTimeSpent",formattedTimeSpent)
      console.log("tabSwitchCount",tabSwitchCount)
      console.log("formattedTotalDuration",formattedTotalDuration)
      console.log("remainingTime",remainingTime)
      console.log("images:",images)

        setState({
            ...state,
            isExerciseDone: true,
            score,
            answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime,images
        });
        callApi(questions, score, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration,remainingTime, session.user,images)
    };
    return (
      <>
        <Head>
          <title>Quiz</title>
          <meta name="description" content="Quiz app in next js" />
        </Head>
    
        <div className="flex">
          <SideNavbar />
          <main className="flex-1 flex flex-col justify-center items-center ml-64 p-8"> {/* Keep ml-64 or adjust as needed */}
            <div className="w-full max-w-4xl"> {/* Restrict width */}
              {!isExerciseShown ? (
                <ExerciseList exercises={exercises} func={showExercise} />
              ) : isExerciseDone ? (
                <div className="flex flex-col items-center">
                  <p className="my-4 text-lg font-bold text-gray-700">
                    You answered {score}/{questions.length} correctly!
                  </p>
                  <QuizResults score={score} totalQuestions={questions.length} />
                  <div className={styles.quiz_results_container}>
                    <div className={styles.sized_box}></div>
                    
                  </div>
                  <div className="flex justify-center w-full">
                    <button
                      className="mt-4 flex items-center justify-center gap-1 bg-indigo-600 p-2 rounded-md shadow-md text-white hover:bg-indigo-700 transition duration-200"
                      onClick={hideExercise}
                    >
                      <FaArrowLeft />
                      <span>Back</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Question
                userId={userId}
                  questions={questions}
                  hideExercise={hideExercise}
                  finishTest={finishTest}

                  
                />
              )}
            </div>
          </main>
        </div>
      </>
    );
    
            }     