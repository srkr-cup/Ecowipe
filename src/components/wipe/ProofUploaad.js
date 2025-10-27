import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  AlertTriangle,
  FileImage,
} from "lucide-react";
import { UploadFile } from "@/integrations/Core";
import { WipeRecord } from "@/entities/WipeRecord";
import { User } from "@/entities/User";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SuccessModal from "./SuccessModal";
import ScreenshotVerifier from "./ScreenshotVerifier";

const BADGES = {
  GREEN_SHIELD: { name: "Green Shield", description: "Completed your first secure wipe!", icon: "Shield" },
  DATA_GUARDIAN: { name: "Data Guardian", description: "Wiped 5 devices securely.", icon: "Lock" },
  ECO_WARRIOR: { name: "Eco Warrior", description: "Wiped 10 devices, saving the planet!", icon: "Leaf" },
  RECYCLING_CHAMPION: { name: "Recycling Champion", description: "Wiped over 500GB of data.", icon: "Recycle" },
};

export default function ProofUpload({ wipeData, onUploaded, onReset }) {
  const [uploading, setUploading] = useState(false);
  const [deviceSize, setDeviceSize] = useState("");
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB");
      return;
    }

    setError("");
    setUploadedFile(file);
    setShowVerification(true);
  };

  const handleVerificationComplete = async (verificationResult) => {
    if (!verificationResult.success) {
      setVerificationPassed(false);
      setError(verificationResult.message);
      return;
    }

    // Verification passed, proceed with upload and record creation
    setVerificationPassed(true);
    setUploading(true);
    setError("");

    try {
      const { file_url } = await UploadFile({ file: uploadedFile });
      const user = await User.me();
      
      const ecoPoints = wipeData.wipeMethod === 'military' ? 100 : 
                       wipeData.wipeMethod === 'deep' ? 75 : 50;
      
      const sizeInGB = parseFloat(deviceSize) || 0;
      const co2Saved = (sizeInGB * 0.5).toFixed(1);
      
      const wipeRecord = await WipeRecord.create({
        user_name: user.full_name,
        device_type: wipeData.deviceType,
        operating_system: wipeData.os,
        wipe_method: wipeData.wipeMethod,
        wipe_command: wipeData.command,
        proof_screenshot_url: file_url,
        status: "completed",
        eco_points: ecoPoints,
        device_size_gb: sizeInGB
      });

      // Update user eco stats
      const updatedTotalWipes = (user.total_devices_wiped || 0) + 1;
      const updatedTotalGB = (user.total_data_wiped_gb || 0) + sizeInGB;
      const currentBadges = user.eco_badges || [];
      let newlyEarnedBadge = null;

      if (updatedTotalWipes >= 1 && !currentBadges.includes("GREEN_SHIELD")) {
        newlyEarnedBadge = BADGES.GREEN_SHIELD;
        currentBadges.push("GREEN_SHIELD");
      }
      if (updatedTotalWipes >= 5 && !currentBadges.includes("DATA_GUARDIAN")) {
        newlyEarnedBadge = BADGES.DATA_GUARDIAN;
        currentBadges.push("DATA_GUARDIAN");
      }
      if (updatedTotalWipes >= 10 && !currentBadges.includes("ECO_WARRIOR")) {
        newlyEarnedBadge = BADGES.ECO_WARRIOR;
        currentBadges.push("ECO_WARRIOR");
      }
      if (updatedTotalGB >= 500 && !currentBadges.includes("RECYCLING_CHAMPION")) {
        newlyEarnedBadge = BADGES.RECYCLING_CHAMPION;
        currentBadges.push("RECYCLING_CHAMPION");
      }
      
      await User.updateMyUserData({
        total_eco_points: (user.total_eco_points || 0) + ecoPoints,
        total_devices_wiped: updatedTotalWipes,
        total_data_wiped_gb: updatedTotalGB,
        eco_badges: currentBadges,
      });

      setModalData({
        points: ecoPoints,
        co2: co2Saved,
        newBadge: newlyEarnedBadge,
        recordId: wipeRecord.id,
        verificationConfidence: Math.round(verificationResult.confidence)
      });

      setShowSuccessModal(true);
      onUploaded();
    } catch (err) {
      setError("Failed to complete wipe record. Please try again.");
      console.error(err);
    }

    setUploading(false);
  };

  if (showSuccessModal) {
    return (
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onReset={onReset}
        {...modalData}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Proof of Execution
        </h2>
        <p className="text-gray-600 text-lg">
          Upload a screenshot showing the command execution and completion
        </p>
      </div>

      <Card className="shadow-xl border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="deviceSize" className="text-lg font-semibold">
                Device Storage Size (GB)
              </Label>
              <Input
                id="deviceSize"
                type="number"
                placeholder="e.g. 256"
                value={deviceSize}
                onChange={(e) => setDeviceSize(e.target.value)}
                className="mt-2 text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps calculate your eco-impact
              </p>
            </div>

            {!uploadedFile && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Screenshot
                </h3>
                <p className="text-gray-600 mb-4">
                  Take a screenshot of your terminal/command prompt showing the wipe completion
                </p>
                
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="proof-upload"
                />
                <Label
                  htmlFor="proof-upload"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    uploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <FileImage className="w-4 h-4" />
                  Choose Screenshot
                </Label>
              </div>
            )}

            {uploadedFile && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Screenshot Uploaded</h4>
                  <p className="text-green-700 text-sm">
                    📷 {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                </div>

                {showVerification && (
                  <ScreenshotVerifier 
                    imageFile={uploadedFile}
                    deviceType={wipeData.deviceType}
                    os={wipeData.os}
                    wipeMethod={wipeData.wipeMethod}
                    onVerificationComplete={handleVerificationComplete}
                  />
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!showVerification && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Screenshot Requirements:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Must show the command execution in terminal/cmd</li>
                    <li>• Should display completion messages (e.g., "completed," "done," "100%")</li>
                    <li>• Clear and readable text for AI verification</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}