import { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onViewChange }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post("/auth/forgot-password", {
        email: email,
      });

      setMessage(response.data.message);
      setError(""); // Clear any previous errors
            
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
      setMessage(""); // Clear any previous messages
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Password Recovery</h1>
      <p className="text-gray-700 mb-5 text-center">
        Enter your university email and we&apos;ll send you a link to recover your password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            id="recovery-email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 p-2 border border-gray-400 rounded-lg outline-none focus:border-teal-400"
          />
        </div>
        <button
          type="submit"
          className={`w-full h-12 rounded-lg cursor-pointer transition duration-300 mb-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#953867] hover:bg-black'} text-white`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Recover Password"}
        </button>
        <button
          type="button"
          className="w-full h-12 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300"
          onClick={() => onViewChange("login")}
        >
          Cancel
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
