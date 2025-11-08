"use client";
import { Rnd } from "react-rnd";
import { useAppDispatch } from "lib/redux/hooks";
import { moveComponent, resizeComponent, selectComponent, bringToFront } from "lib/redux/canvasSlice";
import type { CanvasComponent } from "lib/redux/canvasSlice";

interface DraggableComponentProps {
    component: CanvasComponent;
    isSelected: boolean;
    children: React.ReactNode;
    onDoubleClick?: () => void;
}

export const DraggableComponent = ({
    component,
    isSelected,
    children,
    onDoubleClick,
}: DraggableComponentProps) => {
    const dispatch = useAppDispatch();

    return (
        <Rnd
            position={{ x: component.x, y: component.y }}
            size={{ width: component.width, height: component.height }}
            onDragStop={(e, d) => {
                dispatch(moveComponent({ id: component.id, x: d.x, y: d.y }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                dispatch(
                    resizeComponent({
                        id: component.id,
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                    })
                );
                dispatch(moveComponent({ id: component.id, x: position.x, y: position.y }));
            }}
            onClick={() => {
                dispatch(selectComponent(component.id));
                dispatch(bringToFront(component.id));
            }}
            onDoubleClick={onDoubleClick}
            bounds="parent"
            style={{
                zIndex: component.zIndex || 0,
                border: isSelected ? "2px solid #3b82f6" : "1px solid transparent",
                cursor: "move",
            }}
            enableResizing={{
                top: isSelected,
                right: isSelected,
                bottom: isSelected,
                left: isSelected,
                topRight: isSelected,
                bottomRight: isSelected,
                bottomLeft: isSelected,
                topLeft: isSelected,
            }}
            disableDragging={!isSelected}
            resizeHandleStyles={{
                top: { cursor: "ns-resize" },
                right: { cursor: "ew-resize" },
                bottom: { cursor: "ns-resize" },
                left: { cursor: "ew-resize" },
                topRight: { cursor: "nesw-resize" },
                bottomRight: { cursor: "nwse-resize" },
                bottomLeft: { cursor: "nesw-resize" },
                topLeft: { cursor: "nwse-resize" },
            }}
            resizeHandleClasses={{
                top: "resize-handle-top",
                right: "resize-handle-right",
                bottom: "resize-handle-bottom",
                left: "resize-handle-left",
                topRight: "resize-handle-corner",
                bottomRight: "resize-handle-corner",
                bottomLeft: "resize-handle-corner",
                topLeft: "resize-handle-corner",
            }}
        >
            <div className="w-full h-full overflow-hidden">{children}</div>
        </Rnd>
    );
};
