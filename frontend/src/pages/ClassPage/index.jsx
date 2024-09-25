import ClassCard from "./components/ClassCard"
import { useNavigate } from "react-router-dom"

const ClassPage = () => {
  const navigate = useNavigate()
  return (
    <div className="py-10">
      <ClassCard/>
      <button onClick={() => navigate('/create-class')}>Add a Class</button>
    </div>
  )
}

export default ClassPage