interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({ label, error, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 bg-(--color-input-bg) border border-(--color-input-border) rounded-md text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-accent-blue) transition-colors resize-none disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-(--color-status-danger)">{error}</p>}
    </div>
  );
}
