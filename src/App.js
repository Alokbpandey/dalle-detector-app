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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Update preview when file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl(""); // Clear URL input if a file is selected
    
    // Create preview URL for the selected file
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  // Update preview when URL is entered
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null); // Clear file input if a URL is entered
    setPreviewUrl(url.length > 0 ? url : null);
  };

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, imageFile]);

  const handleSubmit = async () => {
    if (!imageFile && !imageUrl) {
      alert("Please upload an image or enter a URL.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const imageLabel = `Image ${history.length + 1}`;

    try {
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl) {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image from URL.");
        
        const blob = await response.blob();
        formData.append("image", blob, "fetchedImage.jpg");
      }

      const response = await axios.post("https://api.openai.com/v1/images/provenance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${process.env.REACT_APP_DALLE_API_KEY}`,
        },
      });

      const output = response.data;
      setResult(output);
      saveResponseToFile(output);
      updateHistory(imageLabel, output, true);
    } catch (error) {
      console.error("Error detecting image:", error);
      const errorData = { error: "Failed to analyze the image." };
      setResult(errorData);
      updateHistory(imageLabel, errorData, false);
    } finally {
      setLoading(false);
    }
  };

  const saveResponseToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, `dalle-detection-result-${Date.now()}.json`);
  };

  const updateHistory = (imageLabel, output, success) => {
    const dateTime = new Date().toLocaleString();
    const newEntry = {
      date: dateTime,
      input: imageLabel,
      output: JSON.stringify(output),
      success,
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setContextMenu(null);
  };

  const handleRightClick = (e, index) => {
    e.preventDefault();
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
              onContextMenu={(e) => handleRightClick(e, index)}
            >
              {entry.date} - {entry.input}
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
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Image Preview Section */}
        {previewUrl && (
          <div className="preview-container">
            <h3>Image</h3>
            <div className="image-preview">
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '300px',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <FaHourglassHalf className="icon sandglass-icon" />
            <span>Analyzing...</span>
          </div>
        )}
        
        {result && (
          <div className="result">
            <h2>Result:</h2>
            <table className="result-table">
              <tbody>
                <tr>
                  <th>Provenance Check ID</th>
                  <td>{result.data.id}</td>
                </tr>
                <tr>
                  <th>Label</th>
                  <td>{result.data.label === "not_dalle" ? "Not Generated by DALL-E" : "Generated by DALL-E"}</td>
                </tr>
                <tr>
                  <th>Source</th>
                  <td>{result.data.metadata.source}</td>
                </tr>
                <tr>
                  <th>Version</th>
                  <td>{result.data.metadata.version}</td>
                </tr>
                <tr>
                  <th>Unsafe Content</th>
                  <td>{result.data.scores.is_unsafe ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Provenance Confidence Scores</th>
                  <td>
                    <ul>
                      {result.data.scores.provenance.map((score, index) => (
                        <li key={index}>Score {index + 1}: {score.toFixed(4)}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;