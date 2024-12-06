import AnswerKeys from "./AnswerKeys";
import ExpressionsResult from "./ExpressionsResult";
import CompareTruthTable from "./CompareTruthTable";
import PreviewNetlist from "./PreviewNetlist";
import { FaTableColumns } from "react-icons/fa6";
import { GiCircuitry } from "react-icons/gi";
import { MdOutlineGrading } from "react-icons/md";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import styles from './styles/component.module.css';
import { useState, useEffect } from "react";
import axios from "axios";
import GradeTableModal from "./GradeTableModal";  

const RightSideBar = ({ task, file, circuitData, onGradeUpdate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCompareTable, setShowCompareTable] = useState(false);
  const [expressions, setExpressions] = useState([]);
  const [answerTable, setAnswerTable] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [netlistContent, setNetlistContent] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);  
  const [gradeResults, setGradeResults] = useState([]);  

  const hasAnswerKeys = task?.answer_keys?.length > 0;
  const relevantAnswerKey = hasAnswerKeys
    ? task.answer_keys.find((key) => key.item === `Item ${file?.item_number}`)
    : null;

  useEffect(() => {
    if (relevantAnswerKey && relevantAnswerKey.keys) {
      const extractedExpressions = relevantAnswerKey.keys.map(key => key.expression);
      setExpressions(extractedExpressions);
      console.log("Expressions", extractedExpressions); 
    }
  }, [relevantAnswerKey]);

  useEffect(() => {
    const getAnswerTruthTable = async () => {
      try {
        const response = await axios.post('detect-gates/generate-truth-table', { expressions });
        setAnswerTable(response.data.truth_table);
        console.log("Generated Truth Table", response.data.truth_table);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAnswerTruthTable();
  }, [expressions]);

  const handleGenerateNetlist = async () => {
    try {
      const response = await axios.get(`/detect-gates/generate-netlist/${file.id}`);
      const netlist = await response.data; 
      setNetlistContent(netlist);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error generating netlist:", error.message);
    }
  };

  const handleDownloadNetlist = () => {
    const blob = new Blob([netlistContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `circuit_${file.id}.asc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateGrade = async (fileId, totalGrade) => {
    try {
      const response = await axios.put(`/files/update-grade/${fileId}`, { total_grade: totalGrade });
  
      if (response.status === 200) {
        console.log("Grade updated successfully:", response.data);
        onGradeUpdate(fileId, true);
      } else {
        console.error("Failed to update grade:", response.data);
      }
    } catch (error) {
      console.error("Error updating grade:", error.message);
    }
  };

  const handleGradeSubmission = async() => {
    if (!answerTable || !circuitData.truth_table) {
      console.error("Missing data for comparison.");
      return;
    }

    if (!relevantAnswerKey || !relevantAnswerKey.keys) {
      console.error("No relevant answer key found.");
      return;
    }

    const detailedResults = [];

    Object.entries(answerTable).forEach(([key, tableRow], index) => {
      if (circuitData.truth_table[key]) {
        const isMatch = JSON.stringify(tableRow) === JSON.stringify(circuitData.truth_table[key]);

        if (isMatch) {
          const grade = relevantAnswerKey.keys[index]?.grade || 0;

          detailedResults.push({
            Output: `OUT ${index + 1}`,
            Expression: relevantAnswerKey.keys[index]?.expression || "Unknown Expression",
            Grade: grade,
            Result: "Match",
          });
        } else {
          detailedResults.push({
            Output: `OUT ${index + 1}`,
            Expression: relevantAnswerKey.keys[index]?.expression || "Unknown Expression",
            Grade: 0,
            Result: "Mismatch",
          });
        }
      } else {
        detailedResults.push({
          Output: `OUT ${index + 1}`,
          Expression: relevantAnswerKey.keys[index]?.expression || "Unknown Expression",
          Grade: 0,
          Result: "Missing in Submitted Table",
        });
      }
    });
    const totalGrade = detailedResults.reduce((sum, result) => sum + result.Grade, 0);

    setGradeResults(detailedResults);
    await updateGrade(file.id, totalGrade);
    setShowGradeModal(true);  
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleShowCompareTable = () => {
    setShowCompareTable(true); 
  };
  const handleCloseGradeModal = () => {
    setShowGradeModal(false);  
  };

  const handleCloseCompareTable = () => {
    setShowCompareTable(false); 
  };

  const handleClosePreviewNetlist = () =>{
    setIsPreviewOpen(false)
  }

  return (
    <div className={`bg-white flex flex-col gap-5 relative ${isCollapsed ? 'w-20 bg-transparent' : 'w-[400px]'} h-full px-5 text-textGray transition-all duration-300 ease-in-out pb-10`}>
      <div className="mt-5 cursor-pointer" onClick={handleToggleCollapse}>
        {isCollapsed ? <GoSidebarExpand size={25} /> : <GoSidebarCollapse size={25} />}
      </div>

      {!isCollapsed && (
        <>
          <div><AnswerKeys relevantAnswerKey={relevantAnswerKey} /></div>
          <div className="mt-5"><ExpressionsResult circuitData={circuitData} /></div>
          <hr className="mt-8 border-borderGray" />
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-center text-lg mt-3">Assessment Tools</h1>
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
              <div className={`${styles.assessment_tool}`} onClick={handleShowCompareTable}>
                <FaTableColumns size={40} />
                <label>Compare Truth Tables</label>
              </div>
              <div className={styles.assessment_tool} onClick={handleGenerateNetlist}>
                <GiCircuitry size={40} />
                <label>Preview Netlist</label>
              </div>
              <div className={styles.assessment_tool} onClick={handleGradeSubmission}>
                <MdOutlineGrading size={40} />
                <label>Grade Submission</label>
              </div>
            </div>
          </div>
        </>
      )}

      {showCompareTable && (
        <div className="bg-white p-4 rounded-lg shadow-lg max-h-[80vh] w-[80vw] overflow-auto">
          <CompareTruthTable answerTable={answerTable} circuitTruthTable={circuitData.truth_table} onClose={handleCloseCompareTable}/>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-4"
            onClick={handleCloseCompareTable}
          >
            Close
          </button>
        </div>
      )}

      {showGradeModal && (
        <GradeTableModal results={gradeResults} onClose={handleCloseGradeModal} />
      )}

      {isPreviewOpen && (
        <PreviewNetlist
          netlistContent={netlistContent}
          onDownload={handleDownloadNetlist}
          onClose={handleClosePreviewNetlist}
        />
      )}
    </div>
  );
};

export default RightSideBar;
