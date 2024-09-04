import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import RightSideBar from "./components/RightSideBar";
import ImageDisplay from "./components/ImageDisplay";

const CircuitInspectorPage = () => {
  return (
    <div className="bg-[#242424] min-h-screen flex flex-col">
      <header className="bg-[#333]">
        <Header />
      </header>

      <main className="flex flex-grow">
        <div className="">
          <LeftSidebar />
        </div>

        <div className="flex-grow">
          <ImageDisplay />
        </div>

        <div className="">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default CircuitInspectorPage;
