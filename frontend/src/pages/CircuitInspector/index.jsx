import { useState, useRef, useEffect } from 'react';

const CircuitInspectorPage = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const totalPages = files.length;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      displayImage(files[currentPage - 2]);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      displayImage(files[currentPage]);
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files).filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );
    
    if (uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
      setCurrentPage(1); // Reset to the first page
      displayImage(uploadedFiles[0]); // Display the first image
    } else {
      alert('Please upload .jpg or .png images.');
    }
  };

  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setScale(1); // Reset zoom
      setPosition({ x: 0, y: 0 }); // Reset position
    };
    reader.readAsDataURL(file);
  };

  const drawImage = () => {
    if (canvasRef.current && imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the aspect ratio
        const aspectRatio = img.width / img.height;

        // Set the canvas size
        canvas.height = 600; // Fixed height
        canvas.width = canvas.height * aspectRatio; // Adjust width

        // Draw the image on the canvas, maintaining aspect ratio
        ctx.setTransform(scale, 0, 0, scale, position.x, position.y);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  // Handle zoom in/out
  const handleWheel = (event) => {
    event.preventDefault();
    const zoomFactor = 0.1;
    const newScale = scale + (event.deltaY > 0 ? -zoomFactor : zoomFactor);
    setScale(Math.min(Math.max(newScale, 0.5), 3)); // Limit zoom levels between 0.5x and 3x
  };

  // Handle drag start
  const handleMouseDown = (event) => {
    isDragging.current = true;
    dragStart.current = { x: event.clientX - position.x, y: event.clientY - position.y };
  };

  // Handle dragging
  const handleMouseMove = (event) => {
    if (isDragging.current) {
      setPosition({ x: event.clientX - dragStart.current.x, y: event.clientY - dragStart.current.y });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Draw the image whenever imageSrc, scale, or position changes
  useEffect(() => {
    drawImage();
  }, [imageSrc, scale, position]);

  return (
    <div className="flex h-screen p-10">
      {/* Left Sidebar */}
      <div className="w-1/6 bg-gray-800 text-white p-4 space-y-4">
        <div>
          <label className="block mb-2">Upload Files</label>
          <input
            type="file"
            accept=".jpg, .png"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="w-full py-2 px-4 bg-blue-600 text-center rounded cursor-pointer hover:bg-blue-700"
          >
            Choose Files
          </label>
        </div>
        <div className="space-y-2">
          <label className="block">Threshold</label>
          <input type="range" className="w-full" min="0" max="100" />
        </div>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Apply Threshold</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Detect Logic Gate</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Detect All Gates</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Analyze Circuit</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Generate Truth Table</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Export Verilog</button>
        <button className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700">Change Class</button>
      </div>

      {/* Main Content (Canvas Area) */}
      <div className="flex-grow bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePreviousPage} 
            className={`py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <div className="text-lg font-semibold">
            Page {currentPage} of {totalPages || 1}
          </div>
          <button 
            onClick={handleNextPage} 
            className={`py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="border border-gray-400"
          style={{ height: '700px', width: '700px' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Right Panel */}
      <div className="w-1/6 bg-gray-800 text-white p-4 space-y-4">
        <div>
          <label className="block mb-2">Enter Boolean Expression</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter expression"
          />
        </div>
        
        {/* Display Boolean Expressions */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Boolean Expressions</h3>
          <ul className="space-y-2">
            <li>A AND B</li>
            <li>NOT (A OR B)</li>
            <li>(A AND B) OR C</li>
            {/* Add more expressions as needed */}
          </ul>
        </div>

        {/* Display Boolean Result */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Boolean Expression Result</h3>
          <p>(A AND B) OR C = 1</p>
          {/* Replace with dynamic content in the real application */}
        </div>

        <button className="w-full py-2 px-4 bg-green-600 rounded hover:bg-green-700">Compare Truth Table</button>
        <button className="w-full py-2 px-4 bg-green-600 rounded hover:bg-green-700">Simulate Circuit</button>
      </div>
    </div>
  );
};

export default CircuitInspectorPage;
