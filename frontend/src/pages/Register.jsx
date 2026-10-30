import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'procurement_manager', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({ ...form, confirmPassword: undefined });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
        <p className="mt-2 text-slate-500">Create your ProcureAI account</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="input">
              <option value="procurement_manager">Procurement Manager</option>
              <option value="project_manager">Project Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Confirm password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input" />
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button type="submit" className="btn-primary w-full">Register</button>
          <button type="button" className="btn-secondary w-full" onClick={() => navigate('/login')}>Already have an account?</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
