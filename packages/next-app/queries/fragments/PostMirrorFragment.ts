import { gql } from "@apollo/client";

import { PostProfileFragment } from "./PostProfileFragment";
import { PostPostFragment } from "./PostPostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostMirrorFragment = gql`
  fragment PostMirrorFragment on Mirror {
    id

    profile {
      ...PostProfileFragment
    }
    mirrorOf {
      ... on Post {
        ...PostPostFragment
        profile {
          ...PostProfileFragment
        }
      }
      ... on Comment {
        id
        mainPost {
          ... on Post {
            id
          }
        }
        profile {
          ...PostProfileFragment
        }
      }
    }

    metadata {
      name
      description
      content
      image
      media {
        original {
          ...MediaFieldsFragment
        }
      }
    }

    stats {
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
    }
    createdAt
  }
  ${PostProfileFragment}
  ${PostPostFragment}
  ${MediaFieldsFragment}
`;
