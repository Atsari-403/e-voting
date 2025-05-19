import React from "react";

const PhotoUpload = ({ designType, formData, previewUrls, onChange }) => {
  if (designType === "combined") {
    return (
      <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
          Unggah Foto
        </h3>
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Foto Pamflet
          </label>
          <div className="flex flex-col items-center">
            <input
              type="file"
              name="fotoPamflet"
              accept="image/*"
              onChange={onChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
            {previewUrls.fotoPamflet && (
              <div className="mt-4 w-full max-w-md">
                <img
                  src={previewUrls.fotoPamflet}
                  alt="Preview Foto Pamflet"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 bg-white">
      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
        Unggah Foto
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Foto Ketua
          </label>
          <div className="flex flex-col items-center">
            <input
              type="file"
              name="fotoKetua"
              accept="image/*"
              onChange={onChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
            {previewUrls.fotoKetua && (
              <div className="mt-4 w-full max-w-md">
                <img
                  src={previewUrls.fotoKetua}
                  alt="Preview Foto Ketua"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Foto Wakil
          </label>
          <div className="flex flex-col items-center">
            <input
              type="file"
              name="fotoWakil"
              accept="image/*"
              onChange={onChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            />
            {previewUrls.fotoWakil && (
              <div className="mt-4 w-full max-w-md">
                <img
                  src={previewUrls.fotoWakil}
                  alt="Preview Foto Wakil"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
