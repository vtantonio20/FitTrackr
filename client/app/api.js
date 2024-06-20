import axios from "axios";

export const API_URL = 'http://192.168.1.88:5000/'

export const fetchWorkoutsData = async () => {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data;
}

export const fetchWorkoutData = async (workoutId) => {
    const response = await axios.get(`${API_URL}/workout/${workoutId}`);
    return response.data;
}

export const fetchMuscleMapData = async () => {
    const response = await axios.get(`${API_URL}/muscles`);
    return response.data;
}

export const createWorkout = async (workoutData) => {
    const response = await axios.post(`${API_URL}/create-workout`, workoutData);
    return response.data;
};

export const fetchExerciseData = async (musclesNamesList) => {
    // Ensure muscleNamesList is an array
    if (!Array.isArray(musclesNamesList)) {
        throw new Error('musclesNamesList must be an array');
    }
    const params = { name: musclesNamesList };
    const response = await axios.get(`${API_URL}/exercises`, { params });
    return response.data;
}

export const addExerciseToWorkout = async (workoutId, exerciseData) => {
    const response = await axios.patch(`${API_URL}/add-exercise/${workoutId}`, exerciseData);
    return response.data;
}

export const updateExerciseOnWorkout = async (exerciseId, exerciseData) => {
    const response = await axios.patch(`${API_URL}/edit-exercise/${exerciseId}`, exerciseData);
    return response.data;
}

// Suggestion Api request
// This will fetch just the exercises associated with a passed in muscle id
export const fetchExerciseSuggestionsFromMuscle = async (muscleId) => {
    const response = await axios.get(`${API_URL}/exercise/${muscleId}`);
    return response.data;
}