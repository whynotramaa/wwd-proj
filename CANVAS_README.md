# Canvas Resume Editor

A drag-and-drop, freeform canvas-based resume editor for creating custom resume layouts.

## Features

### 🎨 Canvas Mode
- **Freeform Design**: Place components anywhere on an A4-sized canvas (595×842px)
- **Visual Editing**: Click to select, drag to move, resize with handles
- **Component Library**: 6 pre-built component types in the left sidebar
- **Live Preview**: See changes in real-time as you design

### 📦 Component Types

1. **Heading** - Large, bold titles (24px default)
2. **Contact Info** - Formatted contact details section
3. **Section Header** - Medium section titles (18px default)
4. **Text** - Standard body text paragraphs
5. **Bullet List** - Formatted bullet point lists
6. **Divider** - Visual separators

### 🛠️ Editing Features

- **Double-click to edit**: Edit text inline
- **Drag & Drop**: Move components freely
- **Resize**: Use handles to adjust component size
- **Style Controls**: Adjust fontSize, color in the toolbar
- **Keyboard Shortcuts**:
  - `Delete` - Remove selected component
  - `Escape` - Deselect component

### 🔄 Mode Toggle

Switch between:
- **Form Mode**: Traditional form-based resume builder
- **Canvas Mode**: Freeform visual editor

Toggle button appears:
- Form Mode: Top-right "🎨 Canvas Mode" button
- Canvas Mode: Top-center "Switch to Form Mode" button

## Architecture

### Files Created

```
src/app/
├── components/CanvasResume/
│   ├── index.tsx                  # Exports
│   ├── CanvasResumeEditor.tsx     # Main editor component
│   ├── DraggableComponent.tsx     # Wrapper using react-rnd
│   ├── ComponentRenderer.tsx      # Renders different component types
│   └── ComponentPalette.tsx       # Left sidebar with templates
└── lib/redux/
    └── canvasSlice.ts             # Redux state management
```

### State Management

**Redux Slice**: `canvasSlice.ts`

```typescript
interface CanvasState {
  components: CanvasComponent[];
  selectedComponentId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  isCanvasMode: boolean;
}
```

**Key Actions**:
- `addComponent` - Add new component to canvas
- `moveComponent` - Update component position
- `resizeComponent` - Update component dimensions
- `updateComponentContent` - Edit text content
- `updateComponentStyle` - Modify styling
- `deleteComponent` - Remove component
- `toggleCanvasMode` - Switch between form/canvas modes

### Data Persistence

All canvas data is automatically saved to `localStorage` under the key `canvas-resume-data`:

```json
{
  "components": [...],
  "selectedComponentId": "...",
  "canvasWidth": 595,
  "canvasHeight": 842,
  "isCanvasMode": false
}
```

## Usage

### For Users

1. Navigate to Resume Builder (`/resume-builder`)
2. Click "🎨 Canvas Mode" button (top-right)
3. Click component type in left sidebar to add to canvas
4. Drag to position, resize with handles
5. Double-click to edit text
6. Use toolbar to adjust styling
7. Click "Switch to Form Mode" to return to form builder

### For Developers

**Add canvas editor to a page**:

```tsx
import { CanvasResumeEditor } from "components/CanvasResume";

export default function MyPage() {
  return <CanvasResumeEditor />;
}
```

**Access canvas state**:

```tsx
import { useAppSelector } from "lib/redux/hooks";
import { selectCanvas } from "lib/redux/canvasSlice";

const canvas = useAppSelector(selectCanvas);
console.log(canvas.components); // Array of components
```

**Add a component programmatically**:

```tsx
import { useAppDispatch } from "lib/redux/hooks";
import { addComponent } from "lib/redux/canvasSlice";

const dispatch = useAppDispatch();
dispatch(addComponent({
  type: "text",
  x: 100,
  y: 100,
  width: 200,
  height: 50,
  content: "Hello World",
}));
```

## Dependencies

- **react-rnd** (v10.4.2): Drag and resize functionality
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling

## Future Enhancements

- [ ] Export canvas to PDF
- [ ] More component types (images, shapes, tables)
- [ ] Undo/Redo functionality
- [ ] Alignment guides and snapping
- [ ] Layer management panel
- [ ] Templates/presets library
- [ ] Group/ungroup components
- [ ] Copy/paste components
- [ ] Zoom controls

## Privacy

All data is stored **locally only** in the browser's localStorage. No data is sent to servers or third parties.

---

**Built with Project 0** - India's resume builder designed for Indian job seekers.
