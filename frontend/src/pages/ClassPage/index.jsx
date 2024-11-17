import { useEffect, useState } from "react";
import axios from "axios";
import ClassCard from "./components/ClassCard";
import AddClass from "./components/AddClass";

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/classes/get-classes");
        setClasses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = (classId) => {
    setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== classId));
  };

  return (
    <div className="w-full p-10 bg-[#EFEFEF] min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10">
          {classes.length > 0 && (
            classes.map((classData) => (
              <ClassCard key={classData.id} classData={classData} onDelete={handleDelete} />
            ))
          )}
          <AddClass />
        </div>
      )}
    </div>
  );
};

export default ClassPage;
