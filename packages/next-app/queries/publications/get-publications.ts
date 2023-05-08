import { gql } from "@apollo/client/core";

import { PostPostFragment } from "../fragments/PostPostFragment";
import { PostCommentFragment } from "../fragments/PostCommentFragment";
import { PostMirrorFragment } from "../fragments/PostMirrorFragment";

export const GET_PUBLICATIONS = gql`
  query (
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostPostFragment
        }
        ... on Comment {
          ...PostCommentFragment
        }
        ... on Mirror {
          ...PostMirrorFragment
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostPostFragment}
  ${PostCommentFragment}
  ${PostMirrorFragment}
`;
