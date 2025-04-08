import { useEffect, useState } from "react";

const SHEETDB_API = import.meta.env.VITE_REACT_APP_SHEETDB_API || "";

if (!SHEETDB_API) {
  console.error("⚠️ SHEETDB_API is not set. Check your Vercel env variables.");
}

export default function WorkoutTracker() {
  const [program, setProgram] = useState([]);
  const [workoutData, setWorkoutData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleSaveSingle = async (index) => {
    const exercise = program[index];
    const key = `${exercise.Exercise}-${index}`;
    const data = workoutData[key] || {};
    const payload = [{
      Date: new Date().toISOString().split("T")[0],
      Exercise: exercise.Exercise,
      Set: data.sets || "",
      Weight: data.weight || "",
      Reps: data.reps || "",
      Notes: data.notes || "",
    }];

    try {
      const response = await fetch(`${SHEETDB_API}?sheet=WorkoutLog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        alert("Failed to save workout.");
      }
    } catch (err) {
      console.error("Error saving workout:", err);
      alert("Error saving workout.");
    }
  };

  const handleSaveAndNext = async () => {
    await handleSaveSingle(activeIndex);
    if (activeIndex < program.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      alert("Workout complete!");
    }
  };

  return (
    <div className="p-4 grid gap-4">
      {program.length > 0 && (
        (() => {
          const exercise = program[activeIndex];
          const key = `${exercise.Exercise}-${activeIndex}`;
          const log = workoutData[key] || {};

          return (
            <div key={key} className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-2">{exercise.Exercise}</h2>
              <p className="text-sm mb-1">
                Last: {exercise.LastWeight} lbs × {exercise.LastReps} reps
              </p>
              <p className="text-sm mb-2 text-gray-500">
                Programmed: {exercise.Set} sets × {exercise.Reps} reps
              </p>
              {exercise.Notes && (
                <p className="text-sm italic text-gray-600 mb-2">
                  Notes: {exercise.Notes}
                </p>
              )}
              <div className="flex gap-2 items-center mb-2">
                <input
                  className="border p-2 rounded w-1/3"
                  placeholder="Weight"
                  type="text"
                  value={log.weight || ""}
                  onChange={(e) =>
                    handleInputChange(key, "weight", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded w-1/3"
                  placeholder="Reps"
                  type="number"
                  value={log.reps || ""}
                  onChange={(e) =>
                    handleInputChange(key, "reps", e.target.value)
                  }
                />
                <input
                  className="border p-2 rounded w-1/3"
                  placeholder="Sets"
                  type="number"
                  value={log.sets || ""}
                  onChange={(e) =>
                    handleInputChange(key, "sets", e.target.value)
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
        })()
      )}

      {program.length > 0 && (
        <button
          onClick={handleSaveAndNext}
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          {activeIndex < program.length - 1 ? "Save & Next Exercise" : "Workout Done"}
        </button>
      )}
    </div>
  );
}
