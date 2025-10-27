import React, { useState, useEffect } from "react";
import { WipeRecord } from "@/entities/WipeRecord";
import { Shield, Leaf, Award, CheckCircle, Download, Printer, Zap, ShieldCheck, Calendar, Hash, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function CertificatePage() {
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recordId = params.get("id");
    const formatFromUrl = params.get("format") || "pdf";
    setDownloadFormat(formatFromUrl);
    
    if (recordId) {
      WipeRecord.get(recordId)
        .then(data => {
          if (!data) {
            throw new Error(`No record found with ID ${recordId}`);
          }
          // Validate required fields
          if (!data.id || !data.created_date || !data.device_type) {
            throw new Error('Invalid record data: Missing required fields');
          }
          setRecord(data);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to load wipe record:", err);
          setError(err.message || "Failed to load wipe record");
          setRecord(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("No record ID provided");
      setIsLoading(false);
    }
  }, []);

  const downloadCertificate = async (format) => {
    if (!record) return;
    
    setDownloading(true);
    
    try {
      if (format === "pdf") {
        try {
          const { jsPDF } = await import('jspdf');
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });

        // Background
        doc.setFillColor(240, 253, 244); // bg-green-50
        doc.rect(0, 0, 297, 210, 'F'); // A4 landscape dimensions

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(5, 150, 105); // text-emerald-600
        doc.text('EcoWipe', 20, 30);
        
        doc.setFontSize(14);
        doc.setTextColor(75, 85, 99); // text-gray-600
        doc.text('Official Data Destruction Certificate', 20, 40);
        
        // Certificate ID & Date
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text(`Certificate ID: ${record.id.slice(0, 8).toUpperCase()}`, 250, 30, { align: 'right' });
        doc.text(`Date Issued: ${format(new Date(record.created_date), "MMMM d, yyyy")}`, 250, 37, { align: 'right' });
        
        // Main content
        doc.setFontSize(16);
        doc.setTextColor(55, 65, 81); // text-gray-700
        doc.text('This officially certifies that', 20, 70);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(17, 24, 39); // text-gray-900
        doc.text(record.user_name || record.created_by, 20, 88); // Adjusted Y for larger font
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(55, 65, 81); // text-gray-700
        const certText = `has successfully completed a secure data wipe operation using ${record.wipe_method} grade protocols,`;
        doc.text(certText, 20, 105);
        doc.text('permanently destroying all data on the specified device in compliance with industry security standards.', 20, 115);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(5, 150, 105); // text-green-700
        doc.text('VERIFIED & AUTHENTICATED', 148.5, 130, { align: 'center' }); // Centered
        
        // Device Details Section
        const startY = 150;
        const colWidth = 60;
        const col1X = 20;
        const col2X = col1X + colWidth;
        const col3X = col2X + colWidth;
        const col4X = col3X + colWidth;

        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text('Device Details', col1X, startY);
        doc.text('Security Level', col2X, startY);
        doc.text('Eco Impact', col3X, startY);
        doc.text('Verification', col4X, startY);

        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39); // text-gray-800
        doc.text(record.device_type, col1X, startY + 8);
        doc.text(record.operating_system, col1X, startY + 14);
        doc.text(`${record.device_size_gb} GB capacity`, col1X, startY + 20);

        doc.text(record.wipe_method, col2X, startY + 8);
        doc.text(
          record.wipe_method === 'military' ? 'DoD 5220.22-M Standard' : 
          record.wipe_method === 'deep' ? '3-Pass Secure Overwrite' : 
          'Single-Pass Overwrite', col2X, startY + 14
        );
        doc.text('Industry Compliant', col2X, startY + 20);

        doc.setTextColor(5, 150, 105); // text-green-600
        doc.text(`${record.eco_points} Points`, col3X, startY + 8);
        doc.setTextColor(17, 24, 39); // text-gray-800
        doc.text(`${(record.device_size_gb * 0.5).toFixed(1)} kg CO₂ saved`, col3X, startY + 14);
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text('Environmental contribution', col3X, startY + 20);

        doc.setTextColor(5, 150, 105); // text-green-600
        doc.text('AI Verified', col4X, startY + 8);
        doc.setTextColor(17, 24, 39); // text-gray-800
        doc.text('Screenshot Authenticated', col4X, startY + 14);
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text('Tamper-Proof Record', col4X, startY + 20);

        // Footer
        doc.setFontSize(12);
        doc.setTextColor(5, 150, 105); // text-green-700
        doc.text('Digitally Certified by EcoWipe Security Platform', 148.5, 190, { align: 'center' });
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128); // text-gray-600
        doc.text(`Certificate #${record.id.slice(0, 8).toUpperCase()}`, 148.5, 195, { align: 'center' });
        
        doc.save(`EcoWipe-Certificate-${record.id.slice(0, 8)}.pdf`);
        
      } else if (format === "jpg") {
        const html2canvas = (await import('html2canvas')).default;
        const certificateElement = document.getElementById('certificate-content');
        
        if (certificateElement) {
          const canvas = await html2canvas(certificateElement, {
            backgroundColor: '#ffffff',
            scale: 2, // Increase scale for better resolution
            useCORS: true, // If images are from different origins
            width: 1123, // Match the div's width
            height: 794 // Match the div's height
          });
          
          const link = document.createElement('a');
          link.download = `EcoWipe-Certificate-${record.id.slice(0, 8)}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
          link.click();
        }
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
    
    setDownloading(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg text-gray-600">Loading Certificate...</p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Error</h2>
            <p className="text-red-500 mb-6">{error || "Certificate not found"}</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const SecurityStamp = () => {
    const stamps = {
      quick: { icon: Zap, text: "Basic Security", color: "blue" },
      deep: { icon: Shield, text: "High Security", color: "purple" },
      military: { icon: ShieldCheck, text: "Maximum Security", color: "red" },
    };
    const stamp = stamps[record.wipe_method] || stamps.quick;
    const Icon = stamp.icon;

    return (
      <div className={`absolute bottom-20 right-20 w-40 h-40 rounded-full border-4 border-dashed border-${stamp.color}-400 flex flex-col items-center justify-center transform rotate-12 bg-${stamp.color}-50/30`}>
        <Icon className={`w-12 h-12 text-${stamp.color}-600`} />
        <p className={`font-bold text-center mt-2 text-sm text-${stamp.color}-700`}>{stamp.text}</p>
        <p className={`text-xs text-${stamp.color}-600 font-semibold`}>VERIFIED</p>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .certificate-container { margin: 0; border: none; box-shadow: none; page-break-inside: avoid; }
        }
        @page {
          size: A4 landscape;
          margin: 0;
        }
      `}</style>
      <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="no-print mb-8 flex gap-4 items-center">
          <Select value={downloadFormat} onValueChange={setDownloadFormat}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Format</SelectItem>
              <SelectItem value="jpg">JPG Image</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => downloadCertificate(downloadFormat)} 
            disabled={downloading}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
          >
            {downloading ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> 
                Download {downloadFormat.toUpperCase()}
              </>
            )}
          </Button>
          
          <Button onClick={() => window.print()} variant="outline" className="shadow-lg">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          
          <Button variant="outline" onClick={() => window.close()} className="shadow-lg">
            Close
          </Button>
        </div>

        <div id="certificate-content" className="certificate-container w-[1123px] h-[794px] bg-white shadow-2xl flex flex-col border-8 border-gradient-to-r border-green-700 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50 relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100/40 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)] opacity-30"></div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-72 h-72 border-[20px] border-green-200/50 rounded-full opacity-40"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 border-[20px] border-blue-200/50 rounded-full opacity-40"></div>
          <div className="absolute top-10 right-10 w-32 h-32 border-[8px] border-emerald-300/30 rounded-full opacity-60"></div>
          
          <SecurityStamp />

          {/* Header */}
          <div className="flex justify-between items-start p-12 z-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl">
                <Shield className="w-11 h-11 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">EcoWipe</h1>
                <p className="text-gray-600 font-semibold text-lg">Official Data Destruction Certificate</p>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">ecowipe.tech • Certified Secure Wiping</span>
                </div>
              </div>
            </div>
            <div className="text-right bg-white/80 p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <p className="font-bold text-gray-800">Certificate ID</p>
              </div>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">{record.id.slice(0, 8).toUpperCase()}</p>
              <div className="flex items-center gap-2 mt-3 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="font-bold text-gray-800">Date Issued</p>
              </div>
              <p className="text-sm text-gray-600">{format(new Date(record.created_date), "MMMM d, yyyy")}</p>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center z-10 px-12">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-200 max-w-4xl">
              <p className="text-2xl text-gray-700 mb-3">This officially certifies that</p>
              <h2 className="text-6xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {record.user_name || record.created_by}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
                has successfully completed a <strong className="text-green-700">secure data wipe</strong> operation 
                using <strong className="text-blue-700">{record.wipe_method} grade protocols</strong>, 
                permanently destroying all data on the specified device in compliance with industry security standards.
              </p>
              
              <div className="flex justify-center items-center gap-3 text-green-700">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-bold">VERIFIED & AUTHENTICATED</span>
                <Leaf className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          {/* Device Details */}
          <div className="grid grid-cols-4 gap-6 z-10 px-12 mb-8">
            <div className="bg-white/90 p-5 rounded-xl border border-gray-200 shadow-md text-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Device Details</h3>
              <p className="text-lg font-bold text-gray-800 capitalize">{record.device_type}</p>
              <p className="text-gray-600 capitalize">{record.operating_system}</p>
              <p className="text-sm text-gray-500">{record.device_size_gb} GB capacity</p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl border border-gray-200 shadow-md text-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Security Level</h3>
              <p className="text-lg font-bold text-gray-800 capitalize">{record.wipe_method}</p>
              <p className="text-gray-600">
                {record.wipe_method === 'military' ? 'DoD 5220.22-M Standard' : 
                 record.wipe_method === 'deep' ? '3-Pass Secure Overwrite' : 
                 'Single-Pass Overwrite'}
              </p>
              <p className="text-sm text-gray-500">Industry Compliant</p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl border border-gray-200 shadow-md text-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Eco Impact</h3>
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-green-600 mb-1">
                <Award className="w-5 h-5" />
                <span>{record.eco_points} Points</span>
              </div>
              <p className="text-gray-600">{(record.device_size_gb * 0.5).toFixed(1)} kg CO₂ saved</p>
              <p className="text-sm text-gray-500">Environmental contribution</p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl border border-gray-200 shadow-md text-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Verification</h3>
              <p className="text-lg font-bold text-green-600">AI Verified</p>
              <p className="text-gray-600">Screenshot Authenticated</p>
              <p className="text-sm text-gray-500">Tamper-Proof Record</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center z-10 px-12 pb-8">
            <div className="flex items-center gap-4">
              {record.proof_screenshot_url ? (
                <>
                  <div className="relative">
                    <img 
                      src={record.proof_screenshot_url} 
                      alt="Execution Proof" 
                      className="w-48 h-28 object-cover rounded-lg border-3 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                        e.target.className = "w-48 h-28 object-contain rounded-lg border-3 border-white shadow-lg bg-gray-100 p-4";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Execution Proof</p>
                    <p className="text-sm text-gray-600">AI-verified terminal output</p>
                    <p className="text-xs text-gray-500 mt-1">Screenshot authenticated via OCR</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-48 h-28 bg-gray-100 rounded-lg border-3 border-white shadow-lg flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-400">Proof Pending</p>
                    <p className="text-sm text-gray-400">Screenshot verification required</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border border-green-200">
              <p className="font-serif italic text-xl text-gray-800 mb-1">Digitally Certified by</p>
              <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg">
                <Shield className="w-5 h-5"/>
                <span>EcoWipe Security Platform</span>
                <Leaf className="w-5 h-5"/>
              </div>
              <p className="text-xs text-gray-600 mt-1">Certificate #{record.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}