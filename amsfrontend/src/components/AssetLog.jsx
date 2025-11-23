import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

export default function AssetLog({  user = {}  }) {
  const [assets, setAssets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedAsset, setEditedAsset] = useState({});

  useEffect(() => {
    axios.get('/assets')
      .then(res => setAssets(res.data))
      .catch(err => console.error('Error fetching assets:', err));
  }, []);

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setEditedAsset(asset);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/assets/${editingId}`, editedAsset);
      setAssets(assets.map(a => a.id === editingId ? editedAsset : a));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating asset:', err);
    }
  };

  const renderCell = (field, asset, type = 'text') => {
    if (editingId === asset.id) {
      if (type === 'dropdown') {
        return (
          <select
            value={editedAsset[field]}
            onChange={(e) => setEditedAsset({ ...editedAsset, [field]: e.target.value })}
            className="border px-2 py-1 w-full"
          >
            {[...Array(10).keys()].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        );
      }
      if (type === 'date') {
        return (
          <input
            type="date"
            value={editedAsset[field]?.slice(0, 10)}
            onChange={(e) => setEditedAsset({ ...editedAsset, [field]: e.target.value })}
            className="border px-2 py-1 w-full"
          />
        );
      }
      return (
        <input
          value={editedAsset[field]}
          onChange={(e) => setEditedAsset({ ...editedAsset, [field]: e.target.value })}
          className="border px-2 py-1 w-full"
        />
      );
    }
    return asset[field];
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Asset Log</h2>
      <table className="min-w-full border text-sm text-black">
        <thead className="bg-gray-200">
          <tr className='text-black'>
            {[
              'Structure No', 'Mileage', 'Structure Type', 'Spans', 'Structure Name', 'Location', 'Carries',
              'Material Type', 'Work Item', 'Possible Consequence',
              'CL', 'CS', 'CR', 'Log Date',
              'ML', 'MS', 'MR', 'Completion',
              'Status', 'Exam Years', 'Last Exam', 'Next Exam',
              'Exam Report', 'Assessment', 'Records'
            ].map(label => <th key={label} className="p-2">{label}</th>)}
            {user.role === 'admin' && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id} className="border-t">
              <td className="p-2 text-black">{renderCell('structure_no', asset)}</td>
              <td className="p-2">{renderCell('mileage', asset)}</td>
              <td className="p-2">{renderCell('structure_type', asset)}</td>
              <td className="p-2">{renderCell('spans', asset)}</td>
              <td className="p-2">{renderCell('structure_name', asset)}</td>
              <td className="p-2">{renderCell('location', asset)}</td>
              <td className="p-2">{renderCell('carries', asset)}</td>
              <td className="p-2">{renderCell('material_type', asset)}</td>
              <td className="p-2">{renderCell('work_item', asset)}</td>
              <td className="p-2">{renderCell('possible_consequence', asset)}</td>
              <td className="p-2">{renderCell('current_likelihood', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('current_severity', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('current_rating', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('current_date_logged', asset, 'date')}</td>
              <td className="p-2">{renderCell('mitigation_likelihood', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('mitigation_severity', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('mitigation_rating', asset, 'dropdown')}</td>
              <td className="p-2">{renderCell('mitigation_completion', asset)}</td>
              <td className="p-2">{renderCell('status', asset)}</td>
              <td className="p-2">{renderCell('detailed_exam_years', asset)}</td>
              <td className="p-2">{renderCell('last_exam', asset, 'date')}</td>
              <td className="p-2">{renderCell('next_exam', asset, 'date')}</td>
              <td className="p-2">{renderCell('exam_report', asset)}</td>
              <td className="p-2">{renderCell('assessment', asset)}</td>
              <td className="p-2">{renderCell('records', asset)}</td>
              {user.role === 'admin' && (
                <td className="p-2">
                  {editingId === asset.id ? (
                    <button onClick={handleSave} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                  ) : (
                    <button onClick={() => handleEdit(asset)} className="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}