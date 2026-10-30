import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items }) => {
  const location = useLocation();

  const openAssistant = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('procureai-chatbot-toggle'));
  };

  return (
    <aside className="flex h-dvh w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-950 text-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">P</div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">enterprise</p>
          <h1 className="text-lg font-semibold text-white">ProcureAI</h1>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {items.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-slate-800 px-3 py-5">
        <button
          type="button"
          onClick={openAssistant}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          AI Assistant
        </button>
        <Link
          to="/settings"
          className={`mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            location.pathname === '/settings' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
