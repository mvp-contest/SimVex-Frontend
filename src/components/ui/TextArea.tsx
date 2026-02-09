interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextArea({ label, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[22px] font-medium text-(--color-text-primary)">
        {label}
      </label>
      <textarea
        className={`w-full px-7 py-4 bg-transparent border-b-[1px] border-(--color-border-primary) text-[20px] font-medium text-(--color-text-muted) placeholder:text-(--color-text-muted) outline-none focus:border-(--color-accent-white) transition-colors resize-none min-h-[80px] ${className}`}
        {...props}
      />
    </div>
  );
}
