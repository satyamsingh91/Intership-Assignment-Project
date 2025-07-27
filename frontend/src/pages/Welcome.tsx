import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  id: string;
  exp: number;
  iat: number;
}

function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    const localToken = localStorage.getItem("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
    }

    const token = tokenFromURL || localToken;

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setEmail(decoded.email);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToNotes = () => {
    navigate("/notes");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        Welcome, {email} 🎉
      </h1>
      <p className="text-gray-700 mb-6">You're successfully logged in.</p>

      <div className="space-x-4">
        <button
          onClick={goToNotes}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Notes
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Welcome;
