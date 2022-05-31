import { useRouter } from "next/router";
import { Avatar } from "@/components/elements";
import { addressHalf } from "@/utils/address-shorten";
import { ExternalLinkIcon } from "@heroicons/react/outline";

export const FollowersCard = ({ profile }: any) => {
  const router = useRouter();
  // console.log(profile);
  if (!profile) return null;
  if (!profile.defaultProfile && !profile.profile)
    return (
      <a
        href={`https://polygonscan.com/address/${profile.address}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <div className="mb-2 p-2 border border-stone-400 shadow rounded w-full text-sm cursor-pointer hover:shadow-xl">
          <div className="flex justify-between mb-2 pr-4">
            <div className="flex">
              <Avatar profile={profile} size={"medium"} />

              <div className="ml-4 px-2 py-1 my-auto text-stone-800  rounded-xl">
                <div className="flex my-auto font-semibold text-sm sm:text-lg">
                  {addressHalf(profile.address || profile.profile.ownedBy)}
                  <ExternalLinkIcon className="h-5 w-5 ml-4 mt-0.5 hover:text-sky-600" />
                </div>
                <div className="my-auto font-semibold text-xs">
                  {addressHalf(profile.address || profile.profile.ownedBy)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    );

  return (
    <div
      className="mb-2 p-2 border border-stone-400 shadow rounded w-full text-sm cursor-pointer hover:shadow-xl"
      onClick={() =>
        router.push(
          `/profile/${profile.defaultProfile.handle || profile.profile.handle}`
        )
      }
    >
      <div className="flex justify-between mb-2 pr-4">
        <div className="flex">
          <Avatar
            profile={profile.defaultProfile || profile.profile}
            size={"medium"}
          />

          <div className="ml-4 px-2 py-1 my-auto text-stone-800  rounded-xl">
            <div className="my-auto font-semibold text-sm sm:text-lg">
              @{profile.defaultProfile?.handle || profile.profile.handle}
            </div>
            <div className="my-auto font-semibold text-xs">
              {profile.defaultProfile?.name || profile.profile?.name}
            </div>
          </div>
        </div>
      </div>
      <div className="font-semibold text-xs">
        Bio :
        <span className="font-normal">
          {profile.defaultProfile?.bio || profile.profile?.bio}
        </span>
      </div>

      <div className="flex text-xs">
        <div className="font-semibold">
          Following :
          <span className="font-normal pl-1">
            {profile.defaultProfile?.stats.totalFollowing ||
              profile.profile?.stats.totalFollowing ||
              0}
          </span>
        </div>
        <div className="font-semibold  ml-4">
          Followers :
          <span className="font-normal pl-1">
            {profile.defaultProfile?.stats.totalFollowers ||
              profile.profile?.stats.totalFollowers ||
              0}
          </span>
        </div>
      </div>
    </div>
  );
};
