import React from 'react';
import logo from '../../assets/Logo.png';
import { Clock, LogOut } from 'lucide-react';

const Header = ({ userData, formattedTime, timeExpired, hasVoted, onLogout }) => {
  return (
    <header className="bg-white text-gray-800 shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="E-Voting Logo" className="h-8 sm:h-10" />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              E-Voting
            </h1>
            {userData && (
              <span className="text-xs text-gray-500">
                Hai, {userData.name || userData.nim}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
          <div
            className={`${
              timeExpired
                ? 'bg-red-600'
                : hasVoted
                ? 'bg-green-600'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            } py-1 sm:py-2 px-3 sm:px-4 rounded-lg text-white shadow-md flex items-center`}
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="font-mono text-xs sm:text-sm font-medium">
              {timeExpired
                ? '00:00'
                : hasVoted
                ? 'Voted'
                : formattedTime}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1 sm:space-x-2 bg-red-500 hover:bg-red-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-lg shadow-md transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
