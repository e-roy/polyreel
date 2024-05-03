import { gql } from "@apollo/client";

import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";
import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";

export const GET_PUBLICATION = gql`
  query (
    $request: PublicationRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFragment
        operations {
          canComment
          hasReacted(request: $hasReactedRequest2)
        }
      }
      ... on Quote {
        ...QuoteFragment
        operations {
          canComment
          hasReacted(request: $hasReactedRequest2)
        }
      }
      ... on Mirror {
        id
      }
      ... on Comment {
        ...CommentFragment
        operations {
          canComment
          hasReacted(request: $hasReactedRequest2)
        }
        commentOn {
          ... on Post {
            ...PostFragment
            operations {
              canComment
              hasReacted(request: $hasReactedRequest2)
            }
          }
        }
      }
    }
  }

  ${PostFragment}
  ${QuoteFragment}
  ${CommentFragment}
`;
