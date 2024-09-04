import { FaSliders, FaTable, FaEye, FaFileExport } from "react-icons/fa6";
import { GiLogicGateNor } from "react-icons/gi";
import { PiCircuitryFill } from "react-icons/pi";

import styles from './styles/component.module.css'

const LeftSidebar = () => {
  return (
    <div className="w-[110px] h-full flex flex-col items-center justify-center gap-5 bg-secondaryBg border border-borderGray font-sans text-textGray px-3 py-4">
      <div className={styles.tool}>
        <FaSliders size={30}/>
        <h3 className={styles.tool_label}>Set Threshold</h3>
      </div>
      <div className={styles.tool}>
        <GiLogicGateNor size={45}/>
        <h3 className={styles.tool_label}>Logic Gates</h3>
      </div>
      <div className={styles.tool}>
        <PiCircuitryFill size={35}/>
        <h3 className={styles.tool_label}>Analyze Circuit</h3>
      </div>
      <div className={styles.tool}>
        <FaTable size={30}/>
        <h3 className={styles.tool_label}>Truth Table</h3>
      </div>
      <div className={styles.tool}>
        <FaEye size={30}/>
        <h3 className={styles.tool_label}>Toggle Predictions</h3>
      </div>
      <div className={`${styles.tool}`}>
        <FaFileExport size={30}/>
        <h3 className={styles.tool_label}>Export Verilog</h3>
      </div>
    </div>
  )
}

export default LeftSidebar