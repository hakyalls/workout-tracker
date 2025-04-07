import { useState } from "react";

const initialExercises = [
  { name: "Bench Press", threeRM: 225, lastWeight: 185, lastReps: 5 },
  { name: "Squat", threeRM: 315, lastWeight: 275, lastReps: 4 },
  { name: "Deadlift", threeRM: 365, lastWeight: 335, lastReps: 3 },
];

export default function WorkoutTracker() {
  const [exercises, setExercises] = useState(initialExercises);
  const [workoutData, setWorkoutData] = useState({});

  const handleInputChange = (exercise, field, value) => {
    setWorkoutData((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving workout data:", workoutData);
  };

  return (
    <div className="p-4 grid gap-4">
      {exercises.map((exercise) => {
        const suggestedWeight = Math.round(exercise.threeRM * 0.85);
        const log = workoutData[exercise.name] || {};

        return (
          <div key={exercise.name} className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-2">{exercise.name}</h2>
            <p className="text-sm mb-1">
              Last: {exercise.lastWeight} lbs × {exercise.lastReps} reps
            </p>
            <p className="text-sm mb-2 text-gray-500">
              Suggested: {suggestedWeight} lbs (85% of 3RM)
            </p>
            <div className="flex gap-2 items-center mb-2">
              <input
                className="border p-2 rounded w-1/2"
                placeholder="Weight"
                type="number"
                value={log.weight || ""}
                onChange={(e) =>
                  handleInputChange(exercise.name, "weight", e.target.value)
                }
              />
              <input
                className="border p-2 rounded w-1/2"
                placeholder="Reps"
                type="number"
                value={log.reps || ""}
                onChange={(e) =>
                  handleInputChange(exercise.name, "reps", e.target.value)
                }
              />
            </div>
            <input
              className="border p-2 rounded w-full"
              placeholder="Notes (optional)"
              value={log.notes || ""}
              onChange={(e) =>
                handleInputChange(exercise.name, "notes", e.target.value)
              }
            />
          </div>
        );
      })}
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-blue-600 text-white p-3 rounded-xl"
      >
        Save Workout
      </button>
    </div>
  );
}