const handleUpload = (req, res, next) => {
  // Baca designType dari header untuk menentukan jenis upload
  const designType = req.headers["design-type"];

  if (!designType) {
    return res
      .status(400)
      .json({ message: "Design type diperlukan dalam header" });
  }

  console.log("Processing design type:", designType);

  if (designType === "combined") {
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error("Upload error (combined):", err);
        return res
          .status(400)
          .json({ message: "Error uploading pamflet: " + err.message });
      }
      console.log("File uploaded successfully (combined):", req.file);
      next();
    });
  } else if (designType === "separate") {
    uploadMultiple(req, res, (err) => {
      if (err) {
        console.error("Upload error (separate):", err);
        return res
          .status(400)
          .json({ message: "Error uploading photos: " + err.message });
      }
      console.log("Files uploaded successfully (separate):", req.files);
      next();
    });
  } else {
    return res.status(400).json({ message: "Design type tidak valid" });
  }
};
