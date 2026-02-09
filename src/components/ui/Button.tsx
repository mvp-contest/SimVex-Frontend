interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary: "bg-(--color-accent-blue) text-white hover:opacity-90 shadow-sm",
    secondary: "bg-(--color-button-bg) text-(--color-button-text) hover:bg-slate-200 border border-slate-300",
    danger: "bg-(--color-status-danger-bg) text-(--color-status-danger) border border-(--color-status-danger-border) hover:opacity-80",
    ghost: "bg-transparent text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-card-bg)",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
