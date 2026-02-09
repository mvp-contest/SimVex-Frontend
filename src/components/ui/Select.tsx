interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { value: string | number; label: string }[];
  error?: string;
}

export default function Select({ label, options = [], error, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-3 py-2 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-(--color-text-primary) outline-none focus:border-(--color-accent-blue) appearance-none transition-colors disabled:opacity-50 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-(--color-card-bg)">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-(--color-status-danger)">{error}</p>}
    </div>
  );
}
