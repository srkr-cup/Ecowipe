import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export default function EntrancePage({ onGoogleClick, onEmailClick }) {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const toggleView = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEmailClick(formData, isSignUp);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 p-8"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo Animation */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut",
              delay: 0.5
            }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <img 
              src="/logo.svg" 
              alt="EcoWipe" 
              className="w-full h-full object-contain"
            />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Welcome to EcoWipe
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          <Button 
            onClick={onGoogleClick}
            className="w-full py-6 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm flex items-center justify-center gap-3"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 text-gray-500">OR</span>
            </div>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            {isSignUp && (
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 bg-green-600 hover:bg-green-700 text-white shadow-lg"
            >
              {isSignUp ? 'Create Account' : 'Sign in'}
            </Button>
          </motion.form>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-between text-sm"
        >
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Forgot password?
          </a>
          <a href="#" className="text-green-600 hover:text-green-700 font-medium">
            Need an account? Sign up
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}