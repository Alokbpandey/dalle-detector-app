import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "./App.css";
import "./ContextMenu.css";
import ContextMenu from "./ContextMenu.js";
import { FaPaperPlane, FaUpload, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    const imageLabel = `Image ${history.length + 1}`;

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("url", imageUrl);
    }

    try {
      // Replace with the actual API endpoint
      const response = await axios.post("https://api.openai.com/v1/images/provenance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${process.env.REACT_APP_DALLE_API_KEY}`,
        },
      });

      const resultData = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        input: imageFile ? imageFile.name : imageUrl,
        output: response.data,
      };

      setResult(resultData);
      saveAllResultsToFile([...history, resultData]); // Save all history entries to a single JSON file
      updateHistory(imageLabel, true, resultData); // Update history with success and save to local storage
    } catch (error) {
      console.error("Error detecting image:", error);
      const resultData = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        input: imageFile ? imageFile.name : imageUrl,
        output: { error: "Failed to analyze the image." },
      };

      setResult(resultData);
      updateHistory(imageLabel, false, resultData); // Update history with failure and save to local storage
    } finally {
      setLoading(false);
    }
  };

  const saveAllResultsToFile = (allResults) => {
    const blob = new Blob([JSON.stringify(allResults, null, 2)], { type: "application/json" });
    saveAs(blob, `dalle-detection-results-${Date.now()}.json`);
  };

  const updateHistory = (imageLabel, success, resultData) => {
    const newEntry = { fileName: imageLabel, success, ...resultData };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory)); // Save history to localStorage
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory)); // Update localStorage
    setContextMenu(null); // Close the context menu after deletion
  };

  const handleRightClick = (e, index) => {
    e.preventDefault(); // Prevent the default right-click menu
    setSelectedIndex(index);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setSelectedIndex(null);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>History</h2>
        <ul className="history-list">
          {history.map((entry, index) => (
            <li
              key={index}
              className={`history-item ${entry.success ? 'success' : 'failure'}`}
              onContextMenu={(e) => handleRightClick(e, index)} // Handle right-click
            >
              {entry.fileName}
              {entry.success ? (
                <FaCheckCircle className="history-icon success-icon" />
              ) : (
                <FaTimesCircle className="history-icon failure-icon" />
              )}
            </li>
          ))}
        </ul>
        {contextMenu && (
          <ContextMenu
            position={contextMenu}
            onDelete={() => deleteHistoryItem(selectedIndex)}
            onClose={closeContextMenu}
          />
        )}
      </div>
      <div className="main-content">
        <h1 className="header">Happy Testing!</h1>
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="Enter image URL or click upload"
              onChange={handleUrlChange}
              value={imageUrl}
            />
            <div className="icon-container">
              <FaPaperPlane className="icon gray-icon" onClick={handleSubmit} />
              <label htmlFor="file-upload" className="icon gray-icon">
                <FaUpload />
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        {loading && (
          <div className="loading">
            <FaHourglassHalf className="icon sandglass-icon" />
            <span>Analyzing...</span>
          </div>
        )}
        {result && (
          <div className="result">
            <h2>Result:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
