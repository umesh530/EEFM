import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const [data, setData] = useState({ riskDistribution: {}, monthlySpending: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Analytics load failed', error);
        setError('Analytics could not be loaded. Check the API connection and refresh.');
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: 'Low', value: data.riskDistribution?.low ?? 0, color: '#10b981' },
    { name: 'Medium', value: data.riskDistribution?.medium ?? 0, color: '#f59e0b' },
    { name: 'High', value: data.riskDistribution?.high ?? 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">analytics</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Procurement Analytics</h1>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-5 md:grid-cols-4">
        <div className="card"><p className="text-sm text-slate-500">Total Requirement Budget</p><h2 className="mt-2 text-2xl font-bold text-slate-900">₹{(data.totalProcurementValue ?? 0).toLocaleString()}</h2></div>
        <div className="card"><p className="text-sm text-slate-500">Average Requirement Budget</p><h2 className="mt-2 text-2xl font-bold text-slate-900">₹{(data.averageOrderValue ?? 0).toLocaleString()}</h2></div>
        <div className="card"><p className="text-sm text-slate-500">Projects</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{data.totalProjects ?? 0}</h2></div>
        <div className="card"><p className="text-sm text-slate-500">Decisions Made</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{data.decisionsMade ?? 0}</h2></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Monthly requirement budget</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlySpending || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Risk distribution</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
