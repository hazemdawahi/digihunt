/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default function ExerciseList({ exercises, func }) {
    return (
      <>
        <h3 className="text-2xl">Pick an Exercise</h3>
        {exercises.map((exercise) => (
          <div className="bg-gray-100 p-4 rounded-md mb-4" key={exercise.id}>
            <h4 className="text-lg font-bold mb-2">{exercise.title}</h4>
            <p className="mb-2">{exercise.description}</p>
            <button onClick={() => func(exercise.id)}>Start Exercise</button>
          </div>
        ))}
      </>
    );
  }

  
  
  
  
  
  