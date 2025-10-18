import React from "react";

const FileUploader = ({ onFilesSelected }) => {
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  return (
    <div className="border-2 border-dashed rounded-2xl p-6 text-center bg-gray-50 hover:bg-gray-100">
      <h3 className="font-semibold mb-2">Upload Aadhaar Images</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default FileUploader;
