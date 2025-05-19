import React from "react";

const ErrorState = ({ message }) => {
  return (
    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
      <p className="font-medium">Terjadi Kesalahan</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorState;
