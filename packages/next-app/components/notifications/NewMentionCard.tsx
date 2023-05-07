import Link from "next/link";
import { Avatar } from "@/components/elements";
import { cardFormatDate } from "@/utils/formatDate";
import { NewMentionNotification } from "@/types/graphql/generated";

interface INewMentionCardProps {
  item: NewMentionNotification;
}

export const NewMentionCard = ({ item }: INewMentionCardProps) => {
  //   console.log("new mention  ====>", item);
  return (
    <div className="p-2 my-1">
      <div className="flex justify-between mb-2">
        <div className="flex w-full">
          <Link href={`/profile/${item.mentionPublication.profile.handle}`}>
            <div className="cursor-pointer">
              <Avatar
                profile={item.mentionPublication.profile}
                size={"small"}
              />
            </div>
          </Link>
          <div className={`flex justify-between w-full`}>
            <div className="md:px-2 py-1 my-auto text-stone-800 rounded-xl">
              <div className="my-auto font-semibold text-md flex flex-col">
                <Link
                  className={`hover:underline flex flex-col`}
                  href={`/profile/${item.mentionPublication.profile.handle}`}
                >
                  <span>{item.mentionPublication.profile.name} </span>
                  <span className={`text-stone-600 text-xs`}>
                    @{item.mentionPublication.profile.handle}{" "}
                  </span>
                </Link>
              </div>
            </div>

            <div className="text-sm text-stone-500 my-auto">
              {cardFormatDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <Link href={`/post/${item?.mentionPublication?.id}`}>
        <span className={`text-stone-600 font-medium`}>
          {item.mentionPublication.metadata.content}
        </span>
      </Link>
    </div>
  );
};
