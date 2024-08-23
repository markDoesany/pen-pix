import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToast from '../../../hooks/useToast'

const LoginForm = ({ onViewChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post('/auth/login', { email, password });
      const userId = response.data.user.id; // Extract user ID from response

      toastSuccess(response.data.message);
      // Redirect to dashboard with user ID
      navigate(`/dashboard/${userId}`);
      
    } catch (error) {
      console.error('There was an error logging in:', error.response?.data || error.message);
      toastError(error.response?.data?.error || error.message);
      
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white shadow-lg shadow-black/10 p-10 rounded-xl">
        <img src="/icons/PenPix-logo.png" alt="PenPix Logo" className="mb-5 max-w-full h-auto" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 p-2 border border-gray-400 rounded-lg outline-none focus:border-teal-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 p-2 border border-gray-400 rounded-lg outline-none focus:border-teal-400"
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              className="mr-2"
            />
            <label htmlFor="remember_me" className="text-gray-700">Remember Me</label>
          </div>
          <button
            type="submit"
            className={`w-full h-12 rounded-lg cursor-pointer transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#953867] hover:bg-black'} text-white`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="text-left mt-5 mb-4">
            <p className="text-gray-700">Don&apos;t have an account? <span className="text-[#953867] hover:underline cursor-pointer" onClick={() => onViewChange('register')}>Sign Up</span></p>
            <br />
            <span className="text-[#828282] hover:text-[#953867] hover:underline cursor-pointer" onClick={() => onViewChange('forgotPassword')}>Forgot Password?</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
