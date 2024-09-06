const DetectLogicGatesOption = () => {
  return (
    <div className='bg-secondaryBg p-4 rounded-lg w-[370px] flex flex-col gap-4'>
      <h1 className='font-semibold'>Detect Logic Gates:</h1>
      <div className='flex justify-between text-sm'>
        <button className='bg-primaryColor p-2 rounded-lg'>Process current image</button>
        <button className='bg-thirdBg p-2 rounded-lg'>Process all images</button>
      </div>
    </div>
  )
}

export default DetectLogicGatesOption