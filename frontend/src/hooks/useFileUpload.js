import { useRef, useEffect } from "react";

export const useFileUpload = (onFileUpload) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const result = await onFileUpload(file);

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    return result;
  };

  // Setup ref untuk file upload dengan handler
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.onFileChange = handleFileUpload;
    }
  }, []);

  return {
    fileInputRef,
    handleFileUpload,
  };
};
