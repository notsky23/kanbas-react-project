import { createSlice } from "@reduxjs/toolkit";
import { quizzes } from "../../Database";
import { Quiz } from "./quizTypes";

const initialState = {
    quizzes: quizzes,
    quiz: null as Quiz | null,  // This ensures that the initial quiz matches the Quiz type or is null
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    addQuiz: (state, action) => {
        state.quizzes.push({
            ...action.payload,
            course: action.payload.course || state.quiz?.course,
            _id: action.payload._id || new Date().getTime().toString(),
        });
    },
    deleteQuiz: (state, action) => {
        state.quizzes = state.quizzes.filter(
            (quiz) => quiz._id !== action.payload
        );
    },
    updateQuiz: (state, action) => {
        state.quizzes = state.quizzes.map((quiz) => {
            if (quiz._id === action.payload._id) {
                return action.payload;
            } else {
                return quiz;
            }
        });
    },
    selectQuiz: (state, action) => {
        state.quiz = state.quizzes.find(
            (quiz) => quiz._id === action.payload
        ) || null;
    },
  },
});

export const { addQuiz, deleteQuiz, updateQuiz, selectQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;