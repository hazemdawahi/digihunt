import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Answers from "./Answers";
import NavigationButton from "./NavigationButton";
import Webcam from "react-webcam";

export default function Question({ questions, hideExercise, finishTest }) {
    const initialState = {
        currentQuestion: 0,
        answers: [],
        numberOfQuestions: questions.length,
        correctAnswers: [],
        timeSpent: new Array(questions.length).fill(0),
        tabSwitchCount: new Array(questions.length).fill(0),
    };
    const [state, setState] = useState(initialState);
    const { currentQuestion, answers, numberOfQuestions, timeSpent, tabSwitchCount } = state;
    const question = questions[currentQuestion];
    
    const [remainingTime, setRemainingTime] = useState(questions[0].timeInMins * 60);
    const startTime = useRef(Date.now());
    const isHiddenRef = useRef(false);

    const webcamRef = useRef(null);
    const capturedImages = useRef([]);
    let imageCaptureInterval = null;

    useEffect(() => {
        console.log(questions)
        imageCaptureInterval = setInterval(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            capturedImages.current.push(imageSrc);
            console.log('Captured Image:', imageSrc); // Log the captured image
        }, 5000); // Capture image every second
    
        return () => clearInterval(imageCaptureInterval);
    }, []);
    
    useEffect(() => {
    const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);

    useEffect(() => {
        if (remainingTime <= 0) {
            submitAnswer();
        }
    }, [remainingTime]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                isHiddenRef.current = true;
                const updatedTimeSpent = updateQuestionTime();
                setState({ ...state, timeSpent: updatedTimeSpent });
                startTime.current = Date.now();
            } else {
                if (isHiddenRef.current) {
                    const updatedTabSwitchCount = [...tabSwitchCount];
                    updatedTabSwitchCount[currentQuestion]++;
                    const elapsedTime = Math.floor((Date.now() - startTime.current) / 1000);
                    const updatedTimeSpent = [...timeSpent];
                    updatedTimeSpent[currentQuestion] += elapsedTime;
                    setState({ ...state, tabSwitchCount: updatedTabSwitchCount, timeSpent: updatedTimeSpent });
                    isHiddenRef.current = false;
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [currentQuestion, state]);

    useEffect(() => {
        startTime.current = Date.now();
    }, [currentQuestion]);

    const formatDuration = (seconds) => {
        return `${Math.floor(seconds / 60)}min ${seconds % 60}sec`;
    };
    const uploadToCloudinary = async (base64Image: string): Promise<string> => {
        const response = await fetch('http://localhost:3000/api/auth/upload', {
          method: 'POST',
          body: JSON.stringify({ data: base64Image }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
        if (!response.ok) {
          throw new Error('Upload to Cloudinary failed');
        }
      
        const data = await response.json();
        return data.url;
      };
      
    const updateQuestionTime = () => {
        const updatedTimeSpent = [...timeSpent];
        updatedTimeSpent[currentQuestion] += Math.floor((Date.now() - startTime.current) / 1000);
        startTime.current = Date.now();
        return updatedTimeSpent;
    };

    const submitAnswer = async () => {
        clearInterval(imageCaptureInterval);
        let totalScore = 0;
        const updatedTimeSpent = updateQuestionTime();
        const totalDuration = 5 * 60;
        const formattedTimeSpent = updatedTimeSpent.map((time) => formatDuration(time));
    
        for (let i = 0; i < questions.length; i++) {
            if (answers[i] === questions[i].correctAnswer) totalScore++;
        }
    
        const timeItTook = totalDuration - remainingTime;
        const formattedTimeItTook = formatDuration(timeItTook);
        const formattedTotalDuration = formatDuration(totalDuration);
    
        // Iterate over captured images and upload each one to Cloudinary
        const imageUrls = await Promise.all(capturedImages.current.map(uploadToCloudinary));
    
        console.log('Cloudinary Image URLs:', imageUrls);
        finishTest(totalScore, answers, formattedTimeSpent, tabSwitchCount, formattedTotalDuration, formattedTimeItTook, imageUrls);
    };
    
    

    const answerQuestion = (answer) => {
        answers[currentQuestion] = answer;
        setState({
            ...state,
            answers,
        });
    };

    const moveQuestion = (direction) => {
        const updatedTimeSpent = updateQuestionTime();
        switch (direction) {
            case "next": {
                if (currentQuestion === numberOfQuestions - 1) {
                    submitAnswer();
                    return;
                }
                setState({
                    ...state,
                    currentQuestion: currentQuestion + 1,
                    timeSpent: updatedTimeSpent,
                });
                break;
            }
            case "prev": {
                setState({
                    ...state,
                    currentQuestion: currentQuestion - 1,
                    timeSpent: updatedTimeSpent,
                });
                break;
            }
            default:
                break;
        }
    };

    return (
        
        <div>
              <button className="flex items-center gap-1 bg-gray-300 p-2 rounded-sm shadow-md text-white" onClick={hideExercise}>
                    <span>
                        <FaArrowLeft />
                    </span>
                    <span>Back</span>
                </button>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                // style={{
                //     position: 'absolute',
                //     left: '-9999px',
                //     top: '-9999px',
                //   }}
            />
            <div className="flex justify-between items-center mb-4">
                <div>{`${Math.floor(remainingTime / 60)}:${(remainingTime % 60)
                    .toString()
                    .padStart(2, "0")}`}</div>
              
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