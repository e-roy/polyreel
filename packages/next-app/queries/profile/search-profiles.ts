import { gql } from "@apollo/client";

import { ProfileFragment } from "../fragments/ProfileFragment";
import { ProfileFragmentLite } from "../fragments/ProfileFragmentLite";

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
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
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
