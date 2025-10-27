import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Shield, 
  Leaf, 
  Download,
  Calendar,
  HardDrive,
  TrendingUp,
  Lock,
  Recycle
} from "lucide-react";
import { WipeRecord } from "@/entities/WipeRecord";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


const BADGE_DEFINITIONS = {
  GREEN_SHIELD: { name: "Green Shield", description: "Completed your first secure wipe!", icon: Shield, color: "green" },
  DATA_GUARDIAN: { name: "Data Guardian", description: "Wiped 5 devices securely.", icon: Lock, color: "blue" },
  ECO_WARRIOR: { name: "Eco Warrior", description: "Wiped 10 devices, saving the planet!", icon: Leaf, color: "emerald" },
  RECYCLING_CHAMPION: { name: "Recycling Champion", description: "Wiped over 500GB of data.", icon: Recycle, color: "purple" },
};

const BadgeDisplay = ({ badgeKey }) => {
  const badge = BADGE_DEFINITIONS[badgeKey];
  if (!badge) return null;

  const Icon = badge.icon;
  // Tailwind dynamic classes need to be fully specified to be included in the bundle
  // For demonstration, we'll use predefined classes based on the color prop.
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
  };
  const colorClass = colorClasses[badge.color] || "bg-gray-100 text-gray-600";

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${colorClass} border-2 border-white shadow-md`}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">{badge.name}</h4>
            <p className="text-sm">{badge.description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function DashboardPage() {
  const [wipeRecords, setWipeRecords] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [records, userData] = await Promise.all([
        WipeRecord.list("-created_date"),
        User.me()
      ]);
      
      setWipeRecords(records);
      setUserStats(userData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getMethodColor = (method) => {
    return {
      quick: "bg-blue-100 text-blue-800",
      deep: "bg-purple-100 text-purple-800", 
      military: "bg-red-100 text-red-800"
    }[method] || "bg-gray-100 text-gray-800";
  };

  const getDeviceIcon = (deviceType) => {
    // You can expand this with more specific icons
    return HardDrive;
  };

  const stats = [
    {
      title: "Total Eco Points",
      value: userStats?.total_eco_points || 0,
      icon: Award,
      color: "from-green-500 to-emerald-500",
      change: "+12% this month"
    },
    {
      title: "Devices Wiped",
      value: userStats?.total_devices_wiped || 0,
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      change: "All secure"
    },
    {
      title: "Data Wiped",
      value: `${userStats?.total_data_wiped_gb || 0} GB`,
      icon: HardDrive,
      color: "from-purple-500 to-indigo-500",
      change: "Permanently deleted"
    },
    {
      title: "CO₂ Saved",
      value: `${((userStats?.total_data_wiped_gb || 0) * 0.5).toFixed(1)} kg`,
      icon: Leaf,
      color: "from-emerald-500 to-green-500",
      change: "Environmental impact"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your EcoWipe Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track your secure wiping activity and environmental impact
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">{stat.change}</span>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Badges Section */}
        {userStats?.eco_badges?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Eco-Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                {userStats.eco_badges.map(badgeKey => (
                  <BadgeDisplay key={badgeKey} badgeKey={badgeKey} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Wipe Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Recent Wipe Activity</CardTitle>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : wipeRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No wipe records yet
                  </h3>
                  <p className="text-gray-500">
                    Start your first secure wipe to see your activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wipeRecords.map((record, index) => {
                    const DeviceIcon = getDeviceIcon(record.device_type);
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <DeviceIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {record.device_type} Device
                            </h4>
                            <Badge className={getMethodColor(record.wipe_method)}>
                              {record.wipe_method} wipe
                            </Badge>
                            <Badge variant="outline">
                              {record.operating_system}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(record.created_date), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                            {record.device_size_gb > 0 && (
                              <span>{record.device_size_gb} GB wiped</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600 font-semibold mb-1">
                            <Award className="w-4 h-4" />
                            +{record.eco_points} points
                          </div>
                          <Badge 
                            variant={record.status === 'completed' ? 'default' : 'secondary'}
                            className={record.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}