import React from "react";

const ResultDisplay = ({ result }) => {
  if (!result || !result.data) return null;

  const { id, label, metadata, scores } = result.data;

  return (
    <div className="result-display">
      <h2>Analysis Result</h2>
      <div className="result-item">
        <strong>ID:</strong> <span>{id}</span>
      </div>
      <div className="result-item">
        <strong>Label:</strong> <span>{label}</span>
      </div>
      <div className="result-item">
        <strong>Metadata:</strong>
        <ul>
          <li><strong>Source:</strong> {metadata.source}</li>
          <li><strong>Version:</strong> {metadata.version}</li>
        </ul>
      </div>
      <div className="result-item">
        <strong>Scores:</strong>
        <ul>
          <li><strong>Is Unsafe:</strong> {scores.is_unsafe ? "Yes" : "No"}</li>
          <li>
            <strong>Provenance Scores:</strong>
            <ul>
              {scores.provenance.map((score, index) => (
                <li key={index}>Score {index + 1}: {score.toFixed(10)}</li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResultDisplay;
