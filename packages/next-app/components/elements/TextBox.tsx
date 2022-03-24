import React, { InputHTMLAttributes, useState } from "react";

export type TextBoxProps = {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export const TextBox: React.FC<TextBoxProps> = (onChange) => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  return (
    <div>
      {/* <textarea
        rows={8}
        className="p-2 shadow-lg block w-full sm:text-sm border border-gray-300 rounded-md resize-none"
        placeholder="you@example.com"
        value={textAreaValue}
        onChange={(e) => {
          onChange(e);
        }}
      /> */}
    </div>
  );
};
