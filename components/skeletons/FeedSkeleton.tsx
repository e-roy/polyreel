import { Avatar } from "@/components/elements";
import { emptyProfile } from "@/utils/empty";

export const FeedSkeleton = () => {
  const n = 10;

  return (
    <div className="flex flex-col space-y-4">
      {[...Array(n)].map((e, i) => (
        <SkeletonLine key={i} />
      ))}
    </div>
  );
};

const SkeletonLine = () => {
  return (
    <div className={`border-b my-2 sm:p-8 animate-pulse`}>
      <div className={`flex`}>
        <div className={``}>
          <Avatar profile={emptyProfile} size={`small`} loading={true} />
        </div>
        <div className={`flex flex-col w-full ml-6`}>
          <div className={`flex justify-between w-full`}>
            <div className={`flex space-x-2 w-full`}>
              <div className={`bg-stone-300 w-1/5 h-4 rounded`}> </div>
              <div className={`bg-stone-300 w-1/6 h-3 rounded my-0.5`}> </div>
            </div>

            <div className={`justify-right flex content-right w-20`}>
              <div className={`bg-stone-300 w-full h-4 rounded`}> </div>
            </div>
          </div>
          <div className={`my-4`}>
            <div className={`bg-stone-300 w-full h-4 rounded my-2`}> </div>
            <div className={`bg-stone-300 w-full h-4 rounded my-2`}> </div>
            <div className={`bg-stone-300 w-full h-4 rounded my-2`}> </div>
            <div className={`bg-stone-300 w-full h-4 rounded my-2`}> </div>
          </div>
        </div>
      </div>
    </div>
  );
};
