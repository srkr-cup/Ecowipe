import React, { useState } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createWorker } from 'tesseract.js';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader, 
  Eye,
  RotateCcw
} from "lucide-react";

// Exact validation keywords as specified in requirements
const VALIDATION_KEYWORDS = {
  windows: {
    quick: [
      "cipher /w", "100% completed", 
      "wipe complete", "successfully wiped",
      "free space cleaned"
    ],
    deep: [
      "secure erase complete", "3-pass complete",
      "cipher /w", "multiple pass completed",
      "deep clean successful"
    ],
    military: [
      "DoD compliant wipe complete",
      "7-pass wipe successful",
      "military grade sanitization complete",
      "cipher /w", "secure deletion verified"
    ]
  },
  linux: {
    quick: [
      "shred", "overwrite repeatedly",
      "--random-source", "deallocate",
      "--zero", "remove file"
    ],
    deep: [
      "shred --iterations=3",
      "--random-source=FILE",
      "overwrite repeatedly",
      "--zero", "--remove",
      "secure deletion"
    ],
    military: [
      "shred --iterations=7",
      "--random-source=/dev/urandom",
      "overwrite repeatedly",
      "--zero", "--remove",
      "military-grade sanitization"
    ]
  },
  ubuntu: {
    quick: [
      "dd if=/dev/zero", "bytes copied",
      "records in", "records out",
      "write complete", "operation successful"
    ],
    deep: [
      "secure-delete complete",
      "3-pass overwrite finished",
      "srm: file overwritten",
      "verification successful",
      "all blocks written"
    ],
    military: [
      "dod-wipe complete",
      "7-pass DoD compliant",
      "srm -D", "wipe verified",
      "military standard achieved"
    ]
  },
  android: {
    quick: [
      "block wipe complete",
      "partition wiped",
      "factory reset verified",
      "data deletion successful"
    ],
    deep: [
      "secure wipe complete",
      "multi-pass erase done",
      "verification successful",
      "all blocks overwritten"
    ],
    military: [
      "DoD wipe complete",
      "military grade format done",
      "7-pass verification complete",
      "secure deletion verified"
    ]
  }
};

// USB/HDD/SSD external wipe keywords
const EXTERNAL_DEVICE_KEYWORDS = ["100% completed", "operation successful"];

// Real OCR function using Tesseract.js
const performOCR = async (imageFile) => {
  try {
    // Create image URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Initialize Tesseract worker
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Set OCR parameters for better terminal text recognition
    await worker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-%:/_[](){}\\|<> ',
      preserve_interword_spaces: '1',
    });

    // Perform OCR
    const { data: { text } } = await worker.recognize(imageUrl);
    
    // Terminate worker
    await worker.terminate();
    
    // Release the URL object
    URL.revokeObjectURL(imageUrl);
    
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to process image. Please try a clearer screenshot.');
  }
};

export default function ScreenshotVerifier({ imageFile, deviceType, os, wipeMethod, onVerificationComplete }) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [matchedKeywords, setMatchedKeywords] = useState([]);

  const verifyScreenshot = async () => {
    if (!imageFile) return;

    setVerifying(true);
    setVerificationResult(null);
    setExtractedText("");
    setMatchedKeywords([]);

    try {
      // Perform OCR on the uploaded screenshot
      const ocrText = await performOCR(imageFile);
      setExtractedText(ocrText);

      // Get validation keywords for the specific OS and wipe method
      let keywords = [];
      
      // Check if it's an external device (USB/HDD/SSD)
      if (deviceType === 'usb' || deviceType === 'hdd' || deviceType === 'ssd') {
        keywords = EXTERNAL_DEVICE_KEYWORDS;
      } else {
        keywords = VALIDATION_KEYWORDS[os]?.[wipeMethod] || [];
      }
      
      // Advanced validation logic
      const processedText = ocrText.toLowerCase();
      
      // Check for error indicators first
      const errorPatterns = [
        'error', 'failed', 'denied', 'permission', 
        'invalid', 'cannot', 'not permitted', 'aborted'
      ];
      
      const hasErrors = errorPatterns.some(pattern => 
        processedText.includes(pattern.toLowerCase())
      );

      if (hasErrors) {
        const result = {
          success: false,
          confidence: 90,
          message: "Error detected in output. The wipe operation may have failed.",
          extractedText: ocrText,
          matchedKeywords: [],
          expectedKeywords: keywords
        };
        setVerificationResult(result);
        onVerificationComplete(result);
        return;
      }

      // Check for keyword matches (case insensitive)
      const foundKeywords = keywords.filter(keyword => 
        processedText.includes(keyword.toLowerCase())
      );
      
      setMatchedKeywords(foundKeywords);

      // Advanced validation logic:
      // 1. Need at least 2 keywords for strong validation
      // 2. Check for percentage completion indicators
      // 3. Look for specific patterns based on OS/method
      
      const percentageMatch = processedText.match(/(\d+)%\s*(complete|finished|done)/i);
      const hasPercentage = percentageMatch && parseInt(percentageMatch[1]) === 100;
      
      const hasOSSpecificIndicator = processedText.includes(os.toLowerCase()) || 
                                   (os === 'windows' && processedText.includes('cipher')) ||
                                   (os === 'linux' && (processedText.includes('dd') || processedText.includes('shred'))) ||
                                   (os === 'ubuntu' && (processedText.includes('dd') || processedText.includes('srm'))) ||
                                   (os === 'android' && processedText.includes('partition'));
      
      const hasMethodSpecificIndicator = (wipeMethod === 'military' && (
                                         processedText.includes('dod') || 
                                         processedText.includes('7-pass') ||
                                         processedText.includes('military'))) ||
                                       (wipeMethod === 'deep' && (
                                         processedText.includes('3-pass') ||
                                         processedText.includes('multi') ||
                                         processedText.includes('verification')));
      
      // Calculate confidence score (0-100)
      let confidence = 0;
      confidence += foundKeywords.length * 20; // 20 points per keyword
      confidence += hasPercentage ? 30 : 0;
      confidence += hasOSSpecificIndicator ? 20 : 0;
      confidence += hasMethodSpecificIndicator ? 20 : 0;
      confidence = Math.min(confidence, 100); // Cap at 100
      
      // Determine validity
      // Need either:
      // 1. At least 2 keywords + OS indicator
      // 2. 100% completion + 1 keyword
      // 3. Method-specific indicator + 1 keyword
      const isValid = (foundKeywords.length >= 2 && hasOSSpecificIndicator) ||
                     (hasPercentage && foundKeywords.length >= 1) ||
                     (hasMethodSpecificIndicator && foundKeywords.length >= 1);
      
      const result = {
        success: isValid,
        confidence,
        message: isValid 
          ? `Screenshot verified successfully! Detected ${foundKeywords.length} completion indicators with ${confidence}% confidence.`
          : `Screenshot verification failed. Please ensure the screenshot shows complete wipe output.`,
        extractedText: ocrText,
        matchedKeywords: foundKeywords,
        expectedKeywords: keywords,
        verificationDetails: {
          hasPercentage,
          hasOSSpecificIndicator,
          hasMethodSpecificIndicator
        }
      };

      setVerificationResult(result);
      onVerificationComplete(result);

    } catch (error) {
      const result = {
        success: false,
        confidence: 0,
        message: "Screenshot invalid. Wiping not complete.",
        extractedText: "",
        matchedKeywords: [],
        expectedKeywords: []
      };
      
      setVerificationResult(result);
      onVerificationComplete(result);
    }

    setVerifying(false);
  };

  const retry = () => {
    setVerificationResult(null);
    setExtractedText("");
    setMatchedKeywords([]);
    verifyScreenshot();
  };

  // Get expected keywords for display
  const getExpectedKeywords = () => {
    if (deviceType === 'usb' || deviceType === 'hdd' || deviceType === 'ssd') {
      return EXTERNAL_DEVICE_KEYWORDS;
    }
    return VALIDATION_KEYWORDS[os]?.[wipeMethod] || [];
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">AI Screenshot Verification</h3>
        <p className="text-blue-700 text-sm mb-3">
          Our OCR system will analyze your screenshot to detect completion messages for:
        </p>
        <div className="flex gap-2 text-sm mb-3">
          <span className="bg-blue-100 px-2 py-1 rounded capitalize">{os}</span>
          <span className="bg-blue-100 px-2 py-1 rounded capitalize">{deviceType}</span>
          <span className="bg-blue-100 px-2 py-1 rounded capitalize">{wipeMethod} wipe</span>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-3 mt-3">
          <p className="text-blue-800 font-medium text-sm mb-2">Required completion indicators:</p>
          <div className="flex flex-wrap gap-2">
            {getExpectedKeywords().map((keyword, index) => (
              <span key={index} className="bg-white text-blue-700 px-2 py-1 rounded text-xs font-medium">
                "{keyword}"
              </span>
            ))}
          </div>
        </div>
      </div>

      {!verifying && !verificationResult && (
        <Button 
          onClick={verifyScreenshot}
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4"
        >
          <Eye className="w-5 h-5 mr-2" />
          Start OCR Verification
        </Button>
      )}

      {verifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <p className="text-blue-600 font-semibold text-lg">Running OCR Text Extraction...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing screenshot for completion indicators</p>
          <div className="mt-4 bg-gray-100 rounded-lg p-3 max-w-md mx-auto">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">✓ Image uploaded</span>
              <span className="text-blue-600">⏳ OCR processing</span>
              <span className="text-gray-400">⏳ Validation</span>
            </div>
          </div>
        </motion.div>
      )}

      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Alert 
            variant={verificationResult.success ? "default" : "destructive"}
            className={verificationResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
          >
            <div className="flex items-start gap-3">
              {verificationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <AlertDescription className={verificationResult.success ? "text-green-700" : "text-red-700"}>
                  <strong className="text-lg">
                    {verificationResult.success ? "✅ Verification Successful" : "❌ Screenshot Invalid"}
                  </strong>
                  <br />
                  <span className="text-base">{verificationResult.message}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-5 border">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">OCR Analysis Results</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Validation Status: </span>
                  <span className={`font-bold text-lg ${
                    verificationResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult.success ? 'VALID' : 'INVALID'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Keywords Found: </span>
                  <div className="mt-1">
                    {matchedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {matchedKeywords.map((keyword, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            "{keyword}"
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-red-600 text-sm">No completion indicators detected</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Required Keywords: </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {getExpectedKeywords().map((keyword, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${
                      matchedKeywords.includes(keyword) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      "{keyword}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <details className="mt-4">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                📄 View Extracted Text ({extractedText.length} characters)
              </summary>
              <div className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {extractedText || "No text could be extracted from the image"}
                </pre>
              </div>
            </details>
          </div>

          {!verificationResult.success && (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Screenshot invalid. Wiping not complete.</strong>
                  <br />
                  <span className="text-sm mt-2 block">
                    Please ensure your screenshot shows the complete command output with one of the required completion indicators listed above.
                  </span>
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={retry}
                variant="outline"
                className="w-full py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Upload Different Screenshot
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}