import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div className="card">Loading project details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">project details</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{project.projectName}</h1>
        <p className="mt-3 text-slate-600">{project.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <p className="text-sm text-slate-500">Code</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{project.projectCode}</h3>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Budget</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">₹{Number(project.budget).toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
