import { gql } from "@apollo/client/core";

import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";
import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";
import { MirrorFragment } from "@/graphql/fragments/MirrorFragment";

export const GET_POST_FEED = gql`
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
          ...MirrorFragment
        }
        # ... on Comment {
        #   ...CommentFragment
        #   commentOn {
        #     ... on Post {
        #       ...PostFragment
        #       operations {
        #         hasReacted(request: $hasReactedRequest2)
        #       }
        #     }
        #     ... on Quote {
        #       ...QuoteFragment
        #       operations {
        #         hasReacted(request: $hasReactedRequest2)
        #       }
        #     }
        #     ... on Comment {
        #       ...CommentFragment
        #       operations {
        #         hasReacted(request: $hasReactedRequest2)
        #       }
        #     }
        #   }
        #   operations {
        #     hasReacted(request: $hasReactedRequest2)
        #   }
        # }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${QuoteFragment}
  ${MirrorFragment}
`;
