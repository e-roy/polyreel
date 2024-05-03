import { gql } from "@apollo/client/core";

import { QuoteFragment } from "../fragments/QuoteFragment";
import { PostFragment } from "../fragments/PostFragment";
import { CommentFragment } from "../fragments/CommentFragment";

export const GET_PUBLICATIONS = gql`
  query (
    $request: PublicationsRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
        ... on Quote {
          ...QuoteFragment
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
        ... on Mirror {
          id
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
            ... on Quote {
              ...QuoteFragment
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
          operations {
            hasReacted(request: $hasReactedRequest2)
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${QuoteFragment}
  ${CommentFragment}
`;
