import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import RightSideBar from "./components/RightSideBar";
import ImageDisplay from "./components/ImageDisplay";
import { useParams } from "react-router-dom";
import useGetTask from '../../hooks/useGetTask';
import { useState } from "react";

const CircuitInspectorPage = () => {
  const { taskId } = useParams();
  const { task, files, loading} = useGetTask(taskId);
  const [ currentFile, setCurrentFile ] = useState(files[0])

  const handleCurrentFile = (file) =>{
    setCurrentFile(file)
  }

  if (loading) return <div>Loading...</div>;
  console.log(files[0])
  return (
    <div className="bg-[#242424] min-h-screen flex flex-col">
      <header className="bg-[#333]">
        <Header task={task} files={files} onCurrentFileChange={handleCurrentFile} />
      </header>

      <main className="flex flex-grow">
        <div className="">
          <LeftSidebar task={task}/>
        </div>

        <div className="flex-grow">
          <ImageDisplay image={currentFile} />
        </div>

        <div className="">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
