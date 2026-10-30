import { Bell, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex min-w-0 items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <Search size={16} />
          <input
            className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-64"
            placeholder="Search suppliers, materials..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'Procurement'}</p>
            </div>
          </div>
          <button onClick={logout} className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
