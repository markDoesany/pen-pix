
const AnswerKeys = ({relevantAnswerKey }) => {
  
  return (
    <div className="bg-white text-gray-800 text-base rounded-lg w-full max-h-[300px] flex flex-col overflow-hidden border border-gray-300 shadow-md cursor-pointer">
      <div className="bg-gray-800 text-white text-lg font-medium p-3 rounded-t-lg">
        Answer Keys
      </div>

      <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[300px]">
        {relevantAnswerKey ? (
          <div className="mb-4">
            <h3 className="font-bold text-gray-700 mb-2">
              {relevantAnswerKey.item}
            </h3>

            {relevantAnswerKey.keys.map((key, keyIndex) => (
              <div
                key={keyIndex}
                className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-700 overflow-hidden text-ellipsis">
                  <span
                    className="block truncate hover:overflow-visible hover:whitespace-normal"
                    title={key.expression}
                  >
                    {key.expression}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center italic">
            No answer keys available for the selected file.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerKeys;
