import { gql } from "@apollo/client";

import { PostProfileFragment } from "../fragments/PostProfileFragment";

export const SEARCH_PROFILES = gql`
  query ($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        __typename
        items {
          ... on Profile {
            ...PostProfileFragment
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
  ${PostProfileFragment}
`;
