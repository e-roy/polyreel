import { gql } from "@apollo/client";

import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";

export const GET_VIDEO_COMMENTS = gql`
  query (
    $request: PublicationsRequest!
    $hasReactedRequest2: PublicationOperationsReactionArgs
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFragment
          operations {
            canComment
            hasReacted(request: $hasReactedRequest2)
          }
        }
        ... on Quote {
          id
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
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
`;
