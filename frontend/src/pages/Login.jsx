import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: 'manager@procureai.com', password: 'Manager@123' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="bg-slate-950 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">ProcureAI</p>
          <h2 className="mt-6 text-4xl font-bold">AI-Based Procurement Decision Support</h2>
          <p className="mt-5 text-slate-300">
            Evaluate suppliers, predict procurement risk, and generate explainable buying decisions for engineering projects.
          </p>
        </div>

        <div className="p-10">
          <h3 className="text-3xl font-bold text-slate-900">Login</h3>
          <p className="mt-2 text-slate-500">Access the project procurement dashboard</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input" />
            </div>
            <div>
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input" />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <a className="text-indigo-600" href="#">Forgot password?</a>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button type="submit" className="btn-primary w-full">Login</button>
            <button type="button" className="btn-secondary w-full" onClick={() => navigate('/register')}>Create account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
