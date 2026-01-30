import { useState } from "react";
import logo from "./assets/Athenor_LOGO.png";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "./DarkModeContext";
import Modal from "./Modal";
import ParticleBackground from "./components/ParticleBackground";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setModalTitle("Missing Email");
      setModalMessage("Please enter your email address.");
      setModalType("warning");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo mode: Show success message
    setModalTitle("Password Reset Email Sent! 📧");
    setModalMessage(
      "This is a demo version. In the full version, a password reset link would be sent to your email.\n\n" +
      "For this demo, please use one of these accounts:\n\n" +
      "Admin: admin@athenor.com / demo123\n" +
      "Tutor: tutor@athenor.com / demo123"
    );
    setModalType("success");
    setModalOpen(true);
    setLoading(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalType === "success") {
      navigate("/");
    }
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
            className="text-center mb-6"
          >
            <motion.img 
              src={logo} 
              alt="Athenor Logo" 
              className="mx-auto w-48 h-auto mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.3 }}
            />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Forgot Password?
            </h2>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your email and we'll send you a reset link
            </p>
          </motion.div>

          {/* Demo Notice */}
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            isDarkMode ? 'bg-amber-900/30 text-amber-300 border border-amber-700' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <strong>Demo Mode:</strong> Password reset is simulated. Use the demo credentials on the login page.
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Email Address</label>
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

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:shadow-lg text-white'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <p className={`mt-6 text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Remember your password?{" "}
            <a href="/" className={`font-medium underline transition-colors ${
              isDarkMode
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-cyan-600 hover:text-cyan-700'
            }`}>
              Back to Login
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
        onClose={handleModalClose}
      />
    </>
  );
}
