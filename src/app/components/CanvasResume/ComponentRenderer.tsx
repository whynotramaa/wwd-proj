"use client";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { CanvasComponent } from "lib/redux/canvasSlice";
import { useAppDispatch } from "lib/redux/hooks";
import { updateComponentContent, updateComponentStyle } from "lib/redux/canvasSlice";

interface ComponentRendererProps {
    component: CanvasComponent;
    isEditing: boolean;
    onEditEnd: () => void;
}

export const ComponentRenderer = ({
    component,
    isEditing,
    onEditEnd,
}: ComponentRendererProps) => {
    const dispatch = useAppDispatch();
    const [editValue, setEditValue] = useState(component.content);

    const handleContentChange = (value: string) => {
        setEditValue(value);
        dispatch(updateComponentContent({ id: component.id, content: value }));
    };

    const defaultStyles: CSSProperties = {
        fontSize: component.style?.fontSize || 14,
        fontWeight: component.style?.fontWeight || "normal",
        fontStyle: component.style?.fontStyle || "normal",
        color: component.style?.color || "#000000",
        textAlign: (component.style?.textAlign as CSSProperties["textAlign"]) || "left",
        fontFamily: component.style?.fontFamily || "Inter, sans-serif",
        letterSpacing: component.style?.letterSpacing || "0px",
        lineHeight: component.style?.lineHeight || "normal",
    };

    const commonClasses = "w-full h-full outline-none";

    switch (component.type) {
        case "text":
            return isEditing ? (
                <textarea
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    autoFocus
                    className={`${commonClasses} resize-none bg-transparent border-none p-2`}
                    style={defaultStyles}
                />
            ) : (
                <div
                    className="p-2 w-full h-full"
                    style={defaultStyles}
                >
                    {component.content}
                </div>
            );

        case "heading":
            return isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    autoFocus
                    className={`${commonClasses} bg-transparent border-none p-2 font-bold`}
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 24 }}
                />
            ) : (
                <div
                    className="p-2 w-full h-full font-bold"
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 24 }}
                >
                    {component.content}
                </div>
            );

        case "section":
            return isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    autoFocus
                    className={`${commonClasses} bg-transparent border-none p-2 font-semibold`}
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 18 }}
                />
            ) : (
                <div
                    className="p-2 w-full h-full font-semibold border-b-2 border-gray-300"
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 18 }}
                >
                    {component.content}
                </div>
            );

        case "bulletList":
            return isEditing ? (
                <textarea
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    placeholder="• Item 1&#10;• Item 2&#10;• Item 3"
                    autoFocus
                    className={`${commonClasses} resize-none bg-transparent border-none p-2`}
                    style={defaultStyles}
                />
            ) : (
                <div className="p-2 w-full h-full whitespace-pre-wrap" style={defaultStyles}>
                    {component.content.split("\n").map((line, idx) => (
                        <div key={idx} className="flex items-start">
                            <span className="mr-2">{line.trim().startsWith("•") ? "" : "•"}</span>
                            <span>{line.replace(/^•\s*/, "")}</span>
                        </div>
                    ))}
                </div>
            );

        case "divider":
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <hr
                        className="w-full"
                        style={{
                            borderColor: component.style?.color || "#d0d0d0",
                            borderWidth: `${component.style?.dividerThickness || 1}px`,
                            borderStyle: "solid",
                        }}
                    />
                </div>
            );

        case "contact":
            return isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    autoFocus
                    placeholder="email@example.com | +1234567890"
                    className={`${commonClasses} bg-transparent border-none p-2`}
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 12 }}
                />
            ) : (
                <div
                    className="p-2 w-full h-full flex items-center"
                    style={{ ...defaultStyles, fontSize: component.style?.fontSize || 12 }}
                >
                    {component.content}
                </div>
            );

        case "hyperlink":
            return isEditing ? (
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={onEditEnd}
                    autoFocus
                    placeholder="Link text"
                    className={`${commonClasses} bg-transparent border-none p-2`}
                    style={defaultStyles}
                />
            ) : (
                <a
                    href={component.style?.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 w-full h-full flex items-center underline cursor-pointer hover:opacity-80 transition-opacity"
                    style={defaultStyles}
                    onClick={(e) => {
                        // Prevent navigation when not in preview mode
                        if (!component.style?.href || component.style.href === "https://") {
                            e.preventDefault();
                        }
                    }}
                >
                    {component.content}
                </a>
            );

        case "image":
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Image Placeholder</span>
                </div>
            );

        default:
            return <div className="p-2">{component.content}</div>;
    }
};
