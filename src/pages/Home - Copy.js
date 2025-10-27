import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Shield,
  Leaf,
  Award,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Laptop,
  HardDrive,
  Usb,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

import DeviceSelector from "../components/wipe/DeviceSelector";
import WipeMethodSelector from "../components/wipe/WipeMethodSelector";
import CommandGenerator from "../components/wipe/CommandGenerator";
import ProofUpload from "../components/wipe/ProofUpload";
import EcoTip from "../components/eco/EcoTip";
import AuthModal from "../components/auth/Authmodal.js";
import EntrancePage from "../components/auth/EntrancePage";
import { User } from "../entities/User";


export default function HomePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [wipeData, setWipeData] = useState({
    deviceType: null,
    os: null,
    wipeMethod: null,
    command: null,
    proofUploaded: false
  });
  const workflowRef = useRef(null);

  const steps = [
    { number: 1, title: "Select Device", completed: !!wipeData.deviceType },
    { number: 2, title: "Choose Method", completed: !!wipeData.wipeMethod },
    { number: 3, title: "Execute Wipe", completed: !!wipeData.command },
    { number: 4, title: "Upload Proof", completed: wipeData.proofUploaded },
  ];

  const handleDeviceSelect = (deviceType, os) => {
    setWipeData(prev => ({ ...prev, deviceType, os }));
    setCurrentStep(2);
  };

  const handleMethodSelect = (method) => {
    setWipeData(prev => ({ ...prev, wipeMethod: method }));
    setCurrentStep(3);
  };

  const handleCommandGenerated = (command) => {
    setWipeData(prev => ({ ...prev, command }));
  };

  const handleCommandExecuted = () => {
    setCurrentStep(4);
  };
  
  const handleProofUploaded = () => {
    setWipeData(prev => ({ ...prev, proofUploaded: true }));
  };

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      // User not authenticated or error checking auth
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const startWorkflow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setWorkflowStarted(true);
    setCurrentStep(1);
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAuth = async (formData, isSignUp) => {
    try {
      let userData;
      if (isSignUp) {
        // Create new user
        userData = await User.create({
          email: formData.email,
          full_name: formData.fullName,
          organization: "Individual User",
          total_eco_points: 0,
          total_devices_wiped: 0,
          total_data_wiped_gb: 0,
          eco_badges: []
        });
      } else {
        // Sign in existing user
        const users = await User.filter({ email: formData.email });
        userData = users[0];
      }
      
      handleAuthSuccess(userData);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    
    // Smoothly start workflow after auth
    setWorkflowStarted(true);
    setCurrentStep(1);
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const resetWorkflow = () => {
    setWorkflowStarted(false);
    setCurrentStep(0);
    setWipeData({
      deviceType: null,
      os: null,
      wipeMethod: null,
      command: null,
      proofUploaded: false
    });
  };

  const deviceIcons = {
    mobile: Smartphone,
    laptop: Laptop,
    hdd: HardDrive,
    ssd: HardDrive,
    usb: Usb
  };

  if (!workflowStarted && !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <EntrancePage 
          onGoogleClick={() => setShowAuthModal(true)} 
          onEmailClick={handleAuth}
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30 py-16">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-8">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">Certified Secure Wiping</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-green-800 to-emerald-700 bg-clip-text text-transparent leading-tight">
              EcoWipe
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Securely wipe your devices with <span className="font-semibold text-green-600">certified proof</span>,
              promote eco-friendly recycling, and earn rewards for sustainable practices.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Shield, text: "Military-Grade Security" },
                { icon: Award, text: "Certified Compliance" },
                { icon: Leaf, text: "Eco-Conscious" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
                >
                  <feature.icon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startWorkflow}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
              >
                Start Secure Wipe
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Certificate Preview Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Receive an Official Certificate of Destruction
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Upon successful verification, you'll receive a tamper-proof digital certificate.
              Perfect for compliance, record-keeping, or peace of mind.
            </p>
            <ul className="space-y-3">
              {[
                { icon: CheckCircle, text: "AI-Verified Proof of Wipe" },
                { icon: Award, text: "Industry Standard Compliance" },
                { icon: Leaf, text: "Quantified Eco-Impact" },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl transform lg:rotate-3">
              <div className="bg-white rounded-xl p-6 border-4 border-gray-100 aspect-[1.414/1] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-green-600"/>
                    <div>
                      <h3 className="font-bold text-green-700 text-lg">EcoWipe</h3>
                      <p className="text-xs text-gray-500">Data Destruction Certificate</p>
                    </div>
                  </div>
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">This certifies that</p>
                  <p className="font-bold text-lg text-gray-800">Your Name Here</p>
                  <p className="text-sm text-gray-600 mt-2">
                    has successfully completed a secure data wipe.
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs">
                    <p className="font-bold">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-gray-500">ID: EW-CERT-SAMPLE</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">AI VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

    {workflowStarted && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        ref={workflowRef}
      >
        {/* Progress Steps */}
        <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-green-600 border-green-600 text-white'
                        : currentStep > step.number -1
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{step.number}</span>
                    )}
                  </motion.div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.number ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Workflow */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  {currentStep === 1 && (
                    <DeviceSelector onSelect={handleDeviceSelect} />
                  )}
                  
                  {currentStep === 2 && (
                    <WipeMethodSelector
                      deviceType={wipeData.deviceType}
                      onSelect={handleMethodSelect}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <CommandGenerator
                      deviceType={wipeData.deviceType}
                      os={wipeData.os}
                      method={wipeData.wipeMethod}
                      onGenerated={handleCommandGenerated}
                      onExecuted={handleCommandExecuted}
                    />
                  )}
                  
                  {currentStep === 4 && (
                    <ProofUpload
                      wipeData={wipeData}
                      onUploaded={handleProofUploaded}
                      onReset={resetWorkflow}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Eco Tip */}
            {currentStep > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <EcoTip deviceType={wipeData.deviceType} />
              </motion.div>
            )}
          </div>
        </section>
      </motion.div>
    )}
    </div>
  );
}