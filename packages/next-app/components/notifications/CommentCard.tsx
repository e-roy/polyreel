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
    <div className="p-2">
      <div className="flex justify-between mb-2">
        <div className="flex w-full">
          <Link href={`/profile/${item.profile.handle}`}>
            <div className="cursor-pointer">
              <Avatar profile={item.profile} size={"small"} />
            </div>
          </Link>
          <div className={`flex justify-between w-full`}>
            <div className="md:px-2 py-1 my-auto text-stone-800 rounded-xl">
              <div className="my-auto font-semibold text-md flex flex-col">
                <Link
                  className={`hover:underline flex flex-col`}
                  href={`/profile/${item.profile.handle}`}
                >
                  <span>{item.profile.name} </span>
                  <span className={`text-stone-600 text-xs`}>
                    @{item.profile.handle}{" "}
                  </span>
                </Link>

                <span>commented on your post</span>
              </div>
            </div>

            <div className="text-sm text-stone-500 my-auto">
              {cardFormatDate(item.createdAt)}
            </div>
          </div>
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
