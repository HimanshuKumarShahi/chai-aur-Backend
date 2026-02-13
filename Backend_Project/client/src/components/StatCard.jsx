// Helper for trend colors
const getTrendColor = (isPositive) => 
  isPositive ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";

export default function StatCard({ 
  title, 
  value, 
  sub, 
  icon: Icon, 
  trend, 
  isPositive 
}) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#1A1F2E]/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/10">
      
      {/* Background Gradient Blob */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl transition-all group-hover:bg-indigo-500/10" />

      {/* Top Section: Title, Value, Icon */}
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/50">{title}</p>
          {/* Adjusted Size: Fixed at text-2xl to prevents layout breaks on long numbers */}
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Container - Fixed size and alignment */}
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors group-hover:bg-white/10 group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Bottom Section: Trend & Subtitle */}
      <div className="mt-4 flex items-center gap-3">
        {trend && (
          <span 
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${getTrendColor(isPositive)}`}
          >
            {isPositive ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            )}
            {trend}
          </span>
        )}
        
        {sub && (
          <p className="truncate text-xs font-medium text-white/40">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}