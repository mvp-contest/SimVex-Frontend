interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: { value: string; label: string }[];
}

export default function Select({ label, options = [], className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[22px] font-medium text-(--color-text-primary)">
        {label}
      </label>
      <select
        className={`w-full px-7 py-4 bg-transparent border-b-[1px] border-(--color-border-primary) text-[20px] font-medium text-(--color-text-muted) outline-none focus:border-(--color-accent-white) transition-colors ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-(--color-card-bg)">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
