import { gql } from "@apollo/client/core";

import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";
import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";

export const GET_REPLY_FEED = gql`
  query (
    $request: PublicationsRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFragment
          commentOn {
            ... on Post {
              ...PostFragment
              operations {
                hasReacted(request: $hasReactedRequest2)
              }
            }
            ... on Comment {
              ...CommentFragment
              operations {
                hasReacted(request: $hasReactedRequest2)
              }
            }
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
`;
