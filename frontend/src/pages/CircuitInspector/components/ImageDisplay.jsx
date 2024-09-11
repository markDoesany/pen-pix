import { useRef, useEffect, useState } from 'react';

const ImageDisplay = ({ img_url, predictions }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = img_url;

    img.onload = () => {
      drawImageAndPredictions();
    };

    const drawImageAndPredictions = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        drawWidth = canvasWidth / scale;
        drawHeight = drawWidth / imgAspectRatio;
      } else {
        drawHeight = canvasHeight / scale;
        drawWidth = drawHeight * imgAspectRatio;
      }

      const x = (canvasWidth - drawWidth) / 2 + offset.x;
      const y = (canvasHeight - drawHeight) / 2 + offset.y;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      if (predictions && Array.isArray(predictions)) {
        predictions.forEach(prediction => {
          const { x: bx, y: by, width, height, class_name, confidence, color } = prediction;

          const scaledX = x + (bx * (drawWidth / img.width));
          const scaledY = y + (by * (drawHeight / img.height));
          const scaledWidth = width * (drawWidth / img.width);
          const scaledHeight = height * (drawHeight / img.height);

          ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

          ctx.font = '12px Arial';
          ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          ctx.fillText(`${class_name} (${(confidence * 100).toFixed(1)}%)`, scaledX, scaledY - 5);
        });
      }
    };

    drawImageAndPredictions();

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [img_url, predictions, scale, offset]);

  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale * (1 - e.deltaY / 1000), 0.4), 5);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    setStartDrag({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (startDrag) {
      const dx = e.clientX - startDrag.x;
      const dy = e.clientY - startDrag.y;
      setOffset(prevOffset => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy
      }));
      setStartDrag({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setStartDrag(null);
  };

  return (
    <div
      className={`w-full h-full flex justify-center items-center bg-black cursor-pointer ${startDrag ? "cursor-grab" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} width={900} height={1000} />
    </div>
  );
};

export default ImageDisplay;
