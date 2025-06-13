import React from "react";
import logo from "../../assets/Logo.png";
import { Clock, LogOut } from "lucide-react";

const Header = ({
  userData,
  formattedTime,
  timeExpired,
  hasVoted,
  onLogout,
}) => {
  return (
    <header className="bg-white text-gray-800 shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <img
              src={logo}
              alt="E-Voting Logo"
              className="h-8 sm:h-9 lg:h-10 w-auto flex-shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                E-Voting
              </h1>
              {userData && (
                <span className="text-xs sm:text-sm lg:text-sm text-gray-500 truncate mt-0.5">
                  Hai, {userData.name} ({userData.nim})
                </span>
              )}
            </div>
          </div>

          {/* Right side - Timer and logout */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-4">
            {/* Timer */}
            <div
              className={`${
                timeExpired
                  ? "bg-red-600"
                  : hasVoted
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              } h-9 sm:h-10 lg:h-10 px-3 sm:px-4 rounded-lg text-white shadow-sm flex items-center min-w-fit`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="font-mono text-xs sm:text-sm lg:text-sm font-medium whitespace-nowrap leading-none">
                {timeExpired ? "00:00" : hasVoted ? "Voted" : formattedTime}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 active:bg-red-700 text-white h-9 sm:h-10 lg:h-10 px-3 sm:px-4 rounded-lg shadow-sm transition-all duration-200 text-xs sm:text-sm lg:text-sm flex-shrink-0 min-w-fit"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap ml-1.5 sm:ml-2 hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
