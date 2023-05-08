import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { Profile } from "@/types/graphql/generated";
import { ProfileItem } from "@/components/connect";

import { logger } from "@/utils/logger";

const SEARCH_PROFILES = gql`
  query ($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        __typename
        items {
          ... on Profile {
            ...ProfileFragmentLite
            stats {
              totalFollowers
              totalFollowing
            }
          }
        }
        pageInfo {
          totalCount
          next
        }
      }
    }
  }
  ${ProfileFragmentLite}
`;

import { Loading, Error } from "@/components/elements";

interface ISearchProfilesListProps {
  search?: string;
}

export const SearchProfilesList = ({ search }: ISearchProfilesListProps) => {
  const { loading, error, data } = useQuery(SEARCH_PROFILES, {
    variables: {
      request: {
        query: search,
        type: "PROFILE",
        limit: 25,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  logger("SearchProfilesList.tsx", data.search);

  return (
    <div className={``}>
      <div className={`text-xl font-bold text-stone-800 px-6 py-3`}>
        Search Profiles
      </div>
      <div className={``}>
        {data.search.items.map((profile: Profile) => (
          <ProfileItem profile={profile} key={profile.id} />
        ))}
      </div>
    </div>
  );
};
