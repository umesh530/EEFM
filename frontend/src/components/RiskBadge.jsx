const RiskBadge = ({ level }) => {
  const styles = {
    LOW: 'bg-emerald-100 text-emerald-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HIGH: 'bg-rose-100 text-rose-700',
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[level] || styles.MEDIUM}`}>{level}</span>;
};

export default RiskBadge;
