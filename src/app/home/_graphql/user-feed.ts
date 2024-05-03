import { gql } from "@apollo/client";

import { PostFragment } from "@/graphql/fragments/PostFragment";
import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";
import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";

export const GET_USER_FEED = gql`
  query (
    $request: FeedRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    feed(request: $request) {
      items {
        id
        root {
          ... on Post {
            ...PostFragment
            operations {
              hasReacted(request: $hasReactedRequest2)
            }
          }
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
          ... on Quote {
            ...QuoteFragment
            operations {
              hasReacted(request: $hasReactedRequest2)
            }
          }
        }
        comments {
          id
          by {
            ...ProfileFragmentLite
          }
        }
      }
      pageInfo {
        next
        prev
      }
    }
  }
  ${PostFragment}
  ${QuoteFragment}
  ${CommentFragment}
  ${ProfileFragmentLite}
`;
