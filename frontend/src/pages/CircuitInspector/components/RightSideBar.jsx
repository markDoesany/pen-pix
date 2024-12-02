import AnswerKeys from "./AnswerKeys";
import ExpressionsResult from "./ExpressionsResult";
import CompareTruthTable from "./CompareTruthTable";
import { FaTableColumns } from "react-icons/fa6";
// import { TbCircuitChangeover } from "react-icons/tb";
import { GiCircuitry } from "react-icons/gi";
// import { MdOutlineGrading } from "react-icons/md";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import styles from './styles/component.module.css';
import { useState, useEffect } from "react";
import axios from "axios";

const RightSideBar = ({ task, file, circuitData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCompareTable, setShowCompareTable] = useState(false);
  const [expressions, setExpressions] = useState([]);
  const [answerTable, setAnswerTable] = useState([]);

  const hasAnswerKeys = task?.answer_keys?.length > 0;
  const relevantAnswerKey = hasAnswerKeys
    ? task.answer_keys.find((key) => key.item === `Item ${file?.item_number}`)
    : null;

  useEffect(() => {
    if (relevantAnswerKey && relevantAnswerKey.keys) {
      const extractedExpressions = relevantAnswerKey.keys.map(key => key.expression);
      setExpressions(extractedExpressions); 
      console.log("Expressions",extractedExpressions); 
    }
  }, [relevantAnswerKey]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleShowCompareTable = async() => {
    setShowCompareTable(true); 
    console.log("Submitted tBlae",circuitData.truth_table)

    try {
      const response = await axios.post('detect-gates/generate-truth-table', {
        expressions
      })
      setAnswerTable(response.data.truth_table)
      console.log("Generated Truth Table", response.data.truth_table)
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleCloseCompareTable = () => {
    setShowCompareTable(false); 
  };

  return (
    <div
      className={`bg-white flex flex-col gap-5 relative ${isCollapsed ? 'w-20 bg-black' : 'w-[300px]'} h-full px-5 text-textGray transition-all duration-300 ease-in-out`}
    >
      <div className="mt-5 cursor-pointer" onClick={handleToggleCollapse}>
        {isCollapsed ? <GoSidebarExpand size={25} /> : <GoSidebarCollapse size={25} />}
      </div>

      {!isCollapsed && (
        <>
          <div>
            <AnswerKeys relevantAnswerKey={relevantAnswerKey} />
          </div>
          <div className="mt-5">
            <ExpressionsResult circuitData={circuitData} />
          </div>
          <hr className="mt-8 border-borderGray" />
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-center text-lg mt-3">Assessment Tools</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              <div className={`${styles.assessment_tool}`} onClick={handleShowCompareTable}>
                <FaTableColumns size={40} />
                <label>Compare Truth Tables</label>
              </div>
              {/* <div className={styles.assessment_tool}>
                <TbCircuitChangeover size={40} />
                <label>Simulate Circuit</label>
              </div> */}
              <div className={styles.assessment_tool}>
                <GiCircuitry size={40} />
                <label>Preview Netlist</label>
              </div>
              {/* <div className={styles.assessment_tool}>
                <MdOutlineGrading size={40} />
                <label>Grade Submission</label>
              </div> */}
            </div>
          </div>
        </>
      )}

      {showCompareTable && (
        <div className="bg-white p-4 rounded-lg shadow-lg max-h-[80vh] w-[80vw] overflow-auto">
          <CompareTruthTable answerTable={answerTable} submittedTable={circuitData.truth_table} onClose={handleCloseCompareTable} />
        </div>
      )}
    </div>
  );
};

export default RightSideBar;
