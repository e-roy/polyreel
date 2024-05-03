import { gql } from "@apollo/client";

import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";

export const SEARCH_PUBLICATIONS = gql`
  query ($request: PublicationSearchRequest!) {
    searchPublications(request: $request) {
      items {
        ... on Post {
          ...PostFragment
        }
        ... on Comment {
          ...CommentFragment
        }
      }
      pageInfo {
        next
        prev
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
`;
