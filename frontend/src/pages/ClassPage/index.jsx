import ClassCard from "./components/ClassCard";
import AddClass from "./components/AddClass";

const ClassPage = () => {
  return (
    <div className="w-full p-10 bg-[#EFEFEF] min-h-screen">
      <div className="flex gap-10">
        <ClassCard />
        <ClassCard />
        <AddClass/>
      </div>
    </div>
  );
};

export default ClassPage;
