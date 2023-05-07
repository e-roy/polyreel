import { NewCommentNotification } from "@/types/graphql/generated";
import Link from "next/link";
import { Avatar } from "../elements";
import { cardFormatDate } from "@/utils/formatDate";

interface ICommentCardProps {
  item: NewCommentNotification;
}

export const CommentCard = ({ item }: ICommentCardProps) => {
  // console.log(item);
  return (
    <div className="p-2 my-1 text-sm">
      <div className="flex justify-between mb-2 pr-4">
        <div className="flex">
          <Link href={`/profile/${item.profile.handle}`}>
            <div className="cursor-pointer">
              <Avatar profile={item.profile} size={"small"} />
            </div>
          </Link>
          <Link href={`/post/${item?.comment?.commentOn?.id}`}>
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

      <Link href={`/post/${item?.comment?.commentOn?.id}`}>
        <div className="cursor-pointer font-medium text-stone-700">
          {item.comment.metadata.content}
        </div>
      </Link>
      {/* <Stats publication={item?.comment} /> */}
    </div>
  );
};
