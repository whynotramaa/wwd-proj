"use client";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import { selectCanvas, toggleCanvasMode, clearCanvas, addComponent } from "lib/redux/canvasSlice";
import { canvasToResumeData, resumeToCanvasComponents } from "lib/canvas-resume-sync";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ATSAnalysis } from "resume-parser/ATSAnalysis";
import { CanvasResumeEditor } from "components/CanvasResume/CanvasResumeEditor";
import { Button } from "components/Button";

function ResumeBuilderContent() {
  const [showATSAnalysis, setShowATSAnalysis] = useState(false);
  const resume = useAppSelector(selectResume);
  const canvas = useAppSelector(selectCanvas);
  const dispatch = useAppDispatch();

  // Load canvas mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("canvasMode");
    if (savedMode === "true") {
      dispatch(toggleCanvasMode(true));
    }
  }, [dispatch]);

  // Save canvas mode preference to localStorage and sync data
  const handleToggleCanvasMode = () => {
    const newMode = !canvas.isCanvasMode;

    if (newMode) {
      // Switching to Canvas Mode - ALWAYS sync from form to canvas
      // Clear existing canvas and regenerate from current resume state
      dispatch(clearCanvas());
      const canvasComponents = resumeToCanvasComponents(resume);
      canvasComponents.forEach(component => {
        dispatch(addComponent(component));
      });
    } else {
      // Switching to Form Mode - ALWAYS sync from canvas to form
      // Convert canvas components back to resume data
      const resumeData = canvasToResumeData(canvas.components);
      dispatch(setResume({ ...resume, ...resumeData }));
    }

    dispatch(toggleCanvasMode(newMode));
    localStorage.setItem("canvasMode", String(newMode));
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-background">
      {canvas.isCanvasMode ? (
        // Canvas Mode - Full screen canvas editor
        <div className="h-full w-full relative">
          <CanvasResumeEditor />

          {/* Mode Toggle Button */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={handleToggleCanvasMode}
              className="bg-primary rounded-full px-6 py-2 text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              Switch to Form Mode
            </Button>
          </div>
        </div>
      ) : (
        // Form Mode - Original split view
        <div className="grid grid-cols-3 md:grid-cols-6">
          <div className="col-span-3 border-r border-border">
            <ResumeForm />
          </div>
          <div className="col-span-3 bg-muted/30 relative">
            <Resume />

            {/* Mode Toggle & ATS Analysis Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                onClick={handleToggleCanvasMode}
                className="bg-secondary rounded p-3 text-secondary-foreground hover:bg-secondary/90"
              >
                🎨 Canvas Mode
              </Button>
              <Button
                onClick={() => setShowATSAnalysis(!showATSAnalysis)}
                className="bg-primary rounded p-3 text-primary-foreground hover:bg-primary/90"
              >
                {showATSAnalysis ? "Hide ATS Analysis" : "Show ATS Analysis"}
              </Button>
            </div>

            {/* ATS Analysis Panel */}
            {showATSAnalysis && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm overflow-y-auto z-20 p-6">
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-foreground">ATS Analysis</h2>
                    <Button
                      onClick={() => setShowATSAnalysis(false)}
                      className="bg-muted p-2 rounded text-muted-foreground hover:bg-muted/80"
                    >
                      ✕ Close
                    </Button>
                  </div>
                  <ATSAnalysis resume={resume} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function Create() {
  return (
    <Provider store={store}>
      <ResumeBuilderContent />
    </Provider>
  );
}
