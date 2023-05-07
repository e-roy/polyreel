import { NewFollowerNotification } from "@/types/graphql/generated";
import { Avatar } from "../elements";
import { cardFormatDate } from "@/utils/formatDate";
import { addressShorten } from "@/utils/address-shorten";
import Link from "next/link";

interface INewFollowerCardProps {
  item: NewFollowerNotification;
}

export const NewFollowerCard = ({ item }: INewFollowerCardProps) => {
  return (
    <div className="p-2 my-1">
      {item.wallet.defaultProfile && (
        <div className="flex justify-between mb-2">
          <div className="flex w-full">
            <Link href={`/profile/${item.wallet.defaultProfile.handle}`}>
              <div className="cursor-pointer">
                <Avatar profile={item.wallet.defaultProfile} size={"small"} />
              </div>
            </Link>
            <div className={`flex justify-between w-full`}>
              <div className="md:px-2 py-1 my-auto text-stone-800 rounded-xl">
                <div className="my-auto font-semibold text-md flex flex-col">
                  <Link
                    className={`hover:underline flex flex-col`}
                    href={`/profile/${item.wallet.defaultProfile.handle}`}
                  >
                    <span>{item.wallet.defaultProfile.name} </span>
                    <span className={`text-stone-600 text-xs`}>
                      @{item.wallet.defaultProfile.handle}{" "}
                    </span>
                  </Link>

                  <span>started following you</span>
                </div>
              </div>

              <div className="text-sm text-stone-500 my-auto">
                {cardFormatDate(item.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
      {!item.wallet.defaultProfile && (
        <div className="flex justify-between font-medium text-stone-700 text-sm">
          {addressShorten(item.wallet.address)} started following you
        </div>
      )}
    </div>
  );
};
