import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Smartphone, 
  Laptop, 
  HardDrive, 
  Usb,
  Monitor,
  ArrowRight
} from "lucide-react";

const devices = [
  {
    type: "mobile",
    icon: Smartphone,
    title: "Mobile Device",
    description: "Smartphones, tablets, and mobile devices",
    os: ["android"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    type: "laptop",
    icon: Laptop,
    title: "Laptop/PC",
    description: "Desktop computers and laptops",
    os: ["windows", "linux", "ubuntu"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    type: "hdd",
    icon: HardDrive,
    title: "Hard Disk Drive",
    description: "Traditional spinning hard drives",
    os: ["windows", "linux", "ubuntu"],
    color: "from-orange-500 to-red-500"
  },
  {
    type: "ssd",
    icon: Monitor,
    title: "Solid State Drive",
    description: "Modern SSD storage devices",
    os: ["windows", "linux", "ubuntu"],
    color: "from-green-500 to-emerald-500"
  },
  {
    type: "usb",
    icon: Usb,
    title: "USB Storage",
    description: "Flash drives and external storage",
    os: ["windows", "linux", "ubuntu"],
    color: "from-pink-500 to-rose-500"
  }
];

export default function DeviceSelector({ onSelect }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedOS, setSelectedOS] = useState(null);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setSelectedOS(null);
  };

  const handleOSSelect = (os) => {
    setSelectedOS(os);
  };

  const handleNext = () => {
    if (selectedDevice && selectedOS) {
      onSelect(selectedDevice.type, selectedOS);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Device Type
        </h2>
        <p className="text-gray-600 text-lg">
          Choose the type of device you want to securely wipe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device, index) => (
          <motion.div
            key={device.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                selectedDevice?.type === device.type 
                  ? 'ring-2 ring-green-500 shadow-lg' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleDeviceSelect(device)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${device.color} flex items-center justify-center shadow-lg`}>
                  <device.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {device.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {device.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {device.os.map((os) => (
                    <span 
                      key={os}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {os.charAt(0).toUpperCase() + os.slice(1)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-2xl p-6 border border-green-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Operating System for {selectedDevice.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedDevice.os.map((os) => (
              <Button
                key={os}
                variant={selectedOS === os ? "default" : "outline"}
                className={`${
                  selectedOS === os 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'hover:bg-green-50'
                } transition-all duration-200`}
                onClick={() => handleOSSelect(os)}
              >
                {os.charAt(0).toUpperCase() + os.slice(1)}
              </Button>
            ))}
          </div>
          
          {selectedOS && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to Wipe Method
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}