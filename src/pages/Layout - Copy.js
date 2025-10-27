import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  LayoutDashboard,
  Leaf,
  Settings,
  User as UserIcon, // Renamed to avoid conflict with User entity
  Award,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "@/entities/User"; // Import the User entity

const baseNavigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Shield,
  },
  {
    title: "My Dashboard", // Changed from "Dashboard" to "My Dashboard"
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
];

const adminNavigationItem = {
  title: "Admin Panel",
  url: createPageUrl("Admin"),
  icon: Settings,
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [navigationItems, setNavigationItems] = useState(baseNavigationItems);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user && user.role === 'admin') {
          setNavigationItems([...baseNavigationItems, adminNavigationItem]);
        } else {
          setNavigationItems(baseNavigationItems);
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
        setCurrentUser(null);
        setNavigationItems(baseNavigationItems);
      }
    };
    fetchUser();
  }, [location.pathname]); // Refetch on path change to update stats/links

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20">
        <Sidebar className="border-r border-green-100/50 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Leaf className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                  EcoWipe
                </h2>
                <p className="text-xs text-gray-500 font-medium">Secure • Sustainable • Certified</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-green-50 hover:text-green-700 transition-all duration-300 rounded-xl mb-1 group ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm'
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                            location.pathname === item.url ? 'text-green-600' : ''
                          }`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {currentUser && ( // Conditionally render Eco Impact section
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Eco Impact
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Eco Points</p>
                        <p className="text-xs text-gray-500">{currentUser.total_eco_points || 0} earned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Devices</p>
                        <p className="text-xs text-gray-500">{currentUser.total_devices_wiped || 0} wiped</p>
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {currentUser ? currentUser.full_name : "Guest"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser ? (currentUser.role === 'admin' ? 'Administrator' : 'Trusted Data Wiper') : "Please log in"}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-xl border-b border-green-100/50 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-100/50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                EcoWipe
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}