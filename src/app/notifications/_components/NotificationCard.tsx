"use client";

import {
  Notification,
  QuoteNotification,
  MirrorNotification,
  ActedNotification,
} from "@/types/graphql/generated";

import { NewCommentCard } from "./NewCommentCard";
import { NewFollowerCard } from "./NewFollowerCard";
import { NewMentionCard } from "./NewMentionCard";
import { NewReactionCard } from "./NewReactionCard";
import { Label } from "@/components/ui/label";

type NotificationCardProps = {
  item: Notification;
};

export const NotificationCard = ({ item }: NotificationCardProps) => {
  if (!item) return null;

  if (item.__typename === "CommentNotification") {
    return <NewCommentCard item={item} />;
  }

  if (item.__typename === "MentionNotification") {
    return <NewMentionCard item={item} />;
  }

  if (item.__typename === "QuoteNotification") {
    return <NewQuoteCard item={item} />;
  }

  if (item.__typename === "MirrorNotification") {
    return <NewMirrorCard item={item} />;
  }

  if (item.__typename === "ReactionNotification") {
    return <NewReactionCard item={item} />;
  }

  if (item.__typename === "ActedNotification") {
    return <NewActedCard item={item} />;
  }

  if (item.__typename === "FollowNotification") {
    return <NewFollowerCard item={item} />;
  } else
    return <div className="w-16 text-purple-400">unknown notification</div>;
};

// NewQuoteNotification

interface INewQuoteCardCardProps {
  item: QuoteNotification;
}

const NewQuoteCard = ({ item }: INewQuoteCardCardProps) => {
  console.log("new collect  ====>", item);
  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Quote</Label>
      <div className={`flex space-x-4`}>
        <div className={`text-sm`}></div>
      </div>
      <div></div>
    </div>
  );
};

//  NewMirrorNotification;

interface INewMirrorCardCardProps {
  item: MirrorNotification;
}

const NewMirrorCard = ({ item }: INewMirrorCardCardProps) => {
  console.log("new mirror  ====>", item);
  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Mirror</Label>
      <div className={`flex space-x-4`}>
        <div className={`text-sm`}></div>
      </div>
      <div></div>
    </div>
  );
};

// NewActedCard

interface INewActedCardProps {
  item: ActedNotification;
}

const NewActedCard = ({ item }: INewActedCardProps) => {
  console.log("new acted  ====>", item);
  return (
    <div className={`flex flex-col space-y-2 py-2`}>
      <Label>New Acted</Label>
      <div className={`flex space-x-4`}>
        <div className={`text-sm`}></div>
      </div>
      <div></div>
    </div>
  );
};
