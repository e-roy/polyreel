import { useState } from "react";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

interface IAddEmojiProps {
  onSelect: (emoji: string) => void;
}

export const AddEmoji = ({ onSelect }: IAddEmojiProps) => {
  const [emojiSelect, setEmojiSelect] = useState(false);

  const onEmojiClick = (event: any, emojiObject: any) => {
    setEmojiSelect(!emojiSelect);
    onSelect(emojiObject.emoji);
  };

  return (
    <div className="">
      <Picker
        onEmojiClick={onEmojiClick}
        // pickerStyle={{ marginTop: "0px", left: "40px" }}
      />
    </div>
  );
};
