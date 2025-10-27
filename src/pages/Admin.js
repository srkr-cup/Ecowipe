import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  AlertTriangle,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WipeRecord } from "@/entities/WipeRecord";
import { User } from "@/entities/User";
import { format } from "date-fns";

export default function AdminPage() {
  const [allWipeRecords, setAllWipeRecords] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [records, users, user] = await Promise.all([
        WipeRecord.list("-created_date"),
        User.list(),
        User.me()
      ]);

      setAllWipeRecords(records);
      setAllUsers(users);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setIsLoading(false);
  };

  const handleRoleChange = async (userToUpdate, newRole) => {
    alert("Updating user roles is a premium feature. Please upgrade your subscription to enable this functionality.");
  };

  const filteredRecords = allWipeRecords.filter(record => {
    const matchesSearch = record.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.device_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Users",
      value: allUsers.length,
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Total Wipes",
      value: allWipeRecords.length,
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Pending Review",
      value: allWipeRecords.filter(r => r.status === "pending_proof").length,
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Completed",
      value: allWipeRecords.filter(r => r.status === "completed").length,
      icon: FileText,
      color: "from-purple-500 to-indigo-500"
    }
  ];

  // Check if user is admin
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You need administrator privileges to access this page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor and manage all secure wipe activities across the platform
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
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* User Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={user.id === currentUser?.id}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role !== 'admin' && (
                            <DropdownMenuItem onClick={() => handleRoleChange(user, 'admin')} disabled>
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          {user.role === 'admin' && (
                            <DropdownMenuItem onClick={() => handleRoleChange(user, 'user')} disabled>
                              Make User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user email or device type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  All
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "pending_proof" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending_proof")}
                >
                  Pending
                </Button>
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wipe Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">All Wipe Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
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
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No records found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {record.created_by}
                          </h4>
                          <Badge className="bg-blue-100 text-blue-800">
                            {record.device_type}
                          </Badge>
                          <Badge variant="outline">
                            {record.operating_system}
                          </Badge>
                          <Badge className={
                            record.wipe_method === 'military' ? 'bg-red-100 text-red-800' :
                            record.wipe_method === 'deep' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {record.wipe_method} wipe
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(record.created_date), "MMM d, yyyy 'at' h:mm a")} •
                          {record.device_size_gb > 0 && ` ${record.device_size_gb} GB • `}
                          {record.eco_points} eco points
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={record.status === 'completed' ? 'default' : 'secondary'}
                          className={record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {record.status.replace('_', ' ')}
                        </Badge>

                        {record.proof_screenshot_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(record.proof_screenshot_url, '_blank')}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Proof
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}