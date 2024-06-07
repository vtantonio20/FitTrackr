import axios from "axios";

export const API_URL = 'http://192.168.1.88:5000/'

export const fetchWorkoutData = async () => {
    const response = await axios.get(`${API_URL}/workouts`);
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
