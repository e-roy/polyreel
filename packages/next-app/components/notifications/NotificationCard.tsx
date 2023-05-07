import Link from "next/link";
import { Avatar } from "@/components/elements";
import { Stats } from "@/components/post";
import { cardFormatDate } from "@/utils/formatDate";
import { addressShorten } from "@/utils/address-shorten";
import {
  Notification,
  NewMentionNotification,
  NewCollectNotification,
  NewMirrorNotification,
  NewReactionNotification,
} from "@/types/graphql/generated";

import { CommentCard, NewFollowerCard } from "./";

type NotificationCardProps = {
  item: Notification;
};

export const NotificationCard = ({ item }: NotificationCardProps) => {
  if (!item) return null;

  if (item.__typename === "NewCommentNotification") {
    return <CommentCard item={item} />;
  }

  if (item.__typename === "NewMentionNotification") {
    return <NewMentionCard item={item} />;
  }

  if (item.__typename === "NewCollectNotification") {
    return <NewCollectCard item={item} />;
  }

  if (item.__typename === "NewMirrorNotification") {
    return <NewMirrorCard item={item} />;
  }

  if (item.__typename === "NewReactionNotification") {
    return <NewReactionCard item={item} />;
  }

  if (item.__typename === "NewFollowerNotification") {
    return <NewFollowerCard item={item} />;
  } else return <div className="w-16 text-purple-400"></div>;
};

interface INewMentionCardProps {
  item: NewMentionNotification;
}

const NewMentionCard = ({ item }: INewMentionCardProps) => {
  console.log("new mention  ====>", item);
  return <div className="p-2 my-1"></div>;
};

// NewCollectNotification

interface INewCollectCardCardProps {
  item: NewCollectNotification;
}

const NewCollectCard = ({ item }: INewCollectCardCardProps) => {
  console.log("new collect  ====>", item);
  return <div className="p-2 my-1"></div>;
};

//  NewMirrorNotification;

interface INewMirrorCardCardProps {
  item: NewMirrorNotification;
}

const NewMirrorCard = ({ item }: INewMirrorCardCardProps) => {
  console.log("new mirror  ====>", item);
  return <div className="p-2 my-1"></div>;
};

// NewReactionNotification

interface INewReactionCardProps {
  item: NewReactionNotification;
}

const NewReactionCard = ({ item }: INewReactionCardProps) => {
  console.log("new reaction  ====>", item);
  return <div className="p-2 my-1"></div>;
};
