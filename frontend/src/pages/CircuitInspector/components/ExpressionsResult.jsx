const ExpressionsResult = ({ circuitData }) => {
  const booleanExpressions = circuitData?.boolean_expressions || [];

  return (
    <div className="bg-white text-gray-800 text-base rounded-lg w-full max-h-[250px] flex flex-col overflow-hidden border border-gray-300 shadow-md">
      <div className="bg-gray-800 text-white text-lg font-medium p-3 rounded-t-lg">
        Boolean Result
      </div>

      <div className="flex flex-col gap-4 p-4 overflow-y-auto">
        {booleanExpressions.length > 0 ? (
          booleanExpressions.map((expressionObj, index) => {
            const [label, expression] = Object.entries(expressionObj)[0];
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-2 bg-gray-50 border border-gray-200 rounded-md"
              >
                <span className="font-semibold text-gray-700 bg-gray-200 px-4 py-2 rounded-md w-20 text-center">
                  {label}
                </span>

                <span className="text-sm text-gray-600 flex-grow">
                  {expression}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-center italic mt-8">
            No Boolean expressions available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpressionsResult;
