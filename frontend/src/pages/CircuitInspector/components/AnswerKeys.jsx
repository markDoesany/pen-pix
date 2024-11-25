import { FaTrashAlt } from "react-icons/fa";

const AnswerKeys = ({ onAdd, task, onDeleteExpression }) => {
  const hasAnswerKeys = task?.answer_keys?.length > 0;

  return (
    <div className="bg-white text-gray-800 text-base rounded-lg w-full max-h-[300px] flex flex-col overflow-hidden border border-gray-300 shadow-md">
      <div className="bg-gray-800 text-white text-lg font-medium p-3 rounded-t-lg">
        Answer Keys
      </div>

      <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[220px]">
        {hasAnswerKeys ? (
          task?.answer_keys.map((key, index) => {
            const [output, expression] = key.expression.split(/\s*=\s*/);
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-2 bg-gray-50 border border-gray-200 rounded-md"
              >
                <span className="font-semibold text-gray-700 bg-gray-200 px-4 py-2 rounded-md w-20 text-center">
                  {output}
                </span>

                <span className="text-sm text-gray-600 flex-grow">
                  {expression}
                </span>

                <FaTrashAlt
                  className="text-gray-500 hover:text-red-600 cursor-pointer"
                  size={20}
                  onClick={() => onDeleteExpression(index)}
                />
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-center italic">
            No answer keys available.
          </div>
        )}
      </div>

      <div
        className={`flex ${
          hasAnswerKeys ? "justify-end" : "justify-center"
        } p-4 border-t border-gray-200 bg-gray-50`}
      >
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
          onClick={onAdd}
        >
          Add Answer Key
        </button>
      </div>
    </div>
  );
};

export default AnswerKeys;
