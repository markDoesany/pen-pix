import ComboBox from "./components/ClassGroupCombobox";
import StudentList from "./components/StudentList";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { UserAtom } from '../../atoms/UserAtom';
import { useEffect, useState } from "react";
import axios from "axios";

let options = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const EditClassPage = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState({
    classCode: '',
    classGroup: null,
    classSchedule: '',
    studentList: []
  });

  const [studentId, setStudentId] = useState(''); 
  const user = useRecoilValue(UserAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`/classes/get-class/${classId}`);
        setClassData({
          classCode: response.data.class_code,
          classGroup: response.data.class_group,
          classSchedule: response.data.class_schedule,
          studentList: response.data.student_list || [], 
        });
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
  
    fetchClassData();
  }, [classId]);
  

  const handleSaveChanges = async () => {
    const classPayload = {
      classCode: classData.classCode,
      classGroup: classData.classGroup,
      classSchedule: classData.classSchedule,
      studentList: classData.studentList
    };
  
    try {
      const response = await axios.put(`/classes/edit-class/${classId}`, classPayload);
      console.log(response);
      navigate(`/classes/${user?.id}`);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };
  

  const handleAddStudent = () => {
    if (studentId.trim()) { 
      setClassData((prev) => ({
        ...prev,
        studentList: [...prev.studentList, studentId]
      }));
      setStudentId(''); 
    } else {
      alert("Please enter a valid Student ID.");
    }
  };

  const handleRemoveStudent = (index) => {
    setClassData((prev) => ({
      ...prev,
      studentList: prev.studentList.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex flex-col p-5 gap-4 md:w-[800px] mx-auto">
      <h1 className="text-[28px] font-medium mt-2">Edit Class</h1>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium">Class Name</label>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Course Code"
            className="flex-1 placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"
            value={classData.classCode}
            onChange={(e) => setClassData({ ...classData, classCode: e.target.value })}
          />
          <div className="w-100px">
            <ComboBox
              options={options}
              placeholder="Class Group"
              value={String(classData.classGroup)}
              onChange={(selected) => setClassData({ ...classData, classGroup: selected.value })}
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Class Schedule"
          className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"
          value={classData.classSchedule}
          onChange={(e) => setClassData({ ...classData, classSchedule: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-md font-medium">Student ID Number</label>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Id Number"
            className="placeholder-gray-500 placeholder-opacity-75 focus:placeholder-opacity-50 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none text-md"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <BsThreeDots />
        </div>
      </div>
      <button
        className="px-6 py-2 bg-black text-white rounded-lg"
        onClick={handleAddStudent}
      >
        Add Student
      </button>
      <div>
        <StudentList studentList={classData.studentList} onRemoveStudent={handleRemoveStudent}/>
      </div>
      <div className="flex gap-4 mt-5">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg"
          onClick={() => navigate(`/classes/${user?.id}`)}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 bg-black text-white rounded-lg"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditClassPage;
