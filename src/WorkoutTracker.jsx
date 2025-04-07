import { useEffect, useState } from "react";

const SHEETDB_API = import.meta.env.VITE_REACT_APP_SHEETDB_API;

export default function WorkoutTracker() {
  const [program, setProgram] = useState([]);
  const [workoutData, setWorkoutData] = useState({});

  useEffect(() => {
    const fetchProgram = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        const res = await fetch(`${SHEETDB_API}?sheet=Program`);
        const json = await res.json();
        const todaysProgram = json.filter(row => row.Date === today);
        setProgram(todaysProgram);
      } catch (err) {
        console.error("Error loading program:", err);
      }
    };

    fetchProgram();
  }, []);

  const handleInputChange = (key, field, value) => {
    setWorkoutData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const entries = Object.entries(workoutData).map(([key, data], i) => {
      const [exercise] = key.split("-");
      return {
        Date: new Date().toISOString().split('T')[0],
        Exercise: exercise,
        Set: i + 1,
        Weight: data.weight,
        Reps: data.reps,
        Notes: data.notes || '',
      };
    });

    try {
      const response = await fetch(SHEETDB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: entries }),
      });

      if (response.ok) {
        alert("Workout saved!");
      } else {
        alert("Failed to save workout.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving workout.");
    }
  };

  return (
    <div className="p-4 grid gap-4">
      {program.map((exercise, i) => {
        const key = \`\${exercise.Exercise}-\${i}\`;
        const log = workoutData[key] || {};

        return (
          <div key={key} className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-2">{exercise.Exercise}</h2>
            <p className="text-sm mb-1">
              Last: {exercise.LastWeight} lbs × {exercise.LastReps} reps
            </p>
            <p className="text-sm mb-2 text-gray-500">
              Programmed: {exercise.Set} sets × {exercise.Rep} reps
            </p>
            <div className="flex gap-2 items-center mb-2">
              <input
                className="border p-2 rounded w-1/2"
                placeholder="Weight"
                type="number"
                value={log.weight || ""}
                onChange={(e) =>
                  handleInputChange(key, "weight", e.target.value)
                }
              />
              <input
                className="border p-2 rounded w-1/2"
                placeholder="Reps"
                type="number"
                value={log.reps || ""}
                onChange={(e) =>
                  handleInputChange(key, "reps", e.target.value)
                }
              />
            </div>
            <input
              className="border p-2 rounded w-full"
              placeholder="Notes (optional)"
              value={log.notes || ""}
              onChange={(e) =>
                handleInputChange(key, "notes", e.target.value)
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