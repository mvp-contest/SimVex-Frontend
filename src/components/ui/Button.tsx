interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-2 rounded-md text-[22px] font-semibold transition-opacity hover:opacity-90";
  
  const variantStyles = {
    primary: "bg-(--color-button-bg) text-(--color-button-text)",
    secondary: "bg-transparent text-(--color-text-primary) hover:bg-(--color-card-bg)",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
