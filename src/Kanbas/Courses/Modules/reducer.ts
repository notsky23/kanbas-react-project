import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { modules } from "../../Database";
import { Module, ModulesState } from "./moduleTypes";

const initialState: ModulesState = {
    modules: [],
    module: { _id: '', name: "New Module", description: "New Description", course: "New Course",
        lessons: [{_id: "", name: "", description: "", module: "" }] },
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action) => {
        state.modules = action.payload;
    },
    addModule: (state, action) => {
        state.modules = [
            ...state.modules,
            { ...action.payload },
        ];
    },
    deleteModule: (state, action) => {
        state.modules = state.modules.filter(
            (module) => module._id !== action.payload
        );
    },
    updateModule: (state, action) => {
        state.modules = state.modules.map((module) => {
            if (module._id === action.payload._id) {
                return action.payload;
            } else {
                return module;
            }
        });
    },
    setModule: (state, action) => {
        // Check if action.payload has an _id to determine if it's an existing module
        if (action.payload._id) {
            state.module = { ...state.module, ...action.payload };
        } else {
            state.module = { ...state.module, ...action.payload };
        }
    },
  },
});

export const { addModule, deleteModule,
  updateModule, setModule, setModules } = modulesSlice.actions;
export default modulesSlice.reducer;