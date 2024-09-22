const ClassCard = () => {
  return (
    <div className="shadow-md w-[300px] h-[250px]">
      <div>
        <span>MW | 1:30 - 2:30 PM</span>
        <div>
          <h3>Group 1</h3>
          <span>CpE 2301</span>
        </div>
      </div>
      <div>
        <h4>Recent Tasks</h4>
        <div>
          <p> - Laboratory Exercise </p>
          <p> - Laboratory Exercise </p>
          <p> - Laboratory Exercise </p>
          <p> - Laboratory Exercise </p>
        </div>
      </div>
      <div>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  )
}

export default ClassCard