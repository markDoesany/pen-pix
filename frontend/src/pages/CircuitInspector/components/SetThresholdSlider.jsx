import { useState } from 'react'
import ReactSlider from 'react-slider'

const SetThresholdSlider = () => {
  const [thresholdValue, SetThresholdValue] = useState(0)

  return (
    <div className='bg-secondaryBg p-4 rounded-lg w-[370px] flex flex-col gap-4'>
      <h1 className='font-semibold'>Set Threshold:</h1>
      <div className='flex items-center gap-5'>
        <ReactSlider
          className="w-full h-2 rounded-lg items-center flex" 
          thumbClassName="w-5 h-5 bg-primaryColor rounded-full" 
          trackClassName="h-2 bg-primaryBg" // Unfilled track styling
          onChange={(value) => SetThresholdValue(value)}
          value={thresholdValue} // Bind value to state
          renderTrack={(props, state) => (
            <div
              {...props}
              className={`h-2 rounded-lg ${
                state.index === 0 ? 'bg-[#65364E]' : 'bg-primaryBg'
              }`}
            />
          )}
        />
        <span className='w-[55px] bg-[#474747] text-center p-1 rounded-lg text-sm'>{thresholdValue}%</span>
      </div>
      <div className='flex justify-between text-sm'>
        <button className='bg-primaryColor p-2 rounded-lg'>Apply to current image</button>
        <button className='bg-thirdBg p-2 rounded-lg'>Apply to all images</button>
      </div>
    </div>
  )
}

export default SetThresholdSlider