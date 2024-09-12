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
  const { task, loading: taskLoading } = useGetTask(taskId);
  const [currentFile, setCurrentFile] = useState({});
  const [currentCircuitData, setCurrentCircuitData] = useState([]);
  const [currentPredictions, setCurrentPredictions] = useState([]);
  const [filteredImgUrl, setFilteredImgUrl] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const files = useRecoilValue(FilesAtom);

  const handleApplyThreshold = async (thresholdValue, mode = 'single') => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.post('/detect-gates/set-filter-threshold', {
        thresholdValue,
        mode,
        fileId: currentFile?.id,
      }, { responseType: 'blob' });

      const imageUrl = URL.createObjectURL(response.data);
      setFilteredImgUrl(imageUrl);
    } catch (error) {
      console.error('Error applying threshold:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleDetectLogicGates = async (mode) => {
    setLoading(true); 
    try {
      const response  = await axios.post(`/detect-gates/process-detection/${currentFile.id}`, {
        mode
      });
      setCurrentPredictions(response.data.predictions);
      console.log("Predictions", response.data.predictions);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentFile = (file) => {
    setCurrentFile(file);
  };

  useEffect(() => {
    console.log("Updated current file", currentFile);
  }, [currentFile]);

  useEffect(() => {
    setCurrentFile(files[0]);
  }, [files]);

  useEffect(() => {
    const getCircuitData = async () => {
      if (currentFile?.id) {
        setLoading(true); // Set loading to true when fetching data
        try {
          const response = await axios.get(`/detect-gates/get-circuit-data/${currentFile.id}`);
          setCurrentCircuitData(response.data.circuit_analysis);
          setCurrentPredictions(response.data.circuit_analysis.predictions);
          console.log(response.data.circuit_analysis);
        } catch (error) {
          console.log(error.message);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      }
    };
    getCircuitData();
  }, [currentFile?.id]);

  useEffect(() => {
    if (currentCircuitData?.threshold_value !== undefined) {
      handleApplyThreshold(currentCircuitData.threshold_value);
    }
  }, [currentCircuitData]);

  if (taskLoading) return <div>Loading...</div>; // Display loading state

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col">
      <header className="bg-[#333]">
        <Header task={task} files={files} onCurrentFileChange={handleCurrentFile} />
      </header>

      <main className="flex flex-grow">
        <div className="">
          <LeftSidebar 
            task={task} 
            circuitData={currentCircuitData} 
            onApplyThreshold={handleApplyThreshold} 
            onDetectLogicGates={handleDetectLogicGates}
            loading={loading} // Pass loading state to LeftSidebar
          />
        </div>

        <div className="flex-grow">
          <ImageDisplay img_url={filteredImgUrl} predictions={currentPredictions} loading={loading}/>
        </div>

        <div className="">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
