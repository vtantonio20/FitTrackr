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
    const params = { name: musclesNamesList };
    const response = await axios.get(`${API_URL}/exercises`, { params });
    return response.data;
}

export const addExerciseToWorkout = async (workoutId, exerciseData) => {
    const response = await axios.patch(`${API_URL}/add-exercise/${workoutId}`, exerciseData);
    return response.data;
}

export const fetchWorkoutExerciseData = async (exerciseId) => {
    const response = await axios.get(`${API_URL}/workout/exercise/<int:exercise_id>/${exerciseId}`);
    return response.data;
}