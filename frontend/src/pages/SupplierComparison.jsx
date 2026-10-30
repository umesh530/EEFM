import { useEffect, useState } from 'react';
import api from '../services/api';

const SupplierComparison = () => {
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [comparison, setComparison] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/procurements');
        setRequirements(response.data);
        if (response.data.length) setSelectedRequirement(response.data[0]._id);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load procurement requirements.');
      }
    };

    fetchData();
  }, []);

  const runAnalysis = async () => {
    if (!selectedRequirement) {
      setError('Select a procurement requirement before running the analysis.');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const response = await api.post('/decisions/evaluate', { requirementId: selectedRequirement });
      setComparison(response.data.comparison || []);
      setRecommendation(response.data.aiResult || null);
    } catch (analysisError) {
      setComparison([]);
      setError(analysisError.response?.data?.message || 'Supplier analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">analysis</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Supplier Comparison</h1>
        </div>
      </div>

      <div className="card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label>Procurement Requirement</label>
            <select value={selectedRequirement} onChange={(e) => setSelectedRequirement(e.target.value)} className="input">
              <option value="">Select requirement</option>
              {requirements.map((item) => (
                <option key={item._id} value={item._id}>{item.materialName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={runAnalysis} disabled={loading || !selectedRequirement} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Analyzing suppliers...' : 'Run AI Analysis'}
            </button>
          </div>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {recommendation && (
        <div className="card border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recommended supplier: {recommendation.recommendation}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.summary}</p>
          <p className="mt-2 text-xs text-slate-500">Confidence: {recommendation.confidence}%</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-sm font-semibold text-slate-700">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Reliability</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((supplier) => (
              <tr key={supplier.supplierId} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-800">{supplier.supplierName}</td>
                <td className="px-4 py-3">₹{Number(supplier.price || 0).toLocaleString()}</td>
                <td className="px-4 py-3">{supplier.quality}</td>
                <td className="px-4 py-3">{supplier.delivery}</td>
                <td className="px-4 py-3">{supplier.reliability}</td>
                <td className="px-4 py-3">{supplier.riskStatus}</td>
                <td className="px-4 py-3 font-semibold text-indigo-600">{supplier.overallScore}</td>
              </tr>
            ))}
            {!comparison.length && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                  {loading ? 'Calculating supplier scores...' : 'Run an analysis to see the supplier ranking.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierComparison;
