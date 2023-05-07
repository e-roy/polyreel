import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  ...props
}) => {
  const btnBase =
    "flex rounded-xl border-2 border-stone-800 rounded-lg shadow-md hover:shadow-xl font-bold text-stone-800 bg-stone-200/80 hover:bg-stone-100/90";

  if (props.disabled)
    return (
      <div
        className={`${btnBase} ${className} w-full border-stone-200/90 shadow-sm hover:shadow-sm text-stone-500/70`}
      >
        <div className="m-[3px]hover:shadow-xl m-auto">{children}</div>
      </div>
    );

  return (
    <button className={`${className} ${btnBase} w-full `} {...props}>
      <div className="m-[3px]hover:shadow-xl m-auto">{children}</div>
    </button>
  );
};
