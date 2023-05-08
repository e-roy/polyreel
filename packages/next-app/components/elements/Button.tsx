import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "follow" | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  ...props
}) => {
  const btnClass = (() => {
    switch (props.variant) {
      case "follow":
        return "flex rounded-full border border-stone-500 shadow-lg hover:shadow-none font-semibold uppercase text-stone-700 py-1 px-4";
      default:
        return "flex rounded-xl border-2 border-stone-800 rounded-lg shadow-md hover:shadow-xl font-bold text-stone-800 bg-stone-200/80 hover:bg-stone-100/90 w-full border-stone-200/90 shadow-sm hover:shadow-sm text-stone-500/70";
    }
  })();

  if (props.disabled)
    return <div className={`${btnClass} ${className}`}>{children}</div>;

  return (
    <button className={`${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
