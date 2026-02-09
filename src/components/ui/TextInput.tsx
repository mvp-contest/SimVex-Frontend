interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function TextInput({ label, error, className = "", ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-accent-blue) transition-colors disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-(--color-status-danger)">{error}</p>}
    </div>
  );
}
