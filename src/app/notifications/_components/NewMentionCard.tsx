"use client";

import { Avatar } from "@/components/elements/Avatar";
import { MentionNotification } from "@/types/graphql/generated";
import { Label } from "@/components/ui/label";

interface INewMentionCardProps {
  item: MentionNotification;
}

export const NewMentionCard = ({ item }: INewMentionCardProps) => {
  console.log("new mention  ====>", item);

  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Mention</Label>
      <div className={`flex space-x-4`}>
        <Avatar
          profile={item.publication?.by}
          size={"xs"}
          href={`/profile/${item.publication.by.handle?.localName}`}
        />
        <div className={`text-sm`}>
          <div>{item.publication.by.metadata?.displayName}</div>
          <div>@{item.publication.by.handle?.localName}</div>
        </div>
      </div>
      <div>{item.publication.metadata.content}</div>
    </div>
  );
};
