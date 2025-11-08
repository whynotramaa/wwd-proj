"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
    selectCanvas,
    selectSelectedComponent,
    selectComponent,
    deleteComponent,
    updateComponentStyle,
} from "lib/redux/canvasSlice";
import { DraggableComponent } from "./DraggableComponent";
import { ComponentRenderer } from "./ComponentRenderer";
import { ComponentPalette } from "./ComponentPalette";

export const CanvasResumeEditor = () => {
    const dispatch = useAppDispatch();
    const canvas = useAppSelector(selectCanvas);
    const selectedComponent = useAppSelector(selectSelectedComponent);
    const [editingComponentId, setEditingComponentId] = useState<string | null>(null);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete selected component
            if (e.key === "Delete" && canvas.selectedComponentId) {
                dispatch(deleteComponent(canvas.selectedComponentId));
            }
            // Deselect on Escape
            if (e.key === "Escape") {
                dispatch(selectComponent(null));
                setEditingComponentId(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canvas.selectedComponentId, dispatch]);

    // Handle canvas click to deselect
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            dispatch(selectComponent(null));
            setEditingComponentId(null);
        }
    };

    return (
        <div className="flex h-full w-full bg-background">
            {/* Left Sidebar - Component Palette */}
            <ComponentPalette />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="bg-card border-b border-border p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-foreground">Canvas Resume Editor</h2>
                        <span className="text-xs text-muted-foreground">
                            {canvas.components.length} component{canvas.components.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Style Controls for Selected Component */}
                    {selectedComponent && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Font Family */}
                            {selectedComponent.type !== "divider" && (
                                <>
                                    <label className="text-xs text-muted-foreground">Font:</label>
                                    <select
                                        value={selectedComponent.style?.fontFamily || "Inter, sans-serif"}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { fontFamily: e.target.value },
                                                })
                                            )
                                        }
                                        className="px-2 py-1 text-xs border border-border rounded bg-background"
                                    >
                                        <option value="Inter, sans-serif">Inter</option>
                                        <option value="Arial, sans-serif">Arial</option>
                                        <option value="Times New Roman, serif">Times New Roman</option>
                                        <option value="Georgia, serif">Georgia</option>
                                        <option value="Courier New, monospace">Courier New</option>
                                        <option value="Verdana, sans-serif">Verdana</option>
                                        <option value="Helvetica, sans-serif">Helvetica</option>
                                        <option value="Roboto, sans-serif">Roboto</option>
                                    </select>
                                </>
                            )}

                            {/* Bold Toggle */}
                            {selectedComponent.type !== "divider" && (
                                <button
                                    onClick={() =>
                                        dispatch(
                                            updateComponentStyle({
                                                id: selectedComponent.id,
                                                style: {
                                                    fontWeight:
                                                        selectedComponent.style?.fontWeight === "bold"
                                                            ? "normal"
                                                            : "bold",
                                                },
                                            })
                                        )
                                    }
                                    className={`ml-2 px-3 py-1 text-sm font-bold border rounded transition-colors ${selectedComponent.style?.fontWeight === "bold"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:bg-accent"
                                        }`}
                                    title="Toggle Bold"
                                >
                                    B
                                </button>
                            )}

                            {/* Italic Toggle */}
                            {selectedComponent.type !== "divider" && (
                                <button
                                    onClick={() =>
                                        dispatch(
                                            updateComponentStyle({
                                                id: selectedComponent.id,
                                                style: {
                                                    fontStyle:
                                                        selectedComponent.style?.fontStyle === "italic"
                                                            ? "normal"
                                                            : "italic",
                                                },
                                            })
                                        )
                                    }
                                    className={`px-3 py-1 text-sm italic border rounded transition-colors ${selectedComponent.style?.fontStyle === "italic"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:bg-accent"
                                        }`}
                                    title="Toggle Italic"
                                >
                                    I
                                </button>
                            )}

                            {/* Font Size */}
                            {selectedComponent.type !== "divider" && (
                                <>
                                    <label className="text-xs text-muted-foreground ml-2">Size:</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.style?.fontSize || 14}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { fontSize: parseInt(e.target.value) || 14 },
                                                })
                                            )
                                        }
                                        className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                                        min="8"
                                        max="72"
                                    />
                                </>
                            )}

                            {/* Letter Spacing */}
                            {selectedComponent.type !== "divider" && (
                                <>
                                    <label className="text-xs text-muted-foreground ml-2">Spacing:</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={parseFloat(selectedComponent.style?.letterSpacing || "0")}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { letterSpacing: `${e.target.value}px` },
                                                })
                                            )
                                        }
                                        className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                                        min="-2"
                                        max="10"
                                    />
                                </>
                            )}

                            {/* Line Height */}
                            {selectedComponent.type !== "divider" && (
                                <>
                                    <label className="text-xs text-muted-foreground ml-2">Line Height:</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={parseFloat(selectedComponent.style?.lineHeight || "1.5")}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { lineHeight: e.target.value },
                                                })
                                            )
                                        }
                                        className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                                        min="0.5"
                                        max="3"
                                    />
                                </>
                            )}

                            {/* Divider Thickness */}
                            {selectedComponent.type === "divider" && (
                                <>
                                    <label className="text-xs text-muted-foreground">Thickness:</label>
                                    <input
                                        type="number"
                                        step="0.005"
                                        value={selectedComponent.style?.dividerThickness || 0.5}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { dividerThickness: parseFloat(e.target.value) || 0.005 },
                                                })
                                            )
                                        }
                                        className="w-20 px-2 py-1 text-xs border border-border rounded bg-background"
                                        min="0.005"
                                        max="20"
                                    />
                                    <span className="text-xs text-muted-foreground">px</span>
                                </>
                            )}

                            {/* Hyperlink URL */}
                            {selectedComponent.type === "hyperlink" && (
                                <>
                                    <label className="text-xs text-muted-foreground ml-2">URL:</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com"
                                        value={selectedComponent.style?.href || ""}
                                        onChange={(e) =>
                                            dispatch(
                                                updateComponentStyle({
                                                    id: selectedComponent.id,
                                                    style: { href: e.target.value },
                                                })
                                            )
                                        }
                                        className="w-48 px-2 py-1 text-xs border border-border rounded bg-background"
                                    />
                                </>
                            )}

                            {/* Color */}
                            <label className="text-xs text-muted-foreground ml-2">Color:</label>
                            <input
                                type="color"
                                value={selectedComponent.style?.color || "#000000"}
                                onChange={(e) =>
                                    dispatch(
                                        updateComponentStyle({
                                            id: selectedComponent.id,
                                            style: { color: e.target.value },
                                        })
                                    )
                                }
                                className="w-10 h-8 border border-border rounded cursor-pointer"
                            />

                            {/* Delete Button */}
                            <button
                                onClick={() => dispatch(deleteComponent(selectedComponent.id))}
                                className="ml-4 px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-auto bg-muted/30 p-8">
                    <div className="mx-auto" style={{ width: "fit-content" }}>
                        {/* A4 Canvas */}
                        <div
                            onClick={handleCanvasClick}
                            className="relative bg-white shadow-2xl"
                            style={{
                                width: `${canvas.canvasWidth}px`,
                                height: `${canvas.canvasHeight}px`,
                                minHeight: `${canvas.canvasHeight}px`,
                            }}
                        >
                            {/* Grid background (optional) */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-5"
                                style={{
                                    backgroundImage: `
                    linear-gradient(to right, #00000010 1px, transparent 1px),
                    linear-gradient(to bottom, #00000010 1px, transparent 1px)
                  `,
                                    backgroundSize: "20px 20px",
                                }}
                            />

                            {/* Render all components */}
                            {canvas.components.map((component) => (
                                <DraggableComponent
                                    key={component.id}
                                    component={component}
                                    isSelected={canvas.selectedComponentId === component.id}
                                    onDoubleClick={() => setEditingComponentId(component.id)}
                                >
                                    <ComponentRenderer
                                        component={component}
                                        isEditing={editingComponentId === component.id}
                                        onEditEnd={() => setEditingComponentId(null)}
                                    />
                                </DraggableComponent>
                            ))}

                            {/* Empty state */}
                            {canvas.components.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <div className="text-4xl mb-4">📄</div>
                                        <p className="text-lg font-medium">Your canvas is empty</p>
                                        <p className="text-sm mt-2">
                                            Click components from the left sidebar to start building
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
