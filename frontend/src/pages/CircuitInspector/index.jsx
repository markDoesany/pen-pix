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
  const { task, loading: taskLoading, setTask} = useGetTask(taskId);
  const [currentFile, setCurrentFile] = useState({});
  const [currentCircuitData, setCurrentCircuitData] = useState([]);
  const [currentPredictions, setCurrentPredictions] = useState([]);
  const [filteredImgUrl, setFilteredImgUrl] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [isVisibilityToggled, setIsVisibilityToggled] = useState(true); // New loading state
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
      setCurrentCircuitData({...currentCircuitData, boolean_expressions:response.data.boolean_expressions})
      console.log("Boolean Expressions:", response.data.boolean_expressions)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const handleGetTruthTable = async() =>{
    setLoading(true)
    try {
      const response = await axios.get(`/detect-gates/get-truth-table/${currentFile.id}`)
      setCurrentCircuitData({...currentCircuitData, truth_table: response.data.truth_table})
    } catch (error) {
      console.log(error.message)
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

  const handleAddAnswerKey = () =>{

  }
  
  const handleDeleteExpression = async (expression_id) => {
    try {
      const response = await axios.post(`/task/delete-expression/${task.id}`, {
        expression_id: expression_id,
      });
  
      if (response.statusText === "OK") {
        setTask((prevTask) => ({
          ...prevTask,
          answer_keys: response.data.answer_keys,
        }));
      }
    } catch (error) {
      console.log(error.message);
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
          console.log(response.data.circuit_analysis);
        } catch (error) {
          console.log(error.message);
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
            onTogglePredictionVisibility={handlePredictionVisibility}
            onAnalyzeCircuit={handleAnalyzeCircuit}
            onGetTruthTable={handleGetTruthTable}
            onExportVerilog={handleExportVerilog}
            loading={loading} // Pass loading state to LeftSidebar
          />
        </div>

        <div className="flex-grow ">
          <ImageDisplay img_url={filteredImgUrl} predictions={currentPredictions} isPredictionVisible={isVisibilityToggled} />
        </div>

        <div className="">
          <RightSideBar 
            circuitData={currentCircuitData}
            task={task}
            onAddAnswerKey={handleAddAnswerKey}
            onDeleteExpression={handleDeleteExpression}
            />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
