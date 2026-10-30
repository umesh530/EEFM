import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile(profile);
      setMessage('Profile updated successfully');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile');
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password updated successfully');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update password');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Account & System Settings</h1>
      </div>

      {(message || error) && (
        <p className={error ? 'text-sm text-rose-600' : 'text-sm text-emerald-600'}>{error || message}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="card space-y-5" onSubmit={saveProfile}>
          <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
          <div>
            <label>Name</label>
            <input className="input" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required />
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Role:</span> {user?.role}
          </div>
          <button className="btn-primary" type="submit">Save profile</button>
        </form>

        <form className="card space-y-5" onSubmit={savePassword}>
          <h3 className="text-lg font-semibold text-slate-900">Change password</h3>
          <div>
            <label>Current password</label>
            <input className="input" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required />
          </div>
          <div>
            <label>New password</label>
            <input className="input" type="password" minLength="8" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required />
          </div>
          <div>
            <label>Confirm new password</label>
            <input className="input" type="password" minLength="8" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} required />
          </div>
          <button className="btn-primary" type="submit">Update password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
