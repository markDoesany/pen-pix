import { useRef, useEffect, useState } from 'react';

const ImageDisplay = ({ img_url, predictions, loading }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState(null);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = img_url;

    img.onload = () => drawImageAndPredictions();

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
        predictions.forEach(({ x: bx, y: by, width, height, class_name, confidence, color }) => {
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

    const handleWheel = (e) => {
      if (isInside) {
        e.preventDefault();
        const newScale = Math.min(Math.max(scale * (1 - e.deltaY / 1000), 0.4), 5);
        setScale(newScale);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [img_url, predictions, scale, offset, isInside]);

  const handleMouseEnter = () => setIsInside(true);
  const handleMouseLeave = () => setIsInside(false);

  const handleMouseDown = (e) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - canvasRect.left;
    const startY = e.clientY - canvasRect.top;
    setStartDrag({ x: startX, y: startY });
  };

  const handleMouseMove = (e) => {
    if (startDrag) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - canvasRect.left;
      const currentY = e.clientY - canvasRect.top;
      const dx = currentX - startDrag.x;
      const dy = currentY - startDrag.y;
      setOffset(prevOffset => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy
      }));
      setStartDrag({ x: currentX, y: currentY });
    }
  };

  const handleMouseUp = () => setStartDrag(null);
  return (
    <div
      className={`image-canvas w-full h-full flex justify-center items-center bg-black cursor-pointer ${startDrag ? "cursor-grab" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? <p className='w-900 h-1000'>Loading</p> : <canvas ref={canvasRef} width={900} height={1000} />}
    </div>
  );
};

export default ImageDisplay;
