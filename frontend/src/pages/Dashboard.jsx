import { useEffect, useState } from 'react';
import { BarChart3, Building2, PackageCheck, IndianRupee, ShieldAlert, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import KPICard from '../components/KPICard';
import api from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, suppliersRes, procurementRes, analyticsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/suppliers'),
          api.get('/procurements'),
          api.get('/analytics'),
        ]);
        setProjects(projectsRes.data);
        setSuppliers(suppliersRes.data);
        setProcurements(procurementRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Dashboard data fetch failed', error);
        setError('Dashboard data could not be loaded. Check the API connection and refresh.');
      }
    };

    fetchData();
  }, []);

  const generateReport = () => {
    const reportText = [
      'ProcureAI Procurement Report',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Active projects: ${projects.filter((project) => ['Active', 'Procurement'].includes(project.status)).length}`,
      `Total procurement value: ₹${(analytics.totalProcurementValue ?? 0).toLocaleString()}`,
      `High risk suppliers: ${analytics.highRiskSuppliers?.length ?? 0}`,
      `Supplier count: ${suppliers.length}`,
      '',
      'Priority recommendations:',
      '1. Review supplier risk exposure for the current procurement cycle.',
      '2. Prioritize timely delivery for high-criticality materials.',
      '3. Maintain cost benchmarking against market baseline.',
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `procureai-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowToast(true);
    window.clearTimeout(window.reportToastTimer);
    window.reportToastTimer = window.setTimeout(() => setShowToast(false), 1000);
  };

  const chartData = Object.entries(procurements.reduce((totals, item) => {
    const category = item.materialCategory || 'Uncategorized';
    totals[category] = (totals[category] || 0) + Number(item.maxBudget || 0);
    return totals;
  }, {})).map(([name, value]) => ({ name, value }));

  const supplierComparison = [...suppliers]
    .sort((first, second) =>
      (Number(second.qualityScore) + Number(second.deliveryScore) + Number(second.reliabilityScore)) -
      (Number(first.qualityScore) + Number(first.deliveryScore) + Number(first.reliabilityScore))
    )
    .slice(0, 5)
    .map((supplier) => ({
      name: supplier.supplierName,
      score: Math.round((Number(supplier.qualityScore) + Number(supplier.deliveryScore) + Number(supplier.reliabilityScore)) / 3),
    }));

  return (
    <div className="space-y-7">
      {showToast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          Report saved successfully
        </div>
      )}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Procurement Dashboard</h1>
        </div>
        <button type="button" onClick={generateReport} className="btn-primary">Generate Report</button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <KPICard title="Active Projects" value={projects.filter((project) => ['Active', 'Procurement'].includes(project.status)).length} change="Active or in procurement" icon={Building2} accent="indigo" />
        <KPICard title="Pending Requests" value={procurements.filter((item) => ['Open', 'In Review'].includes(item.status)).length} change="Open or in review" icon={PackageCheck} accent="amber" />
        <KPICard title="Requirement Budgets" value={`₹${(analytics.totalProcurementValue ?? 0).toLocaleString()}`} change="Sum of requirement budgets" icon={IndianRupee} accent="emerald" />
        <KPICard title="Suppliers" value={suppliers.length} change="Registered suppliers" icon={TrendingUp} accent="blue" />
        <KPICard title="High Risk Suppliers" value={analytics.highRiskSuppliers?.length ?? 0} change="Requires review" icon={ShieldAlert} accent="rose" />
        <KPICard title="Decisions Made" value={analytics.decisionsMade ?? 0} change="Saved evaluations" icon={BarChart3} accent="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Procurement spending by category</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Supplier performance comparison</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        <div className="mt-5 space-y-3">
          {procurements.slice(0, 5).map((item) => (
            <div key={item._id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              {item.materialName} requirement for {item.project?.projectName || 'Project'} · {item.status}
            </div>
          ))}
          {!procurements.length && <p className="text-sm text-slate-500">No procurement requirements recorded.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
