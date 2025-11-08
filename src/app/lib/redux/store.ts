import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer from "lib/redux/settingsSlice";
import jdAnalyzerReducer from "lib/redux/jdAnalyzerSlice";
import canvasReducer from "lib/redux/canvasSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
    jdAnalyzer: jdAnalyzerReducer,
    canvas: canvasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
