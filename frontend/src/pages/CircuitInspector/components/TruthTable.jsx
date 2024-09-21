import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const TruthTable = ({ data }) => {
  const tableRef = useRef(null);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-600">No data provided</p>;
  }

  const inputCount = data[0].length - 1;
  const inputLabels = Array.from({ length: inputCount }, (_, i) => `X${i + 1}`);
  const outputLabel = 'OUT1';

  // Function to download the table as a CSV file
  const saveAsCSV = () => {
    const csvContent = [
      [...inputLabels, outputLabel].join(','), // CSV Header
      ...data.map(row => row.join(',')) // CSV Data
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'truth_table.csv'); // Filename for CSV
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveAsPng = async () => {
    if (tableRef.current === null) return;
  
    // Clone the table and apply styles to ensure full visibility
    const clonedTable = tableRef.current.cloneNode(true);
    
    // Create a container for the cloned table and style it for full visibility
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px'; // Move off-screen
    hiddenContainer.style.top = '0'; // Or anywhere out of view
    hiddenContainer.style.overflow = 'visible'; // Ensure all content is visible
    hiddenContainer.style.width = 'auto'; // Allow full width
    hiddenContainer.style.height = 'auto'; // Allow full height
  
    // Apply styles to cloned table to ensure it fits its content
    clonedTable.style.position = 'static';
    clonedTable.style.overflow = 'visible';
    clonedTable.style.maxWidth = 'none';
    clonedTable.style.maxHeight = 'none';
  
    // Append the cloned table to the hidden container
    hiddenContainer.appendChild(clonedTable);
    document.body.appendChild(hiddenContainer);
  
    try {
      // Capture the cloned table as PNG
      const dataUrl = await htmlToImage.toPng(clonedTable);
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'truth_table.png'; // Filename for the PNG
      link.click();
    } catch (error) {
      console.error('Failed to save as PNG', error);
    } finally {
      // Cleanup: Remove the hidden container and cloned table
      document.body.removeChild(hiddenContainer);
    }
  };
  

  return (
    <div className="absolute p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-[700px] min-w-[500px] max-h-[600px] mx-auto border border-gray-700 flex flex-col">
      {/* Title */}
      <h2 className="text-xl font-bold text-center mb-4">
        Truth Table
      </h2>

      <div
        className="overflow-y-auto max-h-[500px]"
        ref={tableRef}
      >
        <table className="min-w-full table-auto border-collapse border border-gray-600">
          <thead className="bg-gray-700">
            <tr>
              {inputLabels.map((label, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-sm font-medium border border-gray-600"
                >
                  {label}
                </th>
              ))}
              <th className="px-4 py-2 text-sm font-medium border border-gray-600">
                {outputLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="odd:bg-gray-700 even:bg-gray-600"
              >
                {row.slice(0, inputCount).map((value, index) => (
                  <td
                    key={index}
                    className="px-4 py-2 text-center border border-gray-600"
                  >
                    {value}
                  </td>
                ))}
                <td className="px-4 py-2 text-center border border-gray-600">
                  {row[inputCount]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={saveAsCSV}
          className="px-4 py-2 bg-primaryColor text-white rounded-lg shadow-md hover:bg-primaryColor"
        >
          Save as CSV
        </button>
        <button
          onClick={saveAsPng}
          className="px-4 py-2 bg-thirdBg text-white rounded-lg shadow-md"
        >
          Save as PNG
        </button>
      </div>
    </div>
  );
};

export default TruthTable;
