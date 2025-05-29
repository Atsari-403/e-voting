import React from "react";
import { Upload, Image, X } from "lucide-react";

const PhotoUpload = ({ designType, formData, previewUrls, onChange }) => {
  const handleRemoveImage = (fieldName) => {
    // Create a fake event to reset the file input
    const fakeEvent = {
      target: {
        name: fieldName,
        files: null,
        value: "",
      },
    };
    onChange(fakeEvent);
  };

  const FileUploadField = ({ name, label, previewUrl, required = true }) => (
    <div className="space-y-3">
      <label className="block text-gray-700 text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            required={required}
          />
          <div
            className={`
            w-full px-4 py-3 border-2 border-dashed rounded-xl
            transition-all duration-300 ease-in-out
            flex items-center justify-center gap-3
            ${
              previewUrl
                ? "border-green-300 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
            }
          `}
          >
            <Upload
              className={`h-5 w-5 ${
                previewUrl ? "text-green-600" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                previewUrl ? "text-green-700" : "text-gray-600"
              }`}
            >
              {previewUrl
                ? "Klik untuk ganti foto"
                : "Klik atau drag foto di sini"}
            </span>
          </div>
        </div>

        {/* Preview Image */}
        {previewUrl && (
          <div className="mt-4 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img
                src={previewUrl}
                alt={`Preview ${label}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="Hapus foto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <Image className="h-3 w-3" />
              <span>Foto berhasil diunggah</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (designType === "combined") {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Image className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Unggah Foto</h3>
            <p className="text-sm text-gray-600">
              Unggah foto pamflet kandidat
            </p>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Foto Pamflet
          </label>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <input
                type="file"
                name="fotoPamflet"
                accept="image/*"
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div
                className={`
                w-full px-4 py-3 border-2 border-dashed rounded-xl
                transition-all duration-300 ease-in-out
                flex items-center justify-center gap-3
                ${
                  previewUrls.fotoPamflet
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
              >
                <Upload
                  className={`h-5 w-5 ${
                    previewUrls.fotoPamflet ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    previewUrls.fotoPamflet ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {previewUrls.fotoPamflet
                    ? "Klik untuk ganti foto"
                    : "Klik atau drag foto di sini"}
                </span>
              </div>
            </div>
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Image className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Unggah Foto</h3>
          <p className="text-sm text-gray-600">
            Unggah foto ketua dan wakil kandidat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Foto Ketua
          </label>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <input
                type="file"
                name="fotoKetua"
                accept="image/*"
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div
                className={`
                w-full px-4 py-3 border-2 border-dashed rounded-xl
                transition-all duration-300 ease-in-out
                flex items-center justify-center gap-3
                ${
                  previewUrls.fotoKetua
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
              >
                <Upload
                  className={`h-5 w-5 ${
                    previewUrls.fotoKetua ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    previewUrls.fotoKetua ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {previewUrls.fotoKetua
                    ? "Klik untuk ganti foto"
                    : "Klik di sini"}
                </span>
              </div>
            </div>
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
            <div className="relative w-full">
              <input
                type="file"
                name="fotoWakil"
                accept="image/*"
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div
                className={`
                w-full px-4 py-3 border-2 border-dashed rounded-xl
                transition-all duration-300 ease-in-out
                flex items-center justify-center gap-3
                ${
                  previewUrls.fotoWakil
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
              >
                <Upload
                  className={`h-5 w-5 ${
                    previewUrls.fotoWakil ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    previewUrls.fotoWakil ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {previewUrls.fotoWakil
                    ? "Klik untuk ganti foto"
                    : "Klik disini"}
                </span>
              </div>
            </div>
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

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-blue-100 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-800 text-sm mb-2">
          💡 Tips Upload Foto:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Format yang didukung: JPG, PNG, WebP</li>
          <li>• Ukuran file maksimal 5MB per foto</li>
          <li>• Pastikan foto terlihat jelas dan profesional</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;
