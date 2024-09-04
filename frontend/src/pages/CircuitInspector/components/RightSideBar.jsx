import AnswerKeys from "./AnswerKeys"
import ExpressionsResult from "./ExpressionsResult"
import { FaTableColumns } from "react-icons/fa6";
import { TbCircuitChangeover } from "react-icons/tb";
import { GiCircuitry } from "react-icons/gi";
import { MdOutlineGrading } from "react-icons/md";
import styles from './styles/component.module.css'

const RightSideBar = () => {
  return (
    <div className="w-[300px] h-full p-5 text-textGray">
      <div>
        <AnswerKeys/>
      </div>
      <div className="mt-5">
        <ExpressionsResult/>
      </div>
      <hr className="mt-8 border-borderGray"/>
      <div className="flex flex-col gap-3">
        <h1 className="font-semibold text-center text-lg mt-3">Assessment Tools</h1>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 ">
          <div className={styles.assessment_tool}>
            <FaTableColumns size={40}/>
            <label>Compare Truth Tables</label>
          </div>
          <div className={styles.assessment_tool}>
            <TbCircuitChangeover size={40}/>
            <label>Simulate Circuit</label>
          </div>
          <div className={styles.assessment_tool}>
            <GiCircuitry size={40}/>
            <label>Preview Netlist</label>
          </div>
          <div className={styles.assessment_tool}>
            <MdOutlineGrading size={40}/>
            <label>Grade Submission</label>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>  
  )
}

export default RightSideBar