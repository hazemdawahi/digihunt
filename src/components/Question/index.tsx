/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Answers from "./Answers";
import NavigationButton from "./NavigationButton";

export default function Question({ questions, hideExercise, finishTest }) {
    const initialState = {
        currentQuestion: 0,
        answers: [],
        numberOfQuestions: questions.length,
        correctAnswers: [],
    };
    const [state, setState] = useState(initialState);
    const { currentQuestion, answers, numberOfQuestions } = state;
    const question = questions[currentQuestion];
    const [remainingTime, setRemainingTime] = useState(1 * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (remainingTime <= 0) {
            submitAnswer();
        }
    }, [remainingTime]);


    const submitAnswer = () => {
        let totalScore = 0;
        for (let i = 0; i < questions.length; i++) {
            if (answers[i] === questions[i].correctAnswer) totalScore++;
        }
        finishTest(totalScore,answers);
    };
    const answerQuestion = (answer) => {
        answers[currentQuestion] = answer;
        setState({
            ...state,
            answers,
        });
    };

    const moveQuestion = (direction) => {
        switch (direction) {
            case "next": {
                if (currentQuestion === numberOfQuestions - 1) {
                    submitAnswer();
                    return;
                }
                setState({
                    ...state,
                    currentQuestion: currentQuestion + 1,
                });
                break;
            }
            case "prev": {
                setState({
                    ...state,
                    currentQuestion: currentQuestion - 1,
                });
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>{`${Math.floor(remainingTime / 60)}:${(remainingTime % 60)
                    .toString()
                    .padStart(2, "0")}`}</div>
                <button className="flex items-center gap-1 bg-gray-300 p-2 rounded-sm shadow-md text-white" onClick={hideExercise}>
                    <span>
                        <FaArrowLeft />
                    </span>
                    <span>Back</span>
                </button>
            </div>
            <h1 className="text-2xl mt-2 capitalize">{`${
                state.currentQuestion + 1
            }. ${question.question}`}</h1>
            <Answers
                answers={question.answers}
                answerQuestion={answerQuestion}
                state={state}
            />

            <NavigationButton state={state} moveQuestion={moveQuestion} />
        </div>
    );
}