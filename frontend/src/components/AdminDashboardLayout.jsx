import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart,
  // Settings,
} from "lucide-react";
import Logo from "../assets/Logo.png";

// Sidebar Item Component
const SidebarItem = ({ icon, text, active, collapsed, onClick }) => {
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 group relative
        ${
          active
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
            : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center w-full">
        <span
          className={`text-lg ${
            active ? "text-white" : "group-hover:text-blue-600"
          }`}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="ml-3 transition-all duration-200 font-medium">
            {text}
          </span>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {text}
        </div>
      )}
    </li>
  );
};

// Username Display Component
const UsernameDisplay = ({ user }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
        {user?.name?.charAt(0).toUpperCase() || "A"}
      </div>
      <div className="hidden md:block">
        <span className="text-sm font-medium text-gray-700">
          {user?.name || "Admin"}
        </span>
        <p className="text-xs text-gray-500">Administrator</p>
      </div>
    </div>
  );
};

// Main Admin Dashboard Layout Component
const AdminDashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useUser(); // Get user from context

  // Menu items configuration
  const menuItems = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      id: "mahasiswa",
      text: "Manajemen Mahasiswa",
      icon: <Users size={20} />,
      path: "/manajemen/mahasiswa",
    },
    {
      id: "kandidat",
      text: "Manajemen Kandidat",
      icon: <UserCheck size={20} />,
      path: "/manajemen/kandidat",
    },
    {
      id: "hasil",
      text: "Hasil Voting",
      icon: <BarChart size={20} />,
      path: "/hasil/voting",
    },
  ];

  // Effect untuk mendeteksi perubahan rute dan mengupdate activeMenu
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find((item) => currentPath === item.path);
    if (matchedItem) {
      setActiveMenu(matchedItem.id);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Clear user data from context
        updateUser(null);

        // Redirect to login
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar untuk desktop */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 hidden md:block border-r border-gray-100
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo dan Toggle Button */}
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 ${
              collapsed ? "px-3" : "px-6"
            }`}
          >
            {!collapsed ? (
              <div className="flex items-center">
                <img
                  src={Logo}
                  alt="E-Voting Logo"
                  className="h-10 w-10 "
                />
                <h2 className="ml-7 text-xl font-bold text-black">
                  E-Voting
                </h2>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <img
                  src={Logo}
                  alt="E-Voting Logo"
                  className="h-8 w-8 rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Collapse/Expand Button */}
            {/* <button
              className={`p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 shadow-sm ${
                collapsed ? "w-8 h-8 flex items-center justify-center" : ""
              }`}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button> */}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  active={activeMenu === item.id}
                  collapsed={collapsed}
                  onClick={() => handleMenuClick(item)}
                />
              ))}
            </ul>
          </nav>

          {/* Logout button at bottom of sidebar */}
          <div className="p-3 border-t border-gray-100">
            <div
              className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-red-200 hover:bg-red-500 text-red-600 hover:text-white group shadow-sm"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3 font-medium">Logout</span>}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out md:hidden border-r border-gray-100
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "280px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="E-Voting Logo"
                className="h-10 w-10 rounded-lg shadow-sm"
              />
              <h2 className="ml-8 text-xl font-bold text-black">E-Voting</h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  active={activeMenu === item.id}
                  collapsed={false}
                  onClick={() => handleMenuClick(item)}
                />
              ))}
            </ul>
          </nav>

          {/* Logout button for mobile sidebar */}
          <div className="p-4 border-t border-gray-100">
            <div
              className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-red-200 hover:bg-red-500 text-red-600 hover:text-white shadow-sm"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="ml-3 font-medium">Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-md z-10 border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Page title dinamis activeMenu */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 md:ml-0">
                {menuItems.find((item) => item.id === activeMenu)?.text ||
                  "Dashboard"}
              </h1>
            </div>

            {/* Username display */}
            <div className="flex items-center space-x-4">
              <UsernameDisplay user={user} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
