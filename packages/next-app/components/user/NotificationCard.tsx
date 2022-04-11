import Link from "next/link";
import { Avatar } from "@/components/elements";
import { Stats } from "@/components/post";
import { cardFormatDate } from "@/utils/formatDate";
import { addressShorten } from "@/utils/address-shorten";

type NotificationCardProps = {
  item: any;
};

export const NotificationCard = ({ item }: NotificationCardProps) => {
  if (!item) return null;

  if (item.__typename === "NewCommentNotification") {
    return <CommentCard item={item} />;
  }

  if (item.__typename === "NewFollowerNotification") {
    return <NewFollowerCard item={item} />;
  } else return <div className="w-16 text-purple-400"></div>;
};

const CommentCard = ({ item }: NotificationCardProps) => {
  console.log(item);
  return (
    <div className="border p-2 my-1 rounded-xl">
      <div className="flex justify-between mb-2 pr-4">
        <div className="flex">
          <Link href={`/profile/${item.profile.handle}`}>
            <div className="cursor-pointer">
              <Avatar profile={item.profile} size={"small"} />
            </div>
          </Link>
          <Link href={`/post/${item.comment.commentOn.id}`}>
            <div className="w-64 md:w-5/6 md:ml-4 md:px-2 py-1 my-auto text-stone-800 rounded-xl cursor-pointer">
              <div className="my-auto font-semibold text-md">
                @{item.profile.handle} commented on your post
              </div>
              <div className="text-sm font-medium text-stone-600">
                at {cardFormatDate(item.createdAt)}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Link href={`/post/${item.comment.commentOn.id}`}>
        <div className="cursor-pointer font-medium text-stone-700">
          {item.comment.metadata.content}
        </div>
      </Link>
      <Stats publication={item.comment} />
    </div>
  );
};

const NewFollowerCard = ({ item }: NotificationCardProps) => {
  return (
    <div className="border p-2 my-1 rounded-xl">
      <div className="flex justify-between font-medium text-stone-700">
        <div className="flex">
          <Avatar profile={item.profile} size={"small"} />
          <span className="ml-2 my-auto">
            {addressShorten(item.wallet.address)} started following you
          </span>
        </div>

        <div className="text-sm">at {cardFormatDate(item.createdAt)}</div>
      </div>
    </div>
  );
};
