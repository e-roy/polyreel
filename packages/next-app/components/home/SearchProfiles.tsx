import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";

export const SEARCH_PROFILES = gql`
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

import { RecommendCard } from "@/components/cards";
import { Loading, Error } from "@/components/elements";

export type SearchProfilesProps = {
  search?: string;
};

export const SearchProfiles = ({ search }: SearchProfilesProps) => {
  const router = useRouter();

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
  //   console.log(data);

  return (
    <div className="">
      <h1 className="text-xl font-bold text-center text-stone-700 sticky top-0 z-10 bg-white py-2">
        Search Profiles
      </h1>
      <div className="flex flex-wrap">
        {data.search.items.map((profile: any, index: number) => (
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
