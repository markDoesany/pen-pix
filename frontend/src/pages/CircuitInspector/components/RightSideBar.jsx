import AnswerKeys from "./AnswerKeys";
import ExpressionsResult from "./ExpressionsResult";
import { FaTableColumns } from "react-icons/fa6";
import { TbCircuitChangeover } from "react-icons/tb";
import { GiCircuitry } from "react-icons/gi";
import { MdOutlineGrading } from "react-icons/md";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import AddAnswerKey from "./AddAnswerKey";
import styles from './styles/component.module.css';
import { useState } from "react";

const RightSideBar = ({ task, circuitData, onAddAnswerKey, onDeleteExpression }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddAnswer, setIsAddAnswer] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAddAnswerKey = () => {
    setIsAddAnswer(!isAddAnswer);
  };

  return (
    <div 
      className={`relative flex flex-col gap-5  ${isCollapsed ? 'w-20 bg-black' : 'w-[300px]'} h-full px-5 text-textGray transition-all duration-300 ease-in-out`}
    >
      <div className="mt-5 cursor-pointer" onClick={handleToggleCollapse}>
        {isCollapsed ? <GoSidebarExpand size={25} /> : <GoSidebarCollapse size={25} />}
      </div>
      
      {!isCollapsed && (
        <>
          <div>
            <AnswerKeys onAdd={handleAddAnswerKey} task={task} onDeleteExpression={onDeleteExpression}/>
          </div>
          <div className="mt-5">
            <ExpressionsResult circuitData={circuitData}/>
          </div>
          <hr className="mt-8 border-borderGray" />
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-center text-lg mt-3">Assessment Tools</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              <div className={`${styles.assessment_tool}`}>
                <FaTableColumns size={40} />
                <label>Compare Truth Tables</label>
              </div>
              <div className={styles.assessment_tool}>
                <TbCircuitChangeover size={40} />
                <label>Simulate Circuit</label>
              </div>
              <div className={styles.assessment_tool}>
                <GiCircuitry size={40} />
                <label>Preview Netlist</label>
              </div>
              <div className={styles.assessment_tool}>
                <MdOutlineGrading size={40} />
                <label>Grade Submission</label>
              </div>
            </div>
          </div>
          {isAddAnswer && (
            <div className="absolute top-10 -left-96">
              <AddAnswerKey onClose={handleAddAnswerKey} onAddAnswerKey={onAddAnswerKey}/>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RightSideBar;
