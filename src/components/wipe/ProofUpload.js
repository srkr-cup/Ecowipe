import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import ScreenshotVerifier from './ScreenshotVerifier';
import { Dialog, DialogContent } from '../ui/dialog';
import { 
  Upload,
  CheckCircle,
  FileText,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function ProofUpload({ wipeData, onUploaded, onReset }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Show the verifier dialog
      setShowVerifier(true);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleVerificationComplete = async (result) => {
    setVerificationResult(result);
    if (result.success) {
      setVerified(true);
      
      // Create or update wipe record with proof
      const proofUrl = URL.createObjectURL(file);
      const updatedWipeData = {
        ...wipeData,
        proof_screenshot_url: proofUrl,
        status: 'completed',
        verification_date: new Date().toISOString()
      };

      try {
        // Call onUploaded to update the parent component
        await onUploaded(updatedWipeData);
        
        // Wait a bit before showing success state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success state before redirecting
        setShowVerifier(false);

        // Navigate to certificate page after a brief delay
        setTimeout(() => {
          navigate(`/certificate?id=${wipeData.id}&format=pdf`);
        }, 1500);
      } catch (error) {
        console.error('Failed to update wipe record:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Proof of Wipe</h2>
        <p className="text-gray-600">
          Upload a screenshot or log file showing the successful wipe completion.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {!file && !verified && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-green-500');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-green-500');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-green-500');
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) {
                    setFile(droppedFile);
                  }
                }}
              >
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your proof file here, or click to select
                </p>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.txt,.log"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="proof-file"
                  />
                  <Button variant="outline" className="mx-auto pointer-events-none">
                    Select File
                  </Button>
                </div>
              </div>
            )}

            {file && !verified && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-green-600" />
                  ) : (
                    <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">
                      Upload & Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Make sure your proof file shows the complete wipe process completion.
                    For best verification results, include the command output in your screenshot.
                  </p>
                </div>
              </div>
            )}

            {verified && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-1">
                    Proof Verified Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your data wipe proof has been verified and recorded.
                    Generating your certificate...
                  </p>
                  <div className="animate-pulse flex justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Verification Dialog */}
      <Dialog open={showVerifier} onOpenChange={setShowVerifier}>
        <DialogContent className="sm:max-w-[600px]">
          <ScreenshotVerifier
            imageFile={file}
            deviceType={wipeData?.device_type}
            os={wipeData?.operating_system}
            wipeMethod={wipeData?.wipe_method}
            onVerificationComplete={handleVerificationComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}