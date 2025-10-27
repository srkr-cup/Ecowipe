import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Leaf, Recycle, Award } from "lucide-react";

const ecoTips = {
  mobile: [
    "Mobile phones contain rare earth metals. Proper wiping enables safe recycling of these valuable materials.",
    "A single smartphone contains gold, silver, and platinum worth approximately $1-2 when recycled properly.",
    "Wiping mobile devices prevents identity theft and allows 80% of materials to be recovered for new devices."
  ],
  laptop: [
    "Laptops contain lithium batteries that can be safely recycled after proper data wiping.",
    "One recycled laptop can provide enough materials for manufacturing smaller electronic components.",
    "Secure wiping of laptops prevents corporate data breaches and enables complete material recovery."
  ],
  hdd: [
    "Hard drives contain rare neodymium magnets that are essential for wind turbine generators.",
    "Recycling HDDs reduces mining needs for rare earth elements by up to 30%.",
    "One wiped HDD provides materials equivalent to preventing 2.5kg of CO₂ emissions."
  ],
  ssd: [
    "SSDs contain valuable semiconductors that can be reprocessed into new memory chips.",
    "Proper SSD recycling recovers precious metals worth 15x more than landfill disposal.",
    "Wiped SSDs contribute to the circular economy by providing raw materials for new technology."
  ],
  usb: [
    "USB drives contain precious metals that, when recycled, reduce mining environmental impact.",
    "Small electronics like USBs are often discarded improperly - secure wiping enables responsible disposal.",
    "One recycled USB drive prevents approximately 0.5kg of electronic waste from reaching landfills."
  ]
};

export default function EcoTip({ deviceType }) {
  const [tip, setTip] = React.useState('');

  React.useEffect(() => {
    if (!deviceType) return;
    const tips = ecoTips[deviceType] || ecoTips.mobile;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, [deviceType]);

  return (
    <div className="w-full">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-green-800">
                  🌱 Eco Impact Tip
                </h3>
                <div className="flex gap-1">
                  <Recycle className="w-4 h-4 text-green-600" />
                  <Award className="w-4 h-4 text-green-600" />
                </div>
              </div>
              
              <p className="text-green-700 leading-relaxed text-base">
                {tip}
              </p>
              
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="bg-white/70 px-3 py-2 rounded-full border border-green-200">
                  <span className="text-green-600 font-semibold">Device: </span>
                  <span className="text-green-700 capitalize font-medium">{deviceType}</span>
                </div>
                <div className="bg-white/70 px-3 py-2 rounded-full border border-green-200">
                  <span className="text-green-600 font-semibold">Impact: </span>
                  <span className="text-green-700 font-medium">High ♻️</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}