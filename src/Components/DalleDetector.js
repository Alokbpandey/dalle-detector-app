// src/DalleDetector.js

import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "./DalleDetector.css";

const DalleDetector = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageUrl(""); // Clear URL input if a file is selected
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Clear file input if a URL is entered
  };

  const handleSubmit = async () => {
    if (!imageFile && !imageUrl) {
      alert("Please upload an image or enter a URL.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("url", imageUrl);
    }

    try {
      // Replace with the actual API endpoint
      const response = await axios.post("https://api.example.com/dalle-detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
      saveResponseToFile(response.data);
    } catch (error) {
      console.error("Error detecting image:", error);
      setResult({ error: "Failed to analyze the image." });
    } finally {
      setLoading(false);
    }
  };

  const saveResponseToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, `dalle-detection-result-${Date.now()}.json`);
  };

  return (
    <div className="container">
      <h1>DALL-E Image Detector</h1>
      <div className="input-group">
        <label className="input-label">Upload Image</label>
        <input type="file" onChange={handleFileChange} accept="image/*" className="input-file" />
      </div>
      <div className="input-group">
        <label className="input-label">or Enter Image URL</label>
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleUrlChange}
          className="input-url"
        />
      </div>
      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? "Analyzing..." : "Submit"}
      </button>
      {result && (
        <div className="result">
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DalleDetector;
