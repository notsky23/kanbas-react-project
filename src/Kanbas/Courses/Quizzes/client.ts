import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE?.replace(/\/+$/, "");

// const COURSES_API = "http://localhost:4000/api/courses";
// const COURSES_API = "https://kanbas-node-server-app-vvg4.onrender.com/api/courses";
const COURSES_API = `${API_BASE}/api/courses`;
// const QUIZZES_API = "http://localhost:4000/api/quizzes";
// const QUIZZES_API = "https://kanbas-node-server-app-vvg4.onrender.com/api/quizzes";
const QUIZZES_API = `${API_BASE}/api/quizzes`;

// Create
export const createQuiz = async (courseId: string, quiz: any) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
    return response.data;
};

// Read/Retrieve
// Get all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
};
// Get a single quiz by ID
export const findQuizById = async (courseId: string, quizId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/quizzes/${quizId}`);
    return response.data;
};

// Update
export const updateQuiz = async (quiz: any) => {
    const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.status;
};

// Delete
export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.status;
};