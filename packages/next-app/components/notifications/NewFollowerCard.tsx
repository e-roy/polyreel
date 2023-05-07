import { NewFollowerNotification } from "@/types/graphql/generated";
import { Avatar } from "../elements";
import { cardFormatDate } from "@/utils/formatDate";
import { addressShorten } from "@/utils/address-shorten";

interface INewFollowerCardProps {
  item: NewFollowerNotification;
}

export const NewFollowerCard = ({ item }: INewFollowerCardProps) => {
  return (
    <div className="p-2 my-1">
      {item.wallet.defaultProfile && (
        <div className={`grid grid-cols-8 md:grid-cols-12`}>
          <div className={`col-span-1`}>
            <Avatar profile={item.wallet.defaultProfile} size={`small`} />
          </div>
          <div className={`flex flex-col col-span-7 md:col-span-11`}>
            <div className={`flex`}>
              <span className={`text-stone-700 font-medium`}>
                {item.wallet.defaultProfile.name}
              </span>
              <span
                className={`text-stone-500 font-medium text-xs pl-2 my-auto w-full`}
              >
                @{item?.wallet?.defaultProfile?.handle}
              </span>

              <span
                className={`text-right w-full text-stone-500 text-xs sm:text-sm my-auto`}
              >
                {cardFormatDate(item.createdAt)}
              </span>
            </div>
            <span className={`text-stone-700 font-medium w-full`}>
              started following you
            </span>
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
