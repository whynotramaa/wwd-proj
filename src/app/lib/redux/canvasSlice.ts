import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type ComponentType =
    | "text"
    | "heading"
    | "image"
    | "section"
    | "bulletList"
    | "divider"
    | "contact"
    | "hyperlink";

export interface CanvasComponent {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    style?: {
        fontSize?: number;
        fontWeight?: string;
        fontStyle?: string;
        color?: string;
        textAlign?: string;
        fontFamily?: string;
        letterSpacing?: string;
        lineHeight?: string;
        dividerThickness?: number;
        href?: string;
    };
    zIndex?: number;
}

export interface CanvasState {
    components: CanvasComponent[];
    selectedComponentId: string | null;
    canvasWidth: number;
    canvasHeight: number;
    isCanvasMode: boolean;
}

const initialState: CanvasState = {
    components: [],
    selectedComponentId: null,
    canvasWidth: 595, // A4 width in pixels at 72 DPI
    canvasHeight: 842, // A4 height in pixels at 72 DPI
    isCanvasMode: false,
};

// Load from localStorage
const loadCanvasState = (): CanvasState => {
    try {
        const serializedState = localStorage.getItem("canvas-resume-data");
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Failed to load canvas state from localStorage:", err);
        return initialState;
    }
};

// Save to localStorage
const saveCanvasState = (state: CanvasState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("canvas-resume-data", serializedState);
    } catch (err) {
        console.error("Failed to save canvas state to localStorage:", err);
    }
};

export const canvasSlice = createSlice({
    name: "canvas",
    initialState: loadCanvasState(),
    reducers: {
        addComponent: (state, action: PayloadAction<Omit<CanvasComponent, "id">>) => {
            const newComponent: CanvasComponent = {
                ...action.payload,
                id: `component-${Date.now()}-${Math.random()}`,
                zIndex: state.components.length,
            };
            state.components.push(newComponent);
            state.selectedComponentId = newComponent.id;
            saveCanvasState(state);
        },
        updateComponent: (
            state,
            action: PayloadAction<{ id: string; updates: Partial<CanvasComponent> }>
        ) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index] = {
                    ...state.components[index],
                    ...action.payload.updates,
                };
                saveCanvasState(state);
            }
        },
        deleteComponent: (state, action: PayloadAction<string>) => {
            state.components = state.components.filter((c) => c.id !== action.payload);
            if (state.selectedComponentId === action.payload) {
                state.selectedComponentId = null;
            }
            saveCanvasState(state);
        },
        selectComponent: (state, action: PayloadAction<string | null>) => {
            state.selectedComponentId = action.payload;
        },
        moveComponent: (
            state,
            action: PayloadAction<{ id: string; x: number; y: number }>
        ) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index].x = action.payload.x;
                state.components[index].y = action.payload.y;
                saveCanvasState(state);
            }
        },
        resizeComponent: (
            state,
            action: PayloadAction<{ id: string; width: number; height: number }>
        ) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index].width = action.payload.width;
                state.components[index].height = action.payload.height;
                saveCanvasState(state);
            }
        },
        updateComponentContent: (
            state,
            action: PayloadAction<{ id: string; content: string }>
        ) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index].content = action.payload.content;
                saveCanvasState(state);
            }
        },
        updateComponentStyle: (
            state,
            action: PayloadAction<{ id: string; style: CanvasComponent["style"] }>
        ) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index].style = {
                    ...state.components[index].style,
                    ...action.payload.style,
                };
                saveCanvasState(state);
            }
        },
        clearCanvas: (state) => {
            state.components = [];
            state.selectedComponentId = null;
            saveCanvasState(state);
        },
        toggleCanvasMode: (state, action: PayloadAction<boolean>) => {
            state.isCanvasMode = action.payload;
            saveCanvasState(state);
        },
        bringToFront: (state, action: PayloadAction<string>) => {
            const maxZ = Math.max(...state.components.map((c) => c.zIndex || 0));
            const index = state.components.findIndex((c) => c.id === action.payload);
            if (index !== -1) {
                state.components[index].zIndex = maxZ + 1;
                saveCanvasState(state);
            }
        },
    },
});

export const {
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    moveComponent,
    resizeComponent,
    updateComponentContent,
    updateComponentStyle,
    clearCanvas,
    toggleCanvasMode,
    bringToFront,
} = canvasSlice.actions;

export const selectCanvas = (state: RootState) => state.canvas;
export const selectSelectedComponent = (state: RootState) => {
    const canvas = state.canvas;
    if (!canvas.selectedComponentId) return null;
    return canvas.components.find((c) => c.id === canvas.selectedComponentId) || null;
};

export default canvasSlice.reducer;
