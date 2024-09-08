import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import RightSideBar from "./components/RightSideBar";
import ImageDisplay from "./components/ImageDisplay";
import { useParams } from "react-router-dom";
import useGetTask from '../../hooks/useGetTask';
import { useEffect, useState } from "react";
import { FilesAtom } from "../../atoms/FilesAtom";
import { useRecoilValue } from "recoil";
import axios from "axios";

const CircuitInspectorPage = () => {
  const { taskId } = useParams();
  const { task, loading } = useGetTask(taskId);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentCircuitData, setCurrentCircuitData] = useState(null);
  const files = useRecoilValue(FilesAtom);

  const handleApplyThreshold = async (thresholdValue, mode = 'single') => {
  try {
    const response = await axios.post('/detect-gates/set-filter-threshold', {
      thresholdValue,
      mode,
      fileId: currentFile?.id
    }, { responseType: 'blob' });
    
    const imageUrl = URL.createObjectURL(response.data);
    
    if (thresholdValue > 0) {
      setCurrentFile(prevFile => ({
        ...prevFile,
        file_url: imageUrl
      }));
    } else {
      // If threshold is not greater than 0, keep the original image
      setCurrentFile(prevFile => prevFile);
    }
  } catch (error) {
    console.error('Error applying threshold:', error);
  }
};

  const handleCurrentFile = (file) => {
    setCurrentFile(file);
  };

  // Effect to handle when currentFile is updated
  useEffect(() => {
    console.log("Updated current file", currentFile);
  }, [currentFile]);

  // Set the first file as current file
  useEffect(() => {
    setCurrentFile(files[0]);
  }, [files]);

  // Fetch circuit data when currentFile changes
  useEffect(() => {
    const getCircuitData = async () => {
      if (currentFile?.id) {
        try {
          const response = await axios.get(`/detect-gates/get-circuit-data/${currentFile.id}`);
          setCurrentCircuitData(response.data.circuit_analysis);
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    getCircuitData();
  }, [currentFile?.id]);

  useEffect(()=>{ 
    handleApplyThreshold(currentCircuitData?.threshold_value)
  }, [currentCircuitData])

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col">
      <header className="bg-[#333]">
        <Header task={task} files={files} onCurrentFileChange={handleCurrentFile} />
      </header>

      <main className="flex flex-grow">
        <div className="">
          <LeftSidebar task={task} 
                       onApplyThreshold={handleApplyThreshold} 
                       circuitData={currentCircuitData} />
        </div>

        <div className="flex-grow">
          <ImageDisplay file={currentFile} />
        </div>

        <div className="">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
