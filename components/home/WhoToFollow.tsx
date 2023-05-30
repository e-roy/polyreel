import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";
import { Error, Avatar } from "@/components/elements";
import Link from "next/link";
import { Profile } from "@/types/graphql/generated";
import { useRouter } from "next/router";

import { logger } from "@/utils/logger";
import { emptyProfile } from "@/utils/empty";

const RECOMMENDED_PROFILES = gql`
  query ($options: RecommendedProfileOptions) {
    recommendedProfiles(options: $options) {
      ...ProfileFragmentLite
      stats {
        totalFollowers
        totalFollowing
      }
    }
  }
  ${ProfileFragmentLite}
`;

interface IWhoToFollowProps {}

export const WhoToFollow = ({}: IWhoToFollowProps) => {
  const router = useRouter();
  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES, {
    variables: {
      options: {
        shuffle: true,
        disableML: true,
      },
    },
  });

  if (error) return <Error />;

  let profiles: Profile[];
  profiles = data
    ? data?.recommendedProfiles.slice(0, 3)
    : [{ ...emptyProfile }, { ...emptyProfile }, { ...emptyProfile }];

  if (data) logger("WhoToFollow.tsx", data.recommendedProfiles);

  return (
    <div
      className={`rounded-lg bg-stone-50 dark:bg-transparent dark:border dark:border-stone-300/50 dark:shadow-md dark:shadow-stone-100/30`}
    >
      <div
        className={`text-xl font-bold text-stone-800 dark:text-stone-100 px-4 py-3`}
      >
        Who To Follow
      </div>
      <div>
        {profiles &&
          profiles?.map((profile: Profile, index: number) => (
            <div
              key={index}
              role="link"
              tabIndex={0}
              aria-label={`Profile of ${profile?.name}`}
              onClick={() => router.push(`/profile/${profile?.handle}`)}
              className={`flex items-center px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer`}
            >
              <Avatar
                profile={profile}
                size={`small`}
                loading={loading}
                href={`/profile/${profile.handle}`}
              />
              {loading ? (
                <div className={`ml-4 w-full space-y-4 animate-pulse `}>
                  <div
                    className={`font-bold bg-stone-300 w-3/4 h-4 rounded`}
                  ></div>
                  <div
                    className={`font-bold bg-stone-300 w-3/4 h-4 rounded`}
                  ></div>
                </div>
              ) : (
                <div className={`ml-4`}>
                  <div
                    className={`font-bold text-stone-800 dark:text-stone-100`}
                  >
                    {profile.name}
                  </div>
                  <div className={`text-stone-500 dark:text-stone-300`}>
                    @{profile.handle}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
      <Link href={`/connect`}>
        <div
          className={`hover:bg-stone-100 dark:hover:bg-stone-700 px-4 py-3 rounded-b-lg text-blue-400`}
        >
          Show more
        </div>
      </Link>
    </div>
  );
};
