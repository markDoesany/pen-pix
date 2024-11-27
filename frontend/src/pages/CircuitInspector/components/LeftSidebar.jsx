import { FaSliders, FaTable, FaEye, FaEyeSlash, FaFileExport} from "react-icons/fa6";
import { GiLogicGateNor } from "react-icons/gi";
import { PiCircuitryFill } from "react-icons/pi";
import { ImSpinner9 } from "react-icons/im";
import SetThresholdSlider from "./SetThresholdSlider";
import DetectLogicGatesOption from "./DetectLogicGatesOptions";
import TruthTable from './TruthTable';
import styles from './styles/component.module.css';
import { useState, useEffect } from "react";

const LeftSidebar = ({ loading, circuitData, onApplyThreshold, onDetectLogicGates, onTogglePredictionVisibility, onAnalyzeCircuit, onGetTruthTable, onExportVerilog }) => {
  const [selectedTool, setSelectedTool] = useState('');
  const [isPredictionToggled, setIsPredictionToggled] = useState(false);

  useEffect(() => {
    // Update button states when circuitData changes
  }, [circuitData]);

  const handleToolClick = async (tool) => {
    if (!loading) {
        if (tool === "analyzeCircuit") {
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

  const hasPredictions = circuitData.predictions && circuitData.predictions.length > 0;
  const hasBooleanExpressions = circuitData.boolean_expressions && circuitData.boolean_expressions.length > 0;

  const isAnalyzeCircuitDisabled = !hasPredictions;
  const isTruthTableDisabled = !hasPredictions || !hasBooleanExpressions;
  const isExportVerilogDisabled = !hasPredictions || !hasBooleanExpressions;

  return (
    <div className={`w-[110px] h-full flex flex-col items-center gap-4 bg-white border border-borderGray font-sans text-customBlack1 px-3 py-4 relative select-none ${loading ? styles.disabled : ''}`}>
      <div
          className={`${styles.tool} ${
            selectedTool === 'threshold'
              ? 'bg-gray-600 text-white'
              : 'hover:bg-gray-200 hover:text-gray-800'
          } ${loading && selectedTool !== 'threshold' ? 'hover:bg-transparent' : ''}`}
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
        className={`${styles.tool} ${
          selectedTool === 'logicGates'
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-200 hover:text-gray-800'
        } ${loading && selectedTool !== 'logicGates' ? 'hover:bg-transparent' : ''}`}
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
        className={`${styles.tool} ${
          isPredictionToggled
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-200 hover:text-gray-800'
        } ${loading && selectedTool !== 'togglePredictions' ? 'hover:bg-transparent' : ''}`}
        onClick={handleTogglePredictions}
      >
        {isPredictionToggled ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        <h3 className={`${styles.tool_label} text-xs`}>Toggle Predictions</h3>
      </div>

      <div
        className={`${styles.tool} ${loading &&
          selectedTool === 'analyzeCircuit'
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-200 hover:text-gray-800'
        }${isAnalyzeCircuitDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
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
        className={`${styles.tool} ${
          selectedTool === 'truthTable'
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-200 hover:text-gray-800'
        } ${loading && selectedTool !== 'truthTable' ? 'hover:bg-transparent' : ''} ${isTruthTableDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={() => !isTruthTableDisabled && handleToolClick('truthTable')}
      >
        <FaTable size={20} />
        <h3 className={`${styles.tool_label} text-xs`}>Truth Table</h3>
      </div>

      <div
        className={`${styles.tool} ${loading &&
          selectedTool === 'exportVerilog'
            ? 'bg-gray-600 text-white'
            : 'hover:bg-gray-200 hover:text-gray-800'
        } ${isExportVerilogDisabled ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={() => !isExportVerilogDisabled && handleToolClick('exportVerilog')}
      >
        <FaFileExport size={20} />
        <h3 className={`${styles.tool_label} text-xs`}>Export Netlist</h3>
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
