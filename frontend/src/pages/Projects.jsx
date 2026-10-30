import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  projectName: '',
  projectCode: '',
  description: '',
  projectType: 'Infrastructure',
  startDate: '',
  endDate: '',
  budget: '',
  projectManager: '',
  status: 'Planning',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(true);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      setStatus('Unable to load projects right now.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.projectName || !form.projectCode || !form.projectType || !form.budget || !form.projectManager) {
      setStatus('Please complete all required project details before saving.');
      return;
    }

    setIsSaving(true);
    setStatus('');

    try {
      await api.post('/projects', { ...form, budget: Number(form.budget) });
      setForm(initialForm);
      setShowForm(false);
      setStatus('Project saved successfully.');
      await fetchProjects();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Project save failed. Please check the details and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">projects</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Engineering Project Management</h1>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setShowForm((current) => !current);
            if (showForm) {
              setForm(initialForm);
            }
          }}
        >
          {showForm ? 'Close Form' : 'New Project'}
        </button>
      </div>

      {status && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          {status}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Project Portfolio</h3>
          <div className="mt-5 space-y-4">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{project.projectName}</h4>
                    <p className="text-sm text-slate-500">{project.projectCode} · {project.projectType}</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">{project.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{project.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600">
                  <div><span className="block text-xs uppercase text-slate-400">Manager</span>{project.projectManager}</div>
                  <div><span className="block text-xs uppercase text-slate-400">Budget</span>₹{Number(project.budget).toLocaleString()}</div>
                  <div><span className="block text-xs uppercase text-slate-400">Timeline</span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-semibold text-slate-900">Create Project</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label>Project Name</label>
                <input name="projectName" value={form.projectName} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Project Code</label>
                <input name="projectCode" value={form.projectCode} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Project Type</label>
                <input name="projectType" value={form.projectType} onChange={handleChange} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label>End Date</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input" />
                </div>
              </div>
              <div>
                <label>Budget</label>
                <input type="number" name="budget" value={form.budget} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Project Manager</label>
                <input name="projectManager" value={form.projectManager} onChange={handleChange} className="input" />
              </div>
              <div>
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input">
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Procurement</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>
              <div>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input min-h-[90px]" />
              </div>
              <button type="submit" disabled={isSaving} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                {isSaving ? 'Saving Project...' : 'Save Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Projects;
