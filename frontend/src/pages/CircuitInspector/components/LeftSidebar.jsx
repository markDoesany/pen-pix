import { FaSliders, FaTable, FaEye, FaEyeSlash, FaFileExport, FaUpload } from "react-icons/fa6";
import { GiLogicGateNor } from "react-icons/gi";
import { PiCircuitryFill } from "react-icons/pi";
import SetThresholdSlider from "./SetThresholdSlider";
import DetectLogicGatesOption from "./DetectLogicGatesOptions";
import styles from './styles/component.module.css';
import { useRef, useState } from "react";
import useFileUpload from '../../../hooks/useFileUpload';

const LeftSidebar = ({ loading, task, circuitData, onApplyThreshold, onDetectLogicGates }) => {
  const [selectedTool, setSelectedTool] = useState('');
  const [isPredictionToggled, setIsPredictionToggled] = useState(false);
  const { handleUpload } = useFileUpload(task.id);
  const fileInputRef = useRef(null);

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
      } else {
        setSelectedTool((prevSelectedTool) => (prevSelectedTool === tool ? '' : tool));
      }
    }
  };

  const handleTogglePredictions = () => {
    if (!loading) {
      setIsPredictionToggled((prevState) => !prevState);
    }
  };

  const handleApplyThreshold = (thresholdValue, mode) => {
    if (!loading) {
      onApplyThreshold(thresholdValue, mode);
    }
  };

  return (
    <div className={`w-[110px] h-full flex flex-col items-center gap-4 bg-secondaryBg border border-borderGray font-sans text-textGray px-3 py-4 relative ${loading ? styles.disabled : ''}`}>
      <div
        className={`${styles.tool} ${selectedTool === 'fileUpload' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleUploadFileClick()}
      >
        <FaUpload size={20} />
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
        className={`${styles.tool} ${selectedTool === 'threshold' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleToolClick('threshold')}
      >
        <FaSliders size={20} /> 
        <h3 className={`${styles.tool_label} text-xs`}>Set Threshold</h3> 
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'logicGates' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleToolClick('logicGates')}
      >
        <GiLogicGateNor size={30} /> 
        <h3 className={`${styles.tool_label} text-xs`}>Logic Gates</h3> 
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'analyzeCircuit' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleToolClick('analyzeCircuit')}
      >
        <PiCircuitryFill size={25} /> 
        <h3 className={`${styles.tool_label} text-xs`}>Analyze Circuit</h3> 
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'truthTable' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleToolClick('truthTable')}
      >
        <FaTable size={20} /> 
        <h3 className={`${styles.tool_label} text-xs`}>Truth Table</h3>
      </div>

      <div
        className={`${styles.tool} ${isPredictionToggled ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={handleTogglePredictions}
      >
        {isPredictionToggled ? <FaEyeSlash size={20} /> : <FaEye size={20} />} 
        <h3 className={`${styles.tool_label} text-xs`}>Toggle Predictions</h3> 
      </div>

      <div
        className={`${styles.tool} ${selectedTool === 'exportVerilog' ? 'bg-primaryColor text-white' : ''} ${loading && 'hover:bg-transparent'}`}
        onClick={() => handleToolClick('exportVerilog')}
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
          <DetectLogicGatesOption onDetectLogicGates={onDetectLogicGates} loading={loading}/>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
