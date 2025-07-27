import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/welcome");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-indigo-200 to-purple-200">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Sign Up</h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create Account
        </button>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-500">or</span>
        </div>

        {/* ✅ Google Signup Button */}
        <a
          href="http://localhost:5000/auth/google"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <img
            src="/google-logo.jpeg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </a>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-700 font-medium hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
