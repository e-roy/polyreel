import { useState } from "react";
import dynamic from "next/dynamic";

type AddEmojiProps = {
  onSelect: (emoji: string) => void;
};

export const AddEmoji = ({ onSelect }: AddEmojiProps) => {
  const [emojiSelect, setEmojiSelect] = useState(false);

  const Picker = dynamic(() => import("emoji-picker-react"), {
    ssr: false,
  });

  const onEmojiClick = (event: any, emojiObject: any) => {
    setEmojiSelect(!emojiSelect);
    onSelect(emojiObject.emoji);
  };

  return (
    <div className="">
      <Picker
        onEmojiClick={onEmojiClick}
        pickerStyle={{ marginTop: "0px", left: "40px" }}
      />
    </div>
  );
};
