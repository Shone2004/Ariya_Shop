import React, { useState, useContext } from "react";
import { FiX, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const { isLoginOpen, setIsLoginOpen } = useContext(ShopContext);
  const { login, register } = useAuth();
  
  // view can be "login", "register", or "forgot"
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  if (!isLoginOpen) return null;

  const handleClose = () => {
    setIsLoginOpen(false);
    // Reset back to login view after closing so it's ready for next time
    setTimeout(() => setView("login"), 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (view === "login") {
      const success = await login(email, password);
      if (success) {
        handleClose();
      }
    } else if (view === "register") {
      const success = await register(name, email, password);
      if (success) {
        handleClose();
      }
    } else if (view === "forgot") {
      console.log("Sending reset link...");
      alert("If an account with that email exists, a reset link has been sent.");
      setView("login");
      return; // don't close modal yet
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] bg-black/60 transition-opacity flex items-center justify-center p-4 cursor-pointer"
        onClick={handleClose}
      >
        <div 
          className="relative w-full max-w-md bg-white p-8 md:p-10 shadow-2xl cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-[#B35F44] text-white flex items-center justify-center hover:bg-[#8F4832] transition-colors shadow-md z-10 cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <h2 className="text-center font-serif text-3xl text-[#222] mb-8 font-medium">
            {view === "login" ? "Login" : view === "register" ? "Register" : "Reset Password"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {view === "forgot" ? (
              <>
                <p className="text-sm text-[#555] text-center mb-6">
                  Lost your password? Please enter your email address. You will receive a link to create a new password via email.
                </p>
                <div>
                  <label className="block text-sm text-[#555] mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none transition-colors"
                  />
                </div>
              </>
            ) : (
              <>
                {view === "register" && (
                  <div>
                    <label className="block text-sm text-[#555] mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-[#555] mb-1">Username or Email <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#555] mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-2.5 pr-10 text-sm focus:border-gray-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {view === "login" && (
                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center text-sm text-[#555] cursor-pointer">
                      <input type="checkbox" className="mr-2 border-gray-300 rounded-sm" />
                      Remember me
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setView("forgot")}
                      className="text-sm text-[#333] hover:text-[#B35F44] underline transition-colors cursor-pointer"
                    >
                      Lost your password?
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#222] hover:bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-colors cursor-pointer w-full flex justify-center"
              >
                {view === "login" ? "LOG IN" : view === "register" ? "REGISTER" : "SEND RESET LINK"}
              </button>
            </div>
          </form>

          {view === "forgot" ? (
             <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="inline-flex items-center text-[#333] hover:text-[#B35F44] transition-colors font-medium text-sm cursor-pointer"
                >
                  <FiArrowLeft className="mr-2" /> Back to Login
                </button>
             </div>
          ) : (
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-sm text-[#555]">
                {view === "login" ? "No account yet?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setView(view === "login" ? "register" : "login")}
                  className="text-[#333] underline hover:text-[#B35F44] transition-colors font-medium cursor-pointer"
                >
                  {view === "login" ? "Create an account" : "Login here"}
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default LoginModal;
