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
import SideNavbar from "./SideNavbar";
import QuizResults from './doughuntchart';

export function getServerSideProps() {
    const exercises = [
        { id: 0, title: "Linux Test" },
        { id: 1, title: "Javascript Test" },
    ];

    return {
        props: {
            exercises,
        },
    };
}function letterToIndex(letter, returnLetter = false) {
  if (!letter) return -1;
  if (returnLetter) return letter;
  const lowerLetter = letter.toLowerCase();
  return lowerLetter.charCodeAt(0) - 'a'.charCodeAt(0);
}

const callApi = async (questions, score, answers) => {
  const apiUrl = "http://localhost:3000/api/auth/pdf";

  const data = {
    questions: questions.map((question, index) => {
      const userAnswerLetter = answers[index];
      const correctAnswerLetter = question.correctAnswer;
      return {
        question: question.question,
        userAnswer: question.answers[letterToIndex(userAnswerLetter)],
        correctAnswer: question.answers[letterToIndex(correctAnswerLetter)],
      };
    }),
    score: score,
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


function QuizResultsPDF({ questions, score,answers }) {
  const renderButton = () => {
    return (
      <button
        className="flex items-center gap-1 bg-gray-400 p-2 rounded-sm shadow-md text-white"
        onClick={handleDownload}
      >
        <span>
          <FaDownload />
        </span>
        <span>Download PDF</span>
      </button>
    );
  };

  const handleDownload = async () => {
    const pdfBlob = await callApi(questions, score,answers);

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

  return renderButton();
}
export function getQuestions(exerciseId) {
    const allQuestions  = [
        {
            id: 1,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher le contenu d'un fichier en ligne de commande ?",
            answers: [
              "cat",
              "ls",
              "cd",
              "pwd"
            ],
            correctAnswer: "a"
          },
          {
            id: 2,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour créer un nouveau dossier en ligne de commande ?",
            answers: [
              "mkdir",
              "touch",
              "cp",
              "rm"
            ],
            correctAnswer: "a"
          },
          {
            id: 3,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour changer les permissions d'un fichier en ligne de commande ?",
            answers: [
              "chmod",
              "chown",
              "chgrp",
              "umask"
            ],
            correctAnswer: "a"
          },
          {
            id: 4,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher le contenu d'un dossier en ligne de commande ?",
            answers: [
              "ls",
              "cat",
              "cd",
              "pwd"
            ],
            correctAnswer: "a"
          },
          {
            id: 5,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour supprimer un fichier en ligne de commande ?",
            answers: [
              "rm",
              "mv",
              "cp",
              "touch"
            ],
            correctAnswer: "a"
          },
          {
            id: 6,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher l'adresse IP d'une machine en ligne de commande ?",
            answers: [
              "ifconfig",
              "ip",
              "ping",
              "netstat"
            ],
            correctAnswer: "a"
          },
          {
            id: 7,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher le contenu d'un fichier page par page en ligne de commande ?",
            answers: [
              "less",
              "more",
              "cat",
              "head"
            ],
            correctAnswer: "a"
          },
          {
            id: 8,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher les processus en cours d'exécution en ligne de commande ?",
            answers: [
              "ps",
              "kill",
              "top",
              "jobs"
            ],
            correctAnswer: "a"
          },
          {
            id: 9,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour copier des fichiers en ligne de commande ?",
            answers: [
              "cp",
              "mv",
              "rm",
              "touch"
            ],
            correctAnswer: "a"
          },
          {
            id: 10,
            exerciseId: 0,
            question: "Quelle commande est utilisée pour afficher la liste des utilisateurs connectés en ligne de commande ?",
            answers: [
              "who",
              "w",
              "users",
              "last"
            ],
            correctAnswer: "a"
          },
          {    id: 1,    exerciseId: 1,    question: "Quelle est la méthode utilisée pour ajouter un élément à la fin d'un tableau en JavaScript ?",    answers: [      "append()",      "push()",      "add()",      "concat()"    ],
          correctAnswer: "b"
        },
        {
          id: 2,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour supprimer le dernier élément d'un tableau en JavaScript ?",
          answers: [
            "pop()",
            "delete()",
            "remove()",
            "splice()"
          ],
          correctAnswer: "a"
        },
        {
          id: 3,
          exerciseId: 1,
          question: "Quel est l'opérateur utilisé pour la comparaison stricte en JavaScript ?",
          answers: [
            "==",
            "===",
            "!=",
            "!=="
          ],
          correctAnswer: "b"
        },
        {
          id: 4,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour concaténer deux chaînes de caractères en JavaScript ?",
          answers: [
            "concat()",
            "join()",
            "slice()",
            "split()"
          ],
          correctAnswer: "a"
        },
        {
          id: 5,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour convertir une chaîne de caractères en entier en JavaScript ?",
          answers: [
            "toNumber()",
            "toInt()",
            "parseInt()",
            "convertToNumber()"
          ],
          correctAnswer: "c"
        },
        {
          id: 6,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour obtenir le nombre d'éléments dans un tableau en JavaScript ?",
          answers: [
            "count()",
            "length()",
            "size()",
            "getLength()"
          ],
          correctAnswer: "b"
        },
        {
          id: 7,
          exerciseId: 1,
          question: "Quel est l'objet global en JavaScript ?",
          answers: [
            "document",
            "window",
            "body",
            "head"
          ],
          correctAnswer: "b"
        },
        {
          id: 8,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour arrondir un nombre à l'entier le plus proche en JavaScript ?",
          answers: [
            "round()",
            "floor()",
            "ceil()",
            "abs()"
          ],
          correctAnswer: "a"
        },
        {
          id: 9,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour rechercher un élément dans un tableau en JavaScript ?",
          answers: [
            "find()",
            "search()",
            "lookup()",
            "indexOf()"
          ],
          correctAnswer: "d"
        },
        {
          id: 10,
          exerciseId: 1,
          question: "Quelle est la méthode utilisée pour trier les éléments d'un tableau en JavaScript ?",
          answers: [
            "sort()",
            "order()",
            "arrange()",
            "group()"
          ],
          correctAnswer: "a"
        }
          
    ];
  
    
    const selectedQuestions = [];
    const totalQuestions = allQuestions.filter(q => q.exerciseId === exerciseId);
  
    while (selectedQuestions.length < 5 && totalQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * totalQuestions.length);
      const randomQuestion = totalQuestions.splice(randomIndex, 1)[0];
      selectedQuestions.push(randomQuestion);
    }
  
    return selectedQuestions;
  }

  export default function Home ({ exercises }) {
    const initialState = {
      isExerciseShown: false,
      exerciseId: null,
      questions: [],
      isExerciseDone: false,
      score: 0,
      answers:[]
    };

    const [state, setState] = useState(initialState);
    const { isExerciseShown, questions, isExerciseDone, score,answers } = state;

    const showExercise = (id) => {
        setState({
            ...state,
            exerciseId: id,
            questions: getQuestions(id),
            isExerciseShown: true,
        });
    };
    const hideExercise = () => {
        setState(initialState);
    };
     const finishTest =(score,answers ) => {
     
        setState({
            ...state,
            isExerciseDone: true,
            score,
            answers
        });
        console.log(answers)
    };
   

      return (
        <>
          <SideNavbar />
          <Head>
            <title>Quiz</title>
            <meta name="description" content="Quiz app in next js" />
          </Head>
          <div className="w-1/2 m-auto mt-[120px] bg-gray-100 p-6 rounded-md shadow-2xl">
            <main className="">
              {!isExerciseShown ? (
                <ExerciseList exercises={exercises} func={showExercise} />
              ) : isExerciseDone ? (
                <div>
                  <p className="my-4">
                    You answered {score}/{questions.length} correctly!
                  </p>
                  <center>
                  <QuizResults score={score} totalQuestions={questions.length} />
                  <QuizResultsPDF questions={questions} score={score} answers={answers} />

</center>

                 
      
                  <button
                    className="flex items-center gap-1 bg-gray-400 p-2 rounded-sm shadow-md text-white"
                    onClick={hideExercise}
                  >
                    <span>
                      <FaArrowLeft />
                    </span>
                    <span>Back</span>
                  </button>
                </div>
              ) : (
                <Question
                  questions={questions}
                  hideExercise={hideExercise}
                  finishTest={finishTest}
                />
              )}
            </main>
          </div>
        </>
      );
              }      