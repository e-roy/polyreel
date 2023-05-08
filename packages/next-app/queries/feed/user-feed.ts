import { gql } from "@apollo/client";

import { PostPostFragment } from "../fragments/PostPostFragment";
import { PostCommentFragment } from "../fragments/PostCommentFragment";

export const GET_USER_FEED = gql`
  query (
    $request: FeedRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    feed(request: $request) {
      items {
        collects {
          profile {
            id
            handle
          }
          timestamp
        }
        root {
          ... on Post {
            ...PostPostFragment
          }
          ... on Comment {
            ...PostCommentFragment
          }
        }
      }
      pageInfo {
        next
        prev
      }
    }
  }
  ${PostPostFragment}
  ${PostCommentFragment}
`;
