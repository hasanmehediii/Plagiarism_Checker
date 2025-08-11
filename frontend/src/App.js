import React, { useState } from 'react';
import './App.css';

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSimilarityScore(null);
    setError(null);

    if (!file1 || !file2) {
      setError("Please select both files.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch('/api/analyze', { // Changed to relative path for Vercel
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSimilarityScore(data.similarity_score);
      } else {
        setError(data.error || "An error occurred during analysis.");
      }
    } catch (err) {
      setError("Could not connect to the server. Please ensure the backend is running.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plagiarism Checker</h1>
      </header>
      <main className="App-main">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="file-input-group">
              <label htmlFor="file1">Document 1:</label>
              <input type="file" id="file1" onChange={handleFile1Change} accept=".pdf,.docx,.txt" />
            </div>
            <div className="file-input-group">
              <label htmlFor="file2">Document 2:</label>
              <input type="file" id="file2" onChange={handleFile2Change} accept=".pdf,.docx,.txt" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Plagiarism'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {similarityScore !== null && (
            <div className="result">
              <h2>Similarity Score:</h2>
              <p className={similarityScore > 50 ? 'high-similarity' : 'low-similarity'}>
                {similarityScore.toFixed(2)}%
              </p>
              {similarityScore > 50 && (
                <p className="warning">High similarity detected! This might indicate plagiarism.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
