import { useEffect, useState } from 'react';
import api from '../services/api';

const ProcurementHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await api.get('/procurements');
      setHistory(response.data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">history</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Procurement History</h1>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id} className="border-t border-slate-200">
                <td className="px-4 py-3">{item.project?.projectName || 'Bridge Construction Project'}</td>
                <td className="px-4 py-3">{item.materialName}</td>
                <td className="px-4 py-3">ABC Steel Pvt. Ltd.</td>
                <td className="px-4 py-3">{item.quantity} {item.unit}</td>
                <td className="px-4 py-3">₹{Number(item.maxBudget || 0).toLocaleString()}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcurementHistory;
