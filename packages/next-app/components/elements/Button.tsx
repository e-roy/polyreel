import React, { ButtonHTMLAttributes } from "react";

export type ButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  className = "",
  type,
  disabled,
  onClick,
  children,
}) => {
  const btnBase =
    "flex rounded-xl border border-stone-600 rounded-lg shadow-md hover:shadow-xl font-medium text-stone-700 bg-stone-200/80 hover:bg-stone-100/90";

  if (disabled)
    return (
      <div
        className={`${btnBase} ${className} w-full border-stone-200/90 shadow-sm hover:shadow-sm text-stone-500/70`}
      >
        <div className="m-[3px]hover:shadow-xl mx-auto">{children}</div>
      </div>
    );

  return (
    <button
      className={`${className} ${btnBase} w-full `}
      type={type}
      onClick={onClick}
    >
      <div className="m-[3px]hover:shadow-xl mx-auto">{children}</div>
    </button>
  );
};
