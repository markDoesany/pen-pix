import { FaSliders, FaTable, FaEye, FaEyeSlash, FaFileExport, FaUpload } from "react-icons/fa6";
import { GiLogicGateNor } from "react-icons/gi";
import { PiCircuitryFill } from "react-icons/pi";
import { ImSpinner9 } from "react-icons/im";
import SetThresholdSlider from "./SetThresholdSlider";
import DetectLogicGatesOption from "./DetectLogicGatesOptions";
import TruthTable from './TruthTable';
import styles from './styles/component.module.css';
import { useRef, useState, useEffect } from "react";
import useFileUpload from '../../../hooks/useFileUpload';

const LeftSidebar = ({ loading, task, circuitData, onApplyThreshold, onDetectLogicGates, onTogglePredictionVisibility, onAnalyzeCircuit, onGetTruthTable, onExportVerilog }) => {
  const [selectedTool, setSelectedTool] = useState('');
  const [isPredictionToggled, setIsPredictionToggled] = useState(false);
  const { handleUpload } = useFileUpload(task.id);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Update button states when circuitData changes
  }, [circuitData]);

  const handleUploadFileClick = () => {
    if (!loading) {
      fileInputRef.current.click();
    }
  };

  const handleToolClick = async (tool, files = []) => {
    if (!loading) {
      if (tool === 'fileUpload') {
        if (files.length > 0) {
          try {
            await handleUpload(files);
          } catch (error) {
            console.log(error.message);
          }
        }
      } else if (tool === "analyzeCircuit") {
        onAnalyzeCircuit();
      } else if (tool === 'truthTable') {
        onGetTruthTable();
      } else if (tool === 'exportVerilog') {
        onExportVerilog();
      }
    }
    setSelectedTool((prevSelectedTool) => (prevSelectedTool === tool ? '' : tool));
  };

  const handleTogglePredictions = () => {
    if (!loading) {
      setIsPredictionToggled((prevState) => !prevState);
      onTogglePredictionVisibility();
    }
  };

  const handleApplyThreshold = (thresholdValue, mode) => {
    if (!loading) {
      onApplyThreshold(thresholdValue, mode);
    }
  };

  // Check the availability of predictions and boolean expressions
  const hasPredictions = circuitData.predictions && circuitData.predictions.length > 0;
  const hasBooleanExpressions = circuitData.boolean_expressions && circuitData.boolean_expressions.length > 0;

  // Disable state for tools
  const isAnalyzeCircuitDisabled = !hasPredictions;
  const isTruthTableDisabled = !hasPredictions || !hasBooleanExpressions;
  const isExportVerilogDisabled = !hasPredictions || !hasBooleanExpressions;

  return (
    <div className={`w-[110px] h-full flex flex-col items-center gap-4 bg-secondaryBg border border-borderGray font-sans text-textGray px-3 py-4 relative select-none ${loading ? styles.disabled : ''}`}>
      <div
        className={`${styles.tool} ${selectedTool === 'fileUpload' ? 'bg-primaryColor text-white' : ''} ${loading && selectedTool !== 'fileUpload' ? 'hover:bg-transparent' : ''}`}
        onClick={() => handleUploadFileClick()}
      >
        {loading && selectedTool === 'fileUpload' ? (
          <ImSpinner9 size={20} className="animate-spin" />
        ) : (
          <FaUpload size={20} />
        )}
        <h3 className={`${styles.tool_label} text-xs`}>File Upload</h3>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              handleToolClick('fileUpload', files);
            }
          }}
        />
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'threshold' ? 'bg-primaryColor text-white' : ''} ${loading && selectedTool !== 'threshold' ? 'hover:bg-transparent' : ''}`}
        onClick={() => handleToolClick('threshold')}
      >
        {loading && selectedTool === 'threshold' ? (
          <ImSpinner9 size={20} className="animate-spin" />
        ) : (
          <FaSliders size={20} />
        )}
        <h3 className={`${styles.tool_label} text-xs`}>Set Threshold</h3>
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'logicGates' ? 'bg-primaryColor text-white' : ''} ${loading && selectedTool !== 'logicGates' ? 'hover:bg-transparent' : ''}`}
        onClick={() => handleToolClick('logicGates')}
      >
        {loading && selectedTool === 'logicGates' ? (
          <ImSpinner9 size={30} className="animate-spin" />
        ) : (
          <GiLogicGateNor size={30} />
        )}
        <h3 className={`${styles.tool_label} text-xs`}>Logic Gates</h3>
      </div>

      <div
        className={`${styles.tool} ${isPredictionToggled ? 'bg-primaryColor text-white' : ''} ${loading && selectedTool !== 'togglePredictions' ? 'hover:bg-transparent' : ''}`}
        onClick={handleTogglePredictions}
      >
        {isPredictionToggled ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        <h3 className={`${styles.tool_label} text-xs`}>Toggle Predictions</h3>
      </div>

      <div
        className={`${styles.tool} ${loading && selectedTool !== 'analyzeCircuit' ? 'hover:bg-transparent' : ''} ${isAnalyzeCircuitDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={() => !isAnalyzeCircuitDisabled && handleToolClick('analyzeCircuit')}
      >
        {loading && selectedTool === 'analyzeCircuit' ? (
          <ImSpinner9 size={25} className="animate-spin" />
        ) : (
          <PiCircuitryFill size={25} />
        )}
        <h3 className={`${styles.tool_label} text-xs`}>Analyze Circuit</h3>
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'truthTable' ? 'bg-primaryColor text-white' : ''} ${loading && selectedTool !== 'truthTable' ? 'hover:bg-transparent' : ''} ${isTruthTableDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={() => !isTruthTableDisabled && handleToolClick('truthTable')}
      >
        <FaTable size={20} />
        <h3 className={`${styles.tool_label} text-xs`}>Truth Table</h3>
      </div>

      <div
        className={`${styles.tool} ${loading && selectedTool !== 'exportVerilog' ? 'hover:bg-transparent' : ''} ${isExportVerilogDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={() => !isExportVerilogDisabled && handleToolClick('exportVerilog')}
      >
        <FaFileExport size={20} />
        <h3 className={`${styles.tool_label} text-xs`}>Export Verilog</h3>
      </div>

      {selectedTool === 'threshold' && (
        <div className="absolute -right-64 top-24">
          <SetThresholdSlider onApplyThreshold={handleApplyThreshold} value={circuitData.threshold_value} />
        </div>
      )}

      {selectedTool === 'logicGates' && (
        <div className="absolute -right-64 top-48">
          <DetectLogicGatesOption onDetectLogicGates={onDetectLogicGates} loading={loading} />
        </div>
      )}

      {selectedTool === 'truthTable' && (
        <div className="absolute -right-64 top-48">
          <TruthTable data={circuitData.truth_table} />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
