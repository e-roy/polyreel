import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { Error, Avatar } from "@/components/elements";
import Link from "next/link";
import { Profile } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";
import { emptyProfile } from "@/lib/empty";

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
    <div className={`rounded-lg bg-stone-50`}>
      <div className={`text-xl font-bold text-stone-800 px-4 py-3`}>
        Who To Follow
      </div>
      <div>
        {profiles &&
          profiles?.map((profile: Profile, index: number) => (
            <Link
              key={index}
              href={`/profile/${profile.handle}`}
              className={`flex items-center justify-between px-4 py-3 hover:bg-stone-100`}
            >
              <div className={`flex items-center w-full`}>
                <Avatar profile={profile} size={`small`} loading={loading} />
                {loading ? (
                  <div className={`ml-4 w-full space-y-2 animate-pulse `}>
                    <div
                      className={`font-bold bg-stone-300 w-3/4 h-3 rounded`}
                    ></div>
                    <div
                      className={`font-bold bg-stone-300 w-3/4 h-3 rounded`}
                    ></div>
                  </div>
                ) : (
                  <div className={`ml-4`}>
                    <div className={`font-bold text-stone-800`}>
                      {profile.name}
                    </div>
                    <div className={`text-stone-500`}>@{profile.handle}</div>
                  </div>
                )}
              </div>
            </Link>
          ))}
      </div>
      <Link href={`/connect`}>
        <div
          className={`hover:bg-stone-100 px-4 py-3 rounded-b-lg text-blue-400`}
        >
          Show more
        </div>
      </Link>
    </div>
  );
};
