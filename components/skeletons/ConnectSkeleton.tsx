import { Avatar } from "@/components/elements";
import { emptyProfile } from "@/utils/empty";

export const ConnectSkeleton = () => {
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
    <div className={`border-b my-2 p-6 animate-pulse`}>
      <div className={`flex`}>
        <div className={``}>
          <Avatar profile={emptyProfile} size={`small`} loading={true} />
        </div>
        <div className={`flex flex-col w-full ml-4 space-y-2`}>
          <div className={`bg-stone-300 w-1/5 h-4 rounded`}> </div>
          <div className={`bg-stone-300 w-1/6 h-3 rounded my-0.5`}> </div>
          <div className={`space-y-2`}>
            <div className={`bg-stone-300 w-5/6 h-3 rounded my-0.5`}> </div>
            <div className={`bg-stone-300 w-5/6 h-3 rounded my-0.5`}> </div>
          </div>
        </div>
      </div>
    </div>
  );
};
