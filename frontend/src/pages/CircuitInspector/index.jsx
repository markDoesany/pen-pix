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
  const { task, loading: taskLoading} = useGetTask(taskId);
  const [currentFile, setCurrentFile] = useState({});
  const [currentCircuitData, setCurrentCircuitData] = useState({});
  const [currentPredictions, setCurrentPredictions] = useState([]);
  const [filteredImgUrl, setFilteredImgUrl] = useState('');
  const [loading, setLoading] = useState(false); 
  const [isVisibilityToggled, setIsVisibilityToggled] = useState(true); 
  const files = useRecoilValue(FilesAtom);

  const handleApplyThreshold = async (thresholdValue, mode = 'single') => {
    try {
      const response = await axios.post('/detect-gates/set-filter-threshold', {
        thresholdValue,
        mode,
        fileId: currentFile?.id,
      }, { responseType: 'blob' });
      
      const imageUrl = URL.createObjectURL(response.data);
      setFilteredImgUrl(imageUrl);
      setCurrentCircuitData((prev) => ({
        ...prev,
        threshold_value: thresholdValue,
      }));
    } catch (error) {
      console.error('Error applying threshold:', error);
    } 
  };

  const handleDetectLogicGates = async (mode) => {
    setLoading(true); 
    try {
      const response  = await axios.post(`/detect-gates/process-detection/${currentFile.id}`, {
        mode
      });
      setCurrentPredictions(response.data.predictions);
      setCurrentCircuitData({...currentCircuitData, predictions:response.data.predictions})
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentFile = (file) => {
    setCurrentFile(file);
  };

  const handlePredictionVisibility = () => {
    setIsVisibilityToggled(!isVisibilityToggled)
  }

  const handleAnalyzeCircuit = async() => {
    setLoading(true)
    try {
      const response = await axios.post(`/detect-gates/analyze-circuit/${currentFile.id}`)
      setCurrentCircuitData({...currentCircuitData, boolean_expressions:response.data.boolean_expressions, truth_table: response.data.truth_table})
      console.log("Boolean Expressions:", response.data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const handleExportVerilog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/detect-gates/export-verilog/${currentFile.id}`, {
        responseType: 'blob', 
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
  
      link.setAttribute('download', `circuit_${currentFile.id}.v`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error('Error downloading the file:', error.message);
    } finally {
      setLoading(false);
    }
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
        // setLoading(true); // Set loading to true when fetching data
        try {
          const response = await axios.get(`/detect-gates/get-circuit-data/${currentFile.id}`);
          setCurrentCircuitData(response.data.circuit_analysis);
          setCurrentPredictions(response.data.circuit_analysis.predictions);
          handleApplyThreshold(response.data.circuit_analysis.threshold_value);

          console.log("Circuit Data",response.data.circuit_analysis);
        } catch (error) {
          console.log(error.message);
        } 
      }
    };
    getCircuitData();
  }, [currentFile?.id]);

  if (taskLoading) return <div>Loading...</div>; 

  return (
    <div className="bg-[#eeeded] min-h-screen flex flex-col text">
      <header className="bg-[#333]">
        <Header task={task} files={files} onCurrentFileChange={handleCurrentFile} />
      </header>

      <main className="flex flex-grow">
        <div className="">
          <LeftSidebar 
            circuitData={currentCircuitData} 
            onApplyThreshold={handleApplyThreshold} 
            onDetectLogicGates={handleDetectLogicGates}
            onTogglePredictionVisibility={handlePredictionVisibility}
            onAnalyzeCircuit={handleAnalyzeCircuit}
            onExportVerilog={handleExportVerilog}
            loading={loading}
          />
        </div>

        <div className="flex-grow ">
          <ImageDisplay img_url={filteredImgUrl} predictions={currentPredictions} isPredictionVisible={isVisibilityToggled} />
        </div>

        <div className="">
          <RightSideBar 
            circuitData={currentCircuitData}
            task={task}
            file={currentFile}
            />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
