import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ Axios import
import { useNavigate } from 'react-router-dom'; // ✅ Add this

function Dashboard() {
  // const [showAssetLog, setShowAssetLog] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [mapUrl, setMapUrl] = useState('');
  const [metrics, setMetrics] = useState({
    total: 0,
    completed: 0,
    open: 0,
    risk: 'N/A',
  });

  // ✅ Define user safely
  const navigate = useNavigate(); // ✅ Navigation hook

  useEffect(() => {
    axios.get('/dashboard')
      .then(res => {
        setMetrics(res.data.metrics || {});
        setPriorities(res.data.priorities || []);
        setMapUrl(res.data.mapUrl || '');
      })
      .catch(err => {
        console.error('Dashboard fetch error:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard Metrics */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl text-black font-bold mb-4">DASHBOARD</h2>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Metrics Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-gray-700 border border-gray-300 rounded">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Metric</th>
                    <th className="px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-t">Total asset management tasks</td>
                    <td className="px-4 py-2 border-t">{metrics.total}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">Completed tasks</td>
                    <td className="px-4 py-2 border-t">{metrics.completed}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">Open tasks</td>
                    <td className="px-4 py-2 border-t">{metrics.open}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">Highest current risk rating</td>
                    <td className="px-4 py-2 border-t">{metrics.risk}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* View Asset Log Button */}
            {/* <div className="md:ml-4 md:mt-0 mt-4">
              <button
                onClick={() => setShowAssetLog(!showAssetLog)}
                className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
              >
                {showAssetLog ? 'HIDE ASSET LOG' : 'VIEW ASSET LOG'}
              </button>
            </div> */}
            <div className="md:ml-4 md:mt-0 mt-4">
              <button
                onClick={() => navigate('/asset-log')}
                className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
              >
                VIEW ASSET LOG
              </button>
            </div>
          </div>
        </div>

        {/* Top Priorities */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl text-black font-bold mb-4">TOP 5 PRIORITIES</h2>
          <ol className="list-decimal ml-6 text-gray-700">
            {priorities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>

        {/* Map Section */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl text-black font-bold mb-4">MAP</h2>
          <iframe
            src={mapUrl || 'https://www.google.com/maps'}
            title="Asset Map"
            className="w-full h-96 rounded"
            allowFullScreen
          ></iframe>
        </div>

        {/* Asset Log Table */}
        {/* {showAssetLog && (
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-xl text-black font-bold mb-4">ASSET LOG</h2>
            <AssetLog user={user} />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Dashboard;





