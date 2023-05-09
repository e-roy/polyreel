import Link from "next/link";
import { Avatar } from "@/components/elements";
import { cardFormatDate } from "@/utils/formatDate";
import { NewReactionNotification } from "@/types/graphql/generated";

interface INewReactionCardProps {
  item: NewReactionNotification;
}

export const NewReactionCard = ({ item }: INewReactionCardProps) => {
  // console.log("new reaction  ====>", item);
  return (
    <div className="p-2 my-1">
      <div className="flex justify-between mb-2">
        <div className="flex w-full">
          <Link href={`/profile/${item.profile.handle}`}>
            <div className="cursor-pointer">
              <Avatar profile={item.profile} size={"small"} />
            </div>
          </Link>
          <div className={`flex justify-between w-full`}>
            <div className="md:px-2 py-1 my-auto text-stone-800 dark:text-stone-200 rounded-xl">
              <div className="my-auto font-semibold text-md flex flex-col">
                <Link
                  className={`hover:underline flex flex-col`}
                  href={`/profile/${item.profile.handle}`}
                >
                  <span>{item.profile.name} </span>
                  <span
                    className={`text-stone-600 dark:text-stone-400 text-xs`}
                  >
                    @{item.profile.handle}{" "}
                  </span>
                </Link>
              </div>
            </div>

            <div className="text-sm text-stone-500 dark:text-stone-300 my-auto">
              {cardFormatDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <Link href={`/post/${item?.publication?.id}`}>
        <div className={`text-stone-600 dark:text-stone-300 font-medium`}>
          <div>{item.reaction}</div>
          <div>{item.publication.metadata.content}</div>
        </div>
      </Link>
    </div>
  );
};
