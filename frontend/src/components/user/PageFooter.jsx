import React from "react";

const PageFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 mt-6">
      <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-500">
        &copy; {new Date().getFullYear()} All rights reserved | Developed by
        atsari
      </div>
    </footer>
  );
};

export default PageFooter;
