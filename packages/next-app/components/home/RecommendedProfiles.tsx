import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";

export const RECOMMENDED_PROFILES = gql`
  query {
    recommendedProfiles {
      ...ProfileFragmentLite
      stats {
        totalFollowers
        totalFollowing
      }
    }
  }
  ${ProfileFragmentLite}
`;

import { RecommendCard } from "@/components/cards";
import { Loading, Error } from "@/components/elements";

type RecommendedProfilesProps = {};

export const RecommendedProfiles = ({}: RecommendedProfilesProps) => {
  const router = useRouter();

  const { loading, error, data } = useQuery(RECOMMENDED_PROFILES);

  if (loading) return <Loading />;
  if (error) return <Error />;
  // console.log(data);

  return (
    <div className="overflow-x-hidden">
      <h1 className="text-xl font-bold text-center text-stone-700 dark:text-stone-200 sticky top-0 z-10 py-2">
        Recommended Profiles
      </h1>
      <div className="flex flex-wrap w-full">
        {data.recommendedProfiles.map((profile: any, index: number) => (
          <div
            key={index}
            className="w-full"
            onClick={() => router.push(`/profile/${profile.handle}`)}
          >
            <RecommendCard profile={profile} />
          </div>
        ))}
      </div>
    </div>
  );
};
