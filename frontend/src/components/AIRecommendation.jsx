const AIRecommendation = ({ supplier, score, confidence, summary }) => {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">AI Recommendation</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{supplier}</h2>
        </div>
        <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-center text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Confidence</p>
          <p className="text-2xl font-bold">{confidence}%</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
          <p className="text-sm text-slate-500">Overall Score</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{score}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
          <p className="text-sm text-slate-500">Decision Summary</p>
          <p className="mt-2 text-sm text-slate-700">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
