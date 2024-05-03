"use client";
// search/_components/SearchProfilesList.tsx

import { useQuery, gql } from "@apollo/client";
import { Error } from "@/components/elements/Error";
import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";
import { Profile } from "@/types/graphql/generated";
import { ProfileItem } from "@/components/profile/ProfileItem";
import { ConnectSkeleton } from "@/components/skeletons/ConnectSkeleton";

import { logger } from "@/utils/logger";

const SEARCH_PROFILES = gql`
  query ($request: ProfileSearchRequest!) {
    searchProfiles(request: $request) {
      items {
        ...ProfileFragmentLite
      }

      pageInfo {
        next
        prev
      }
    }
  }
  ${ProfileFragmentLite}
`;

interface ISearchProfilesListProps {
  search?: string;
}
export const SearchProfilesList = ({ search }: ISearchProfilesListProps) => {
  const { loading, error, data } = useQuery(SEARCH_PROFILES, {
    variables: {
      request: {
        query: search,
        limit: "TwentyFive",
        where: {
          customFilters: ["GARDENERS"],
        },
      },
    },
    skip: !search,
  });

  if (error) return <Error />;

  if (data) logger("SearchProfilesList.tsx", data.search);

  return (
    <div className={``}>
      <div
        className={`text-xl font-bold text-stone-800 dark:text-stone-100 px-6 py-3`}
      >
        Search Profiles
      </div>
      <div className={``}>
        {data?.search?.items.map((profile: Profile) => (
          <ProfileItem profile={profile} key={profile.id} />
        ))}
        {loading && <ConnectSkeleton />}
      </div>
    </div>
  );
};
