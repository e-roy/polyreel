import { gql } from "@apollo/client";

import { ProfileFragment } from "../fragments/ProfileFragment";

export const SEARCH_PROFILES = gql`
  query ($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        __typename
        items {
          ... on Profile {
            ...ProfileFragment
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
  ${ProfileFragment}
`;
