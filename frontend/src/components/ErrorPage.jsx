import { Link } from 'react-router-dom'; // Import Link for navigation
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS if not already done

const ErrorPage = ({ errorType, errorMessage }) => {
  const renderErrorContent = () => {
    switch (errorType) {
      case 'unauthorized':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "You don't have permission to access this page."}</p>
          </>
        );
      case '404':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "Page not found. The page you're looking for might have been removed or you might have entered an incorrect URL."}</p>
            <img
              src="https://via.placeholder.com/400x200.png?text=Error+404"
              alt="Error 404"
              className="mx-auto mb-6"
            />
          </>
        );
      case '500':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Server Error</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "There was a problem with the server. Please try again later."}</p>
            <img
              src="https://via.placeholder.com/400x200.png?text=Error+500"
              alt="Error 500"
              className="mx-auto mb-6"
            />
          </>
        );
      case '403':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Forbidden</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "You don't have permission to access this resource."}</p>
          </>
        );
      case '400':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Bad Request</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "The request could not be understood or was missing required parameters."}</p>
          </>
        );
      case '408':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Request Timeout</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "The request took too long and timed out. Please try again."}</p>
          </>
        );
      case '409':
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Conflict</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "There was a conflict with the request. It could be due to a resource conflict or a duplicate entry."}</p>
          </>
        );
      default:
        return (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-xl text-gray-700 mb-6">{errorMessage || "An unexpected error occurred."}</p>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {renderErrorContent()}
        <Link
          to="/"
          className="text-teal-600 hover:text-teal-800 text-lg font-semibold"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
