export default function ExerciseList({ exercises, func }) {
  return (
    <>
      <h3 className="text-2xl mb-6 text-center text-indigo-600 font-bold">Pick a Quiz</h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {exercises.map((exercise) => (
          <div 
            className="w-full p-6 rounded-lg shadow-2xl bg-white transition-transform transform hover:scale-105 duration-200 ease-in-out" 
            key={exercise.id}
          >
            <img src={exercise.company.image} alt={exercise.company.company_name} className="w-24 h-24 mb-4 rounded-full mx-auto"/>
            <h4 className="text-lg font-bold mb-2 text-indigo-600 text-center">{exercise.title}</h4>
            <div className="mb-4 text-gray-600 text-center">
              <p>Type: {exercise.type}</p>
              <p>Level: {exercise.level}</p>
              <p>Question Number: {exercise.questionNum}</p>
              <p>Time: {exercise.timeInMins} mins</p>
            </div>
            <button 
              onClick={() => func(exercise.id)}
              className="w-full py-2 px-4 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition duration-200"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
