const ClassCard = () => {
  return (
    <div className="shadow-lg w-[340px] h-[340px] p-5">
      <div>
        <span className="text-sm font-light">MW | 1:30 - 2:30 PM</span>
        <div className="mt-2">
          <h3 className="font-semibold text-3xl inline-block">Group 1</h3>
          <span className="ml-2 text-sm font-medium">CpE 2301</span>
        </div>
      </div>
      <div className="mt-5">
        <h4 className="text-sm font-medium">Recent Tasks</h4>
        <ul className="text-gray-500 list-disc list-inside pl-5 h-[120px] mt-2 flex flex-col gap-2">
          <li>Laboratory Exercise</li>
          <li>Assignment</li>
          <li>Mideterm</li>
          <li>Prefinal</li>
        </ul>
      </div>
      <div className="flex gap-3 justify-center mt-5">
        <button className="bg-black text-white rounded-lg w-1/2 text-sm py-2">Edit</button>
        <button className="bg-black text-white rounded-lg w-1/2 text-sm py-2">Delete</button>
      </div>
    </div>
  )
}

export default ClassCard