export interface CanvasAPI {
  drawPixel: (x: number, y: number, color: string) => void;
  drawCircle: (x: number, y: number, radius: number, color: string) => void;
  drawLine: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) => void;
  drawRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => void;
  drawText: (x: number, y: number, text: string, color: string) => void;
  clearCanvas: () => void;
  onKeyPress: (
    callback: (key: string, preventDefault: () => void) => void,
  ) => void;
  onArrowKeys: (
    callback: (
      direction: "up" | "down" | "left" | "right",
      preventDefault: () => void,
    ) => void,
  ) => void;
  onSpaceBar: (callback: () => void) => void;
  isKeyPressed: (key: string) => boolean;
}

export function createCanvasAPI(
  ctx: CanvasRenderingContext2D,
  cleanup: {
    eventListeners: Array<{ element: any; event: string; handler: any }>;
  },
): CanvasAPI {
  const canvas = ctx.canvas;

  // Track pressed keys with proper cleanup
  const pressedKeys = new Set<string>();

  const handleKeyDown = (e: KeyboardEvent) => {
    pressedKeys.add(e.key.toLowerCase());
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    pressedKeys.delete(e.key.toLowerCase());
  };

  // Add these listeners to cleanup tracking
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  cleanup.eventListeners.push(
    { element: document, event: "keydown", handler: handleKeyDown },
    { element: document, event: "keyup", handler: handleKeyUp },
  );

  return {
    drawPixel: (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    },

    drawCircle: (x: number, y: number, radius: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },

    drawLine: (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    },

    drawRect: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    },

    drawText: (x: number, y: number, text: string, color: string) => {
      ctx.fillStyle = color;
      ctx.font = "16px Arial";
      ctx.fillText(text, x, y);
    },

    clearCanvas: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    onKeyPress: (
      callback: (key: string, preventDefault: () => void) => void,
    ) => {
      const handler = (e: KeyboardEvent) => {
        function preventDefault() {
          e.preventDefault();
          e.stopPropagation();
        }
        callback(e.key.toLowerCase(), preventDefault);
      };
      document.addEventListener("keydown", handler);
      cleanup.eventListeners.push({
        element: document,
        event: "keydown",
        handler,
      });
    },

    onArrowKeys: (
      callback: (
        direction: "up" | "down" | "left" | "right",
        preventDefault: () => void,
      ) => void,
    ) => {
      const handler = (e: KeyboardEvent) => {
        // Prevent default behavior for arrow keys
        function preventDefault() {
          e.preventDefault();
          e.stopPropagation();
        }

        switch (e.key.toLowerCase()) {
          case "arrowup":
            callback("up", preventDefault);
            break;
          case "arrowdown":
            callback("down", preventDefault);
            break;
          case "arrowleft":
            callback("left", preventDefault);
            break;
          case "arrowright":
            callback("right", preventDefault);
            break;
        }
      };
      document.addEventListener("keydown", handler);
      cleanup.eventListeners.push({
        element: document,
        event: "keydown",
        handler,
      });
    },

    onSpaceBar: (callback: () => void) => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === " ") {
          e.preventDefault();
          callback();
        }
      };
      document.addEventListener("keydown", handler);
      cleanup.eventListeners.push({
        element: document,
        event: "keydown",
        handler,
      });
    },

    isKeyPressed: (key: string) => {
      return pressedKeys.has(key.toLowerCase());
    },
  };
}
