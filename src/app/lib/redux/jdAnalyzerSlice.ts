import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface JDAnalysisResult {
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    matchedSkills: string[];
    missingSkills: string[];
    suggestions: string[];
    atsCompatibilityScore: number;
}

export interface JDAnalyzerState {
    resumeFileName: string;
    resumeText: string;
    jdText: string;
    jdFileName: string;
    analysisResult: JDAnalysisResult | null;
}

const initialState: JDAnalyzerState = {
    resumeFileName: "",
    resumeText: "",
    jdText: "",
    jdFileName: "",
    analysisResult: null,
};

// Load from localStorage
const loadStateFromLocalStorage = (): JDAnalyzerState => {
    try {
        const serializedState = localStorage.getItem("jd-analyzer-data");
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Failed to load JD analyzer state from localStorage:", err);
        return initialState;
    }
};

// Save to localStorage
const saveStateToLocalStorage = (state: JDAnalyzerState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("jd-analyzer-data", serializedState);
    } catch (err) {
        console.error("Failed to save JD analyzer state to localStorage:", err);
    }
};

export const jdAnalyzerSlice = createSlice({
    name: "jdAnalyzer",
    initialState: loadStateFromLocalStorage(),
    reducers: {
        setResumeData: (
            state,
            action: PayloadAction<{ fileName: string; text: string }>
        ) => {
            state.resumeFileName = action.payload.fileName;
            state.resumeText = action.payload.text;
            saveStateToLocalStorage(state);
        },
        setJDText: (state, action: PayloadAction<string>) => {
            state.jdText = action.payload;
            state.jdFileName = "";
            saveStateToLocalStorage(state);
        },
        setJDFile: (
            state,
            action: PayloadAction<{ fileName: string; text: string }>
        ) => {
            state.jdFileName = action.payload.fileName;
            state.jdText = action.payload.text;
            saveStateToLocalStorage(state);
        },
        setAnalysisResult: (state, action: PayloadAction<JDAnalysisResult>) => {
            state.analysisResult = action.payload;
            saveStateToLocalStorage(state);
        },
        clearAnalyzerData: (state) => {
            state.resumeFileName = "";
            state.resumeText = "";
            state.jdText = "";
            state.jdFileName = "";
            state.analysisResult = null;
            saveStateToLocalStorage(state);
        },
    },
});

export const {
    setResumeData,
    setJDText,
    setJDFile,
    setAnalysisResult,
    clearAnalyzerData,
} = jdAnalyzerSlice.actions;

export const selectJDAnalyzer = (state: RootState) => state.jdAnalyzer;

export default jdAnalyzerSlice.reducer;
