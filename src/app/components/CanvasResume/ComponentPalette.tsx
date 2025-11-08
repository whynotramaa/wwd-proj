"use client";
import { addComponent } from "lib/redux/canvasSlice";
import { useAppDispatch } from "lib/redux/hooks";
import type { ComponentType } from "lib/redux/canvasSlice";

interface ComponentTemplate {
    type: ComponentType;
    label: string;
    icon: string;
    defaultWidth: number;
    defaultHeight: number;
    defaultContent: string;
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
    {
        type: "heading",
        label: "Name/Title",
        icon: "👤",
        defaultWidth: 400,
        defaultHeight: 50,
        defaultContent: "Your Name",
    },
    {
        type: "contact",
        label: "Contact Info",
        icon: "📧",
        defaultWidth: 400,
        defaultHeight: 30,
        defaultContent: "email@example.com | +1234567890",
    },
    {
        type: "section",
        label: "Section Header",
        icon: "📌",
        defaultWidth: 500,
        defaultHeight: 40,
        defaultContent: "Section Title",
    },
    {
        type: "text",
        label: "Text Block",
        icon: "📝",
        defaultWidth: 450,
        defaultHeight: 100,
        defaultContent: "Add your content here...",
    },
    {
        type: "bulletList",
        label: "Bullet List",
        icon: "•",
        defaultWidth: 450,
        defaultHeight: 120,
        defaultContent: "• First point\n• Second point\n• Third point",
    },
    {
        type: "divider",
        label: "Divider Line",
        icon: "—",
        defaultWidth: 500,
        defaultHeight: 5,
        defaultContent: "",
    },
    {
        type: "hyperlink",
        label: "Hyperlink",
        icon: "🔗",
        defaultWidth: 250,
        defaultHeight: 30,
        defaultContent: "Click here",
    },
];

export const ComponentPalette = () => {
    const dispatch = useAppDispatch();

    const handleAddComponent = (template: ComponentTemplate) => {
        const centerX = 50; // Start near left edge
        const randomY = 50 + Math.random() * 100; // Random vertical position

        dispatch(
            addComponent({
                type: template.type,
                x: centerX,
                y: randomY,
                width: template.defaultWidth,
                height: template.defaultHeight,
                content: template.defaultContent,
                style: {
                    fontSize: template.type === "heading" ? 24 : template.type === "section" ? 18 : 14,
                    fontWeight: template.type === "heading" || template.type === "section" ? "bold" : "normal",
                    color: template.type === "hyperlink" ? "#0066cc" : "#000000",
                    textAlign: "left",
                    dividerThickness: template.type === "divider" ? 0.5 : undefined,
                    href: template.type === "hyperlink" ? "https://" : undefined,
                },
            })
        );
    };

    return (
        <div className="w-64 bg-muted border-r border-border h-full overflow-y-auto p-4">
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">
                Components
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
                Click to add components to your resume
            </p>
            <div className="space-y-2">
                {COMPONENT_TEMPLATES.map((template) => (
                    <button
                        key={template.type}
                        onClick={() => handleAddComponent(template)}
                        className="w-full p-3 bg-card border border-border rounded-lg hover:bg-accent hover:border-primary transition-colors text-left group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.icon}</span>
                            <div className="flex-1">
                                <div className="font-medium text-foreground text-sm group-hover:text-primary">
                                    {template.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {template.defaultWidth} x {template.defaultHeight}px
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-2 text-xs uppercase">Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-2">
                    <li>• Click to add components</li>
                    <li>• Select to move & resize</li>
                    <li>• Double-click to edit text</li>
                    <li>• Delete key to remove</li>
                </ul>
            </div>
        </div>
    );
};
