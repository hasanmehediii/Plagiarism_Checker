import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file1Content, setFile1Content] = useState('');
  const [file2Content, setFile2Content] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [matchedLines, setMatchedLines] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setFile, setContent) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = () => setContent(reader.result);
    reader.readAsText(file);
  };

  const handleScan = async () => {
    if (!file1 || !file2) {
      alert('Please upload both files!');
      return;
    }

    setLoading(true);
    setSimilarity(null);
    setMatchedLines([]);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await axios.post('http://localhost:8000/compare', formData);
      setSimilarity(response.data.similarity);
      setMatchedLines(response.data.matched_lines);
    } catch (error) {
      console.error('Error:', error);
      alert('Error during scanning. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>📄Copy Checker</h1>

      <div className="upload-section">
        <div className="upload-card">
          <label>File 1:</label>
          <textarea
            readOnly
            value={file1Content}
            placeholder="Enter your text here or upload a file"
            rows={8}
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setFile1, setFile1Content)}
          />
        </div>

        <div className="upload-card">
          <label>File 2:</label>
          <textarea
            readOnly
            value={file2Content}
            placeholder="Enter your text here or upload a file"
            rows={8}
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setFile2, setFile2Content)}
          />
        </div>
      </div>

      <button onClick={handleScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Start Scanning'}
      </button>

      {similarity !== null && (
        <div className="results">
          <h2>
            Similarity: <span>{similarity}%</span>
          </h2>

          {matchedLines.length > 0 ? (
            <div className="matched-lines">
              <h3>Matched Lines:</h3>
              {matchedLines.map((line, index) => (
                <p key={index} className="matched-line">{line}</p>
              ))}
            </div>
          ) : (
            <p>No significant matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
