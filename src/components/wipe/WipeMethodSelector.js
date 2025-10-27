import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Zap, 
  Shield, 
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

const wipeMethods = [
  {
    type: "quick",
    icon: Zap,
    title: "Quick Wipe",
    description: "Fast single-pass overwrite for basic security",
    duration: "5-15 minutes",
    security: "Basic",
    color: "from-blue-500 to-cyan-500",
    passes: "1 pass",
    recommended: "Personal files, non-sensitive data"
  },
  {
    type: "deep",
    icon: Shield,
    title: "Deep Wipe",
    description: "Multi-pass overwrite for enhanced security",
    duration: "30-60 minutes",
    security: "High",
    color: "from-purple-500 to-indigo-500",
    passes: "3 passes",
    recommended: "Business data, confidential files"
  },
  {
    type: "military",
    icon: ShieldCheck,
    title: "Military Grade",
    description: "DoD 5220.22-M standard wiping protocol",
    duration: "2-4 hours",
    security: "Maximum",
    color: "from-red-500 to-orange-500",
    passes: "7+ passes",
    recommended: "Classified data, maximum security needed"
  }
];

export default function WipeMethodSelector({ deviceType, onSelect }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleNext = () => {
    if (selectedMethod) {
      onSelect(selectedMethod.type);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Wipe Method
        </h2>
        <p className="text-gray-600 text-lg">
          Select the security level that matches your needs
        </p>
      </div>

      <div className="grid gap-6">
        {wipeMethods.map((method, index) => (
          <motion.div
            key={method.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedMethod?.type === method.type 
                  ? 'ring-2 ring-green-500 shadow-lg' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleMethodSelect(method)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {method.title}
                      </h3>
                      <Badge 
                        variant="secondary"
                        className={`${
                          method.security === 'Basic' 
                            ? 'bg-blue-100 text-blue-800' 
                            : method.security === 'High'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {method.security} Security
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {method.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{method.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{method.passes}</span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">
                          <strong>Recommended for:</strong> {method.recommended}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedMethod.title} Selected
          </h3>
          <p className="text-gray-600 mb-4">
            This will perform a {selectedMethod.security.toLowerCase()} security wipe 
            taking approximately {selectedMethod.duration}
          </p>
          <Button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Generate Wipe Command
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}