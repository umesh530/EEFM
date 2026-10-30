import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import AIRecommendation from '../components/AIRecommendation';
import ScoreBar from '../components/ScoreBar';
import api from '../services/api';

const Decision = () => {
  const [decision, setDecision] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requirementsRes, decisionsRes] = await Promise.all([
          api.get('/procurements'),
          api.get('/decisions'),
        ]);
        setRequirements(requirementsRes.data);
        const latestDecision = decisionsRes.data[0] || null;
        setDecision(latestDecision);
        const decisionRequirementId = latestDecision?.requirement?._id || latestDecision?.requirement;
        setSelectedRequirement(decisionRequirementId || requirementsRes.data[0]?._id || '');
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load procurement decisions.');
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
    try {
      const response = await api.post('/decisions/evaluate', { requirementId: selectedRequirement });
      setDecision({ ...response.data.decision, scoredSuppliers: response.data.comparison || [] });
    } catch (analysisError) {
      setError(analysisError.response?.data?.message || 'Decision analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const comparison = decision?.scoredSuppliers || [];
  const recommendedSupplierId = decision?.recommendedSupplier?._id || decision?.recommendedSupplier;
  const recommendedScores = comparison.find((supplier) => String(supplier.supplierId) === String(recommendedSupplierId));
  const recommendedSupplierName = decision?.recommendedSupplier?.supplierName || recommendedScores?.supplierName || 'No supplier recommendation';
  const alternativeSupplierId = decision?.alternativeSupplier?._id || decision?.alternativeSupplier;
  const alternativeSupplier = decision?.alternativeSupplier?.supplierName
    ? decision.alternativeSupplier
    : comparison.find((supplier) => String(supplier.supplierId) === String(alternativeSupplierId));
  const scores = {
    cost: recommendedScores?.costScore ?? decision?.weightedScores?.cost,
    quality: recommendedScores?.quality ?? decision?.weightedScores?.quality,
    delivery: recommendedScores?.delivery ?? decision?.weightedScores?.delivery,
    reliability: recommendedScores?.reliability ?? decision?.weightedScores?.reliability,
    risk: recommendedScores?.risk ?? decision?.weightedScores?.risk,
  };
  const risks = decision?.risks || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">decision engine</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Procurement Decision</h1>
        </div>
        <button className="btn-primary" onClick={runAnalysis} disabled={loading || !selectedRequirement}>
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="card">
        <label>Procurement Requirement</label>
        <select value={selectedRequirement} onChange={(e) => { setSelectedRequirement(e.target.value); setDecision(null); }} className="input">
          <option value="">Select requirement</option>
          {requirements.map((item) => (
            <option key={item._id} value={item._id}>{item.materialName}</option>
          ))}
        </select>
      </div>

      {decision ? (
        <div className="space-y-6">
          <AIRecommendation
            supplier={recommendedSupplierName}
            score={decision.overallScore ?? 0}
            confidence={decision.confidenceScore ?? 0}
            summary={decision.summary || 'No explanation was returned for this evaluation.'}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900">Decision Factors</h3>
              <div className="mt-5 space-y-5">
                <ScoreBar label="Cost" value={scores.cost ?? 0} color="bg-emerald-500" />
                <ScoreBar label="Quality" value={scores.quality ?? 0} color="bg-indigo-500" />
                <ScoreBar label="Delivery" value={scores.delivery ?? 0} color="bg-sky-500" />
                <ScoreBar label="Reliability" value={scores.reliability ?? 0} color="bg-amber-500" />
                <ScoreBar label="Risk" value={scores.risk ?? 0} color="bg-rose-500" />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900">Risk Alerts</h3>
              <div className="mt-5 space-y-3">
                {risks.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    <AlertTriangle size={16} />
                    {item}
                  </div>
                ))}
                {!risks.length && <p className="text-sm text-slate-500">No risk alerts were returned for this analysis.</p>}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900">AI Explanation</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{decision.summary || 'No explanation was returned for this evaluation.'}</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Alternative Supplier</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{alternativeSupplier?.supplierName || 'No alternative supplier available'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Suggested Action</p>
                <p className="mt-2 text-sm text-slate-600">{decision.suggestedAction || 'No suggested action was returned for this evaluation.'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-slate-500">Select a requirement and run the AI engine to generate a recommendation.</div>
      )}
    </div>
  );
};

export default Decision;
