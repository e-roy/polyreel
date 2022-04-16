import { gql } from "@apollo/client";

import { PostPostFragment } from "../fragments/PostPostFragment";
import { PostCommentFragment } from "../fragments/PostCommentFragment";

export const SEARCH_PUBLICATIONS = gql`
  query ($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on PublicationSearchResult {
        __typename
        items {
          ... on Post {
            ...PostPostFragment
          }
          ... on Comment {
            ...PostCommentFragment
          }
        }
      }
    }
  }
  ${PostPostFragment}
  ${PostCommentFragment}
`;
