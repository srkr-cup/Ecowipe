import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { 
  CheckCircle, 
  Award, 
  Leaf, 
  Download, 
  RotateCcw, 
  Shield, 
  Lock, 
  Recycle,
  Sparkles,
  TrendingUp,
  Eye,
  FileText,
  Image
} from 'lucide-react';

const BadgeIcons = { Shield, Lock, Leaf, Recycle };

// Confetti animation component
const ConfettiParticle = ({ delay }) => (
  <motion.div
    initial={{ y: -20, opacity: 1, rotate: 0 }}
    animate={{ 
      y: 400, 
      opacity: 0, 
      rotate: 360,
      x: Math.random() * 200 - 100
    }}
    transition={{ 
      duration: 3, 
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
  />
);

export default function SuccessModal({ isOpen, onClose, onReset, points, co2, newBadge, recordId, verificationConfidence }) {
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = async () => {
    if (!recordId) return;
    
    setDownloading(true);
    
    try {
      if (downloadFormat === "pdf") {
        // Open certificate page in new window for PDF download
        const certificateUrl = createPageUrl(`Certificate?id=${recordId}&format=pdf`);
        window.open(certificateUrl, '_blank');
      } else if (downloadFormat === "jpg") {
        // Open certificate page in new window for JPG download
        const certificateUrl = createPageUrl(`Certificate?id=${recordId}&format=jpg`);
        window.open(certificateUrl, '_blank');
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
    
    setDownloading(false);
  };

  const NewBadgeDisplay = () => {
    if (!newBadge) return null;
    const Icon = BadgeIcons[newBadge.icon] || Shield;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          delay: 0.6, 
          duration: 0.8,
          type: "spring",
          bounce: 0.4
        }}
        className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 p-6 rounded-2xl mt-6 border-3 border-yellow-600 shadow-2xl overflow-hidden"
      >
        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ 
              delay: 0.8 + i * 0.1,
              duration: 1,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${10 + (i % 2) * 70}%`
            }}
          />
        ))}
        
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-900" />
            <h3 className="text-sm font-bold text-yellow-900 uppercase tracking-wider">New Badge Unlocked!</h3>
            <Sparkles className="w-5 h-5 text-yellow-900" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center border-2 border-yellow-700">
              <Icon className="w-8 h-8 text-yellow-800" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl text-yellow-900">{newBadge.name}</p>
              <p className="text-sm text-yellow-800">{newBadge.description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const EcoImpactDisplay = () => (
    <div className="grid grid-cols-2 gap-4 pt-6">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl p-4 text-center border border-green-200 shadow-lg"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Award className="w-10 h-10 text-green-600 mx-auto mb-2" />
        </motion.div>
        <p className="font-semibold text-green-700">Eco Points Earned</p>
        <motion.p 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
          className="text-3xl font-black text-green-600"
        >
          +{points}
        </motion.p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm rounded-xl p-4 text-center border border-emerald-200 shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Leaf className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
        </motion.div>
        <p className="font-semibold text-emerald-700">CO₂ Impact Saved</p>
        <motion.p 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
          className="text-3xl font-black text-emerald-600"
        >
          {co2} kg
        </motion.p>
      </motion.div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/40 border-2 border-green-200 overflow-hidden">
        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.1} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 text-center space-y-4"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            className="relative w-24 h-24 mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-4 border-green-300 shadow-xl">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-green-400 rounded-full"
            />
          </motion.div>
          
          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              🎉 Wipe Verified!
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              You've successfully secured your device and contributed to a <strong className="text-green-600">sustainable future</strong>!
            </p>
            
            {verificationConfidence && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-3"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  AI Verification: {verificationConfidence}% confidence
                </span>
              </motion.div>
            )}
          </motion.div>
          
          <EcoImpactDisplay />
          <NewBadgeDisplay />
          
          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mt-6"
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Your Certificate
            </h3>
            
            <div className="flex items-center gap-3 mb-4">
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="jpg">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      JPG
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleDownload}
                disabled={downloading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex-1"
              >
                {downloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download {downloadFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              {downloadFormat === 'pdf' ? 'Professional PDF certificate for official use' : 'High-quality image for sharing'}
            </p>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-4 pt-4"
          >
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Wipe
            </Button>
          </motion.div>

          {/* Eco Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold text-sm">Eco Impact Tip</span>
            </div>
            <p className="text-blue-600 text-sm">
              By securely wiping your device, you've enabled safe recycling and reduced electronic waste. 
              Keep up the great work! 🌱
            </p>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}