import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex flex-col items-center justify-center text-center p-8">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to PenPix!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to PenPix—where your digital needs are our top priority, and our sign-up process is almost as quick as the impending existential crisis you&apos;ll have while using our services. Dive in, or just sign in and let us help you procrastinate further.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
