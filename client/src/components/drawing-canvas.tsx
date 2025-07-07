import { useEffect, useRef, useState } from "react";
import { createCanvasAPI } from "@/lib/canvas-api";

interface DrawingCanvasProps {
  code: string;
  onOutput: (output: string[]) => void;
}

export default function DrawingCanvas({ code, onOutput }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      // Create canvas API
      const canvasAPI = createCanvasAPI(ctx);
      
      // Create a safe execution environment
      const safeCode = `
        ${Object.keys(canvasAPI).map(key => 
          `const ${key} = canvasAPI.${key};`
        ).join('\n')}
        
        ${code}
      `;

      // Execute the code
      const executeCode = new Function('canvasAPI', safeCode);
      executeCode(canvasAPI);
      
      setError(null);
      onOutput(["✨ Code executed successfully!", "🎨 Your drawing is looking great!"]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      onOutput([`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`]);
      
      // Draw error message on canvas
      ctx.fillStyle = "#ef4444";
      ctx.font = "16px Arial";
      ctx.fillText("Error in code!", 10, 30);
      ctx.font = "12px Arial";
      ctx.fillText(err instanceof Error ? err.message : "Unknown error", 10, 50);
    }
  }, [code, onOutput]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-full">
      <canvas 
        ref={canvasRef}
        className="tutorial-canvas w-full h-full max-w-[400px] max-h-[400px] mx-auto"
        style={{ imageRendering: "pixelated" }}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
