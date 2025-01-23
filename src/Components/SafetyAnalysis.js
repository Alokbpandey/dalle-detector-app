import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const SafetyAnalysis = ({ results }) => {
  const [safetyScores, setSafetyScores] = useState([]);
  const [provenanceScores, setProvenanceScores] = useState([]);
  const [averageSafety, setAverageSafety] = useState(0);
  const [averageProvenance, setAverageProvenance] = useState(0);

  useEffect(() => {
    const newSafetyScores = results.map(result => result.data.scores.is_unsafe ? 0 : 1);
    const newProvenanceScores = results.map(result => result.data.scores.provenance[0]); // Assume first provenance score is what you want

    setSafetyScores(newSafetyScores);
    setProvenanceScores(newProvenanceScores);
    
    if (newSafetyScores.length) {
      setAverageSafety((newSafetyScores.reduce((a, b) => a + b, 0) / newSafetyScores.length).toFixed(2));
      setAverageProvenance((newProvenanceScores.reduce((a, b) => a + b, 0) / newProvenanceScores.length).toFixed(2));
    }
  }, [results]);

  const chartData = {
    labels: results.map((_, index) => `Image ${index + 1}`),
    datasets: [
      {
        label: 'Safety Score',
        data: safetyScores,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Provenance Score',
        data: provenanceScores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="safety-analysis">
      <h2>Safety Analysis</h2>
      <div className="safety-message">
        {averageSafety === '0.00' ? (
          <p style={{ color: 'red' }}>Sorry, your image is unsafe.</p>
        ) : (
          <p style={{ color: 'green' }}>Your image is safe to go!</p>
        )}
      </div>
      <Line data={chartData} />
      <div className="averages">
        <p><strong>Average Safety Score:</strong> {averageSafety}</p>
        <p><strong>Average Provenance Score:</strong> {averageProvenance}</p>
      </div>
    </div>
  );
};

export default SafetyAnalysis;
