import { useRouter } from "next/router";
import { TwitterIcon, WebIcon } from "@/icons";

export const FollowersCard = ({ profile }: any) => {
  const router = useRouter();
  if (!profile) return null;
  return (
    <div
      className="mb-2 p-2 border border-stone-400 shadow rounded w-full text-sm cursor-pointer hover:shadow-xl"
      onClick={() => router.push(`/profile/${profile.handle}`)}
    >
      <div className="flex justify-between mb-2 pr-4">
        <div className="flex">
          {profile.picture ? (
            <div className="h-8 w-8 sm:h-12 sm:w-12 relative rounded-full border-2 cursor-pointer">
              <img
                src={profile.picture.original.url}
                alt=""
                className="rounded-full h-8 sm:h-12"
              />
            </div>
          ) : (
            <div className="rounded-full h-8 w-8 sm:h-12 sm:w-12 bg-gray-300 border-2"></div>
          )}
          <div className="ml-4 px-2 py-1 my-auto text-stone-800  rounded-xl">
            <div className="my-auto font-semibold text-sm sm:text-lg">
              @{profile.handle}
            </div>
            <div className="my-auto font-semibold text-xs">{profile.name}</div>
          </div>
        </div>
        <div>
          <div className="my-2 flex space-x-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer noopener"
              >
                <WebIcon size={20} />
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <TwitterIcon size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="font-semibold text-xs">
        Bio :<span className="font-normal">{profile.bio}</span>
      </div>

      <div className="flex text-xs">
        <div className="font-semibold">
          Following :
          <span className="font-normal pl-1">
            {profile.stats.totalFollowing}
          </span>
        </div>
        <div className="font-semibold  ml-4">
          Followers :
          <span className="font-normal pl-1">
            {profile.stats.totalFollowers}
          </span>
        </div>
      </div>
    </div>
  );
};
