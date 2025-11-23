import React, { useEffect, useState } from 'react';

function Summary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/assets/summary')
      .then(res => res.json())
      .then(data => setSummary(data));
  }, []);

  if (!summary) return <p>Loading summary...</p>;

  return (
    <div className="mb-4">
      <p>Total Assets: {summary.total}</p>
      <p>High Risk Assets: {summary.high_risk}</p>
    </div>
  );
}

export default Summary;