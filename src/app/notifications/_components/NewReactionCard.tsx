"use client";

import { ReactionNotification } from "@/types/graphql/generated";
import { Label } from "@/components/ui/label";

interface INewReactionCardProps {
  item: ReactionNotification;
}

export const NewReactionCard = ({ item }: INewReactionCardProps) => {
  console.log("new reaction  ====>", item);

  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Reaction</Label>
      <div className={`flex space-x-4`}></div>
      <div></div>
    </div>
  );
};
