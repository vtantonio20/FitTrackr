import axios from "axios";

export const API_URL = 'http://172.20.10.2:5000'

export const doFetchWorkout = async (workoutId) => {
    const response = await axios.get(`${API_URL}/workout/${workoutId}`);
    return response.data;
}

export const doFetchWorkouts = async () => {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data;
}

export const doFetchActiveWorkout = async () => {
    const response = await axios.get(`${API_URL}/active-workout`);
    return response.data;
}

export const doFetchInactiveWorkouts = async (startDate, endDate) => {
    const response = await axios.get(`${API_URL}/inactive-workouts`, {
        params: {
            start_date: startDate,
            end_date: endDate
        }
    });
    return response.data;
}

export const doCreateWorkout = async (workoutData) => {
    const response = await axios.post(`${API_URL}/create-workout`, workoutData);
    return response.data;
};

export const doCreateExercise = async (workoutId, exerciseData) => {
    const response = await axios.patch(`${API_URL}/create-exercise/${workoutId}`, exerciseData);
    return response.data;
}

export const doUpdateWorkout = async (workoutId, workoutData) => {
    const response = await axios.patch(`${API_URL}/edit-workout/${workoutId}`, workoutData);
    return response.data;
}

export const doToggleWorkoutActivation = async (workoutId) => {
    // const response = await axios.patch(``)
}

export const doUpdateExercise = async (exerciseId, exerciseData) => {
    const response = await axios.patch(`${API_URL}/edit-exercise/${exerciseId}`, exerciseData);
    return response.data;
}


export const doDeleteExercise = async (exerciseId) => {
    const response = await axios.delete(`${API_URL}/workout/delete-exercise/${exerciseId}`);
    return response.data;
}

export const doDeleteWorkout = async (workoutId) => {
    const response = await axios.delete(`${API_URL}/delete-workout/${workoutId}`);
    return response.data;
}

// Suggestions Api request
export const doFetchMuscleMap = async () => {
    const response = await axios.get(`${API_URL}/suggestions/muscles`);
    return response.data;
}

// This will fetch just the exercises associated with a passed in muscle id
export const doFetchExerciseSuggestions = async (muscleId) => {
    const response = await axios.get(`${API_URL}/suggestions/exercise/${muscleId}`);
    return response.data;
}
