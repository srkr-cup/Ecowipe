import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Leaf,
  CheckCircle
} from "lucide-react";
import { User } from "../../entities/User";
import { SendEmail } from "../../integrations/Core";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("email"); // email -> otp -> password -> complete
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if user exists
      const users = await User.filter({ email: email });
      const userExists = users.length > 0;
      
      if (isLogin && !userExists) {
        setError("No account found with this email. Please sign up first.");
        setLoading(false);
        return;
      }

      // Generate and send OTP
      const otpCode = generateOTP();
      setGeneratedOTP(otpCode);

      await SendEmail({
        to: email,
        subject: "EcoWipe - Your OTP Code",
        body: `Your EcoWipe verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`
      });

      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleOTPSubmit = async () => {
    if (otp !== generatedOTP) {
      setError("Invalid OTP code. Please check and try again.");
      return;
    }

    if (isLogin) {
      // For login, OTP verification is enough
      try {
        const users = await User.filter({ email: email });
        if (users.length > 0) {
          // Simulate login success
          setStep("complete");
          setTimeout(() => {
            onSuccess(users[0]);
            onClose();
          }, 2000);
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    } else {
      // For signup, go to password step
      setStep("password");
    }
  };

  const handlePasswordSubmit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create user account (password would be hashed in real implementation)
      const userData = {
        email: email,
        full_name: email.split("@")[0], // Use email prefix as default name
        organization: "Individual User",
        total_eco_points: 0,
        total_devices_wiped: 0,
        total_data_wiped_gb: 0,
        eco_badges: []
      };

      await User.updateMyUserData(userData);
      setStep("complete");
      
      setTimeout(() => {
        onSuccess(userData);
        onClose();
      }, 2000);
    } catch (err) {
      setError("Account creation failed. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setGeneratedOTP("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                {step === "complete" ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <>
                    <Shield className="w-7 h-7 text-white" />
                    <Leaf className="w-4 h-4 text-white -ml-1 -mt-2" />
                  </>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">
                {step === "email" && (isLogin ? "Welcome Back" : "Join EcoWipe")}
                {step === "otp" && "Verify Your Email"}
                {step === "password" && "Create Password"}
                {step === "complete" && "Welcome to EcoWipe!"}
              </h2>
              
              <p className="text-gray-600">
                {step === "email" && (isLogin ? "Sign in to continue your eco journey" : "Start your sustainable data wiping journey")}
                {step === "otp" && `Enter the 6-digit code sent to ${email}`}
                {step === "password" && "Create a secure password for your account"}
                {step === "complete" && "Your account is ready! Let's start wiping securely."}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Step */}
            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Sending..." : (
                    <>
                      Send Verification Code
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => {setIsLogin(!isLogin); setError("");}}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-center text-2xl tracking-wider"
                    maxLength={6}
                    onKeyPress={(e) => e.key === "Enter" && handleOTPSubmit()}
                  />
                </div>

                <Button
                  onClick={handleOTPSubmit}
                  disabled={otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Verify Code
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setStep("email")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    ← Back to email
                  </button>
                </div>
              </div>
            )}

            {/* Password Step */}
            {step === "password" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePasswordSubmit}
                  disabled={loading || password.length < 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Complete Step */}
            {step === "complete" && (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <p className="text-green-700 font-medium">
                  {isLogin ? "Welcome back! Redirecting to dashboard..." : "Account created successfully! Welcome to EcoWipe!"}
                </p>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}