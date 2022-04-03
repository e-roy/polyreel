import { gql } from "@apollo/client/core";

import { PostPostFragment } from "../fragments/PostPostFragment";
import { PostCommentFragment } from "../fragments/PostCommentFragment";
import { PostMirrorFragment } from "../fragments/PostMirrorFragment";

export const GET_PUBLICATION = gql`
  query ($request: PublicationQueryRequest!) {
    publication(request: $request) {
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
  }

  ${PostPostFragment}
  ${PostCommentFragment}
  ${PostMirrorFragment}
`;
