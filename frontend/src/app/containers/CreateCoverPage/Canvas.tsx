import React, { useRef, useEffect } from 'react';

interface Props {}

export const Canvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = ctx => {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    draw(context);
  }, []);
  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
