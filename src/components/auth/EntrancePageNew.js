import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import authConfig from './auth-config.json';

export default function EntrancePage({ onGoogleClick, onEmailClick }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');

  const currentState = isSignUp ? authConfig.states.SIGN_UP : authConfig.states.SIGN_IN;

  const validateForm = () => {
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      await onEmailClick(formData, isSignUp);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const toggleView = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 p-8"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo and Header */}
        <motion.div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <img src="/logo.svg" alt="EcoWipe" className="w-full h-full object-contain" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup-header' : 'signin-header'}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome to EcoWipe
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {currentState.title}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Auth Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? 'signup-form' : 'signin-form'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {error && (
              <Alert variant="destructive" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Social Login */}
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
                <span className="px-4 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 text-gray-500">
                  OR
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                      required={isSignUp}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                  required
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                  required
                  minLength={6}
                />
              </div>

              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                      required={isSignUp}
                      minLength={6}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full py-6 bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                {currentState.button}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm">
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {/* Handle forgot password */}}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot password?
                </button>
              )}
              <button
                type="button"
                onClick={toggleView}
                className="text-green-600 hover:text-green-700 font-medium ml-auto"
              >
                {currentState.toggle}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}