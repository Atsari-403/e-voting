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
      className={`flex items-center p-2 my-1 rounded-md cursor-pointer transition-all mb-2
        ${
          active
            ? "bg-blue-500 text-white"
            : "hover:bg-blue-100 text-gray-700 hover:text-blue-500"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className={`text-lg ${active ? "text-white" : ""}`}>{icon}</span>
        {!collapsed && <span className="ml-3 transition-all">{text}</span>}
      </div>
    </li>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {user?.name?.charAt(0) || "A"}
        </div>
        <span className="hidden md:block text-sm">{user?.name || "Admin"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "Admin"}
            </p>
          </div>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50"
            onClick={onLogout}
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      )}
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
      // Clear user data from context
      updateUser(null);

      // Clear localStorage and cookies
      localStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to login
      navigate("/login");
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
        className={`bg-white shadow-md transition-all duration-300 hidden md:block
          ${collapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo dan Toggle Button */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed ? (
              <div className="flex items-center">
                <img
                  src={Logo}
                  alt="E-Voting Logo"
                  className="h-10 transition-all"
                />
                <h2 className="ml-5 text-lg font-bold text-blue-600">
                  E-Voting
                </h2>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                {/* Placeholder saat collapsed */}
              </div>
            )}

            {/* Collapse/Expand Button */}
            <button
              className={`p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 ${
                collapsed ? "w-full flex justify-center" : ""
              }`}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul>
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
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "250px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <img src={Logo} alt="E-Voting Logo" className="h-10" />
              <h2 className="ml-2 text-lg font-bold text-blue-600">
                E-Voting
              </h2>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul>
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
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar - disesuaikan tinggi dan paddingnya agar sejajar dengan sidebar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Page title dinamis berdasarkan activeMenu */}
            <h1 className="text-lg font-semibold text-gray-800 md:ml-0">
              {menuItems.find((item) => item.id === activeMenu)?.text ||
                "Dashboard"}
            </h1>

            {/* User Profile */}
            <ProfileDropdown user={user} onLogout={handleLogout} />
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
