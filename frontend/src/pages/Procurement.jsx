import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  project: '',
  materialName: '',
  materialCategory: '',
  quantity: '',
  unit: 'kg',
  requiredQuality: '',
  requiredDeliveryDate: '',
  maxBudget: '',
  minSupplierRating: 80,
  criticality: 'High',
  technicalSpecifications: '',
  additionalNotes: '',
};

const Procurement = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [requirements, setRequirements] = useState([]);

  const fetchData = async () => {
    const [projectsRes, procurementRes] = await Promise.all([
      api.get('/projects'),
      api.get('/procurements'),
    ]);
    setProjects(projectsRes.data);
    setRequirements(procurementRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/procurements', { ...form, quantity: Number(form.quantity), maxBudget: Number(form.maxBudget), minSupplierRating: Number(form.minSupplierRating) });
    setForm(initialForm);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">procurement</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Procurement Requirements</h1>
        </div>
        <button className="btn-primary">New Requirement</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Requirement Log</h3>
          <div className="mt-5 space-y-4">
            {requirements.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{item.materialName}</h4>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-700">{item.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <p>Project: {item.project?.projectName || '—'}</p>
                  <p>Quantity: {item.quantity} {item.unit}</p>
                  <p>Budget: ₹{Number(item.maxBudget).toLocaleString()}</p>
                  <p>Delivery: {new Date(item.requiredDeliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h3 className="text-lg font-semibold text-slate-900">Create Requirement</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label>Project</label>
              <select name="project" value={form.project} onChange={handleChange} className="input">
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.projectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Material Name</label>
              <input name="materialName" value={form.materialName} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Material Category</label>
              <input name="materialCategory" value={form.materialCategory} onChange={handleChange} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Quantity</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Unit</label>
                <input name="unit" value={form.unit} onChange={handleChange} className="input" />
              </div>
            </div>
            <div>
              <label>Required Quality</label>
              <input name="requiredQuality" value={form.requiredQuality} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Required Delivery</label>
              <input type="date" name="requiredDeliveryDate" value={form.requiredDeliveryDate} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Maximum Budget</label>
              <input type="number" name="maxBudget" value={form.maxBudget} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Minimum Supplier Rating</label>
              <input type="number" name="minSupplierRating" value={form.minSupplierRating} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Technical Specifications</label>
              <textarea name="technicalSpecifications" value={form.technicalSpecifications} onChange={handleChange} className="input min-h-[90px]" />
            </div>
            <div>
              <label>Additional Notes</label>
              <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} className="input min-h-[90px]" />
            </div>
            <button type="submit" className="btn-primary w-full">Save Requirement</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Procurement;
