export interface CanvasAPI {
  drawPixel: (x: number, y: number, color: string) => void;
  drawCircle: (x: number, y: number, radius: number, color: string) => void;
  drawLine: (x1: number, y1: number, x2: number, y2: number, color: string) => void;
  drawRect: (x: number, y: number, width: number, height: number, color: string) => void;
  drawText: (x: number, y: number, text: string, color: string) => void;
  clearCanvas: () => void;
}

export function createCanvasAPI(ctx: CanvasRenderingContext2D): CanvasAPI {
  const canvas = ctx.canvas;
  
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
    
    drawLine: (x1: number, y1: number, x2: number, y2: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    
    drawRect: (x: number, y: number, width: number, height: number, color: string) => {
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
    }
  };
}
