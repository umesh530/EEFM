const Loading = ({ text = 'Loading...' }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-soft">
      <span className="h-3 w-3 animate-pulse rounded-full bg-indigo-600" />
      {text}
    </div>
  </div>
);

export default Loading;
