import { useState } from "react";
import logo from "./assets/Athenor_LOGO.png";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import ParticleBackground from "./components/ParticleBackground";
import { motion } from "framer-motion";
import { simulateLogin } from "./mockData";

export default function Login() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));

    // Use mock authentication
    const result = simulateLogin(email, password);

    if (result.success) {
      // Store authentication data
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to dashboard
      navigate("/tutor-dashboard");
    } else {
      setModalTitle("Login Failed");
      setModalMessage(result.error);
      setModalType("error");
      setModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Particle Background */}
      <ParticleBackground isDarkMode={isDarkMode} />
      
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className={`backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border ${
          isDarkMode
            ? 'bg-gray-800/80 border-gray-700'
            : 'bg-white/80 border-cyan-200'
        }`}>
          {/* Logo / Title */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.img 
              src={logo} 
              alt="Athenor Logo" 
              className="mx-auto w-75 h-auto mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.3 }}
            />
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to continue to your dashboard</p>
          </motion.div>

          {/* Demo Credentials Notice */}
          <div className={`mb-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              🔑 Demo Credentials:
            </p>
            <div className={`text-xs space-y-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <p><strong>Email:</strong> demo@athenor.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full border rounded-lg px-4 py-2.5 transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-emerald-500'
                    : 'bg-white border-cyan-200 text-gray-900 placeholder-gray-400 focus:ring-cyan-500'
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-4 py-2.5 transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-emerald-500'
                    : 'bg-white border-cyan-200 text-gray-900 placeholder-gray-400 focus:ring-cyan-500'
                }`}
                required
              />
              <div className="text-right mt-1">
                <a href="/forgot-password" className={`text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-cyan-600 hover:text-cyan-700'
                }`}>
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:shadow-lg text-white'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Footer */}
          <p className={`mt-6 text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{" "}
            <a href="/register" className={`font-medium underline transition-colors ${
              isDarkMode
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-cyan-600 hover:text-cyan-700'
            }`}>
              Sign up
            </a>
          </p>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
}
