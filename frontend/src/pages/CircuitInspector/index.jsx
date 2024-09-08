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

  const handleApplyThreshold = async (thresholdValue, mode) => {
    try {
      const response = await axios.post('/detect-gates/set-filter-threshold', {
        thresholdValue,
        mode,
        fileId: currentFile?.id
      }, { responseType: 'blob' });  
      console.log(response.data)
      const imageUrl = URL.createObjectURL(response.data);

      setCurrentFile(prevFile => ({
        ...prevFile,
        file_url: imageUrl
      }));

    } catch (error) {
      console.error('Error applying threshold:', error);
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

  useEffect(()=>{
    const getCircuitData = async() =>{
      try {
        const response = await axios.get(`/detect-gates/get-circuit-data/${currentFile.id}`)
        setCurrentCircuitData(response.data.circuit_analysis)
      } catch (error) {
        console.log(error.message)
      }
    } 
    getCircuitData()
  }, [currentFile?.id])


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
                       circuitData={currentCircuitData}/>
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
