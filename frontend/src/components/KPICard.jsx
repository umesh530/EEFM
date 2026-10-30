const KPICard = ({ title, value, change, icon: Icon, accent = 'indigo' }) => {
  const accentClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-semibold text-slate-900">{value}</h3>
        {change && <p className="mt-2 text-xs text-slate-500">{change}</p>}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[accent]}`}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
  );
};

export default KPICard;
