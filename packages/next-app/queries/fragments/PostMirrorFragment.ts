import { gql } from "@apollo/client";

import { ProfileFragment } from "./ProfileFragment";
import { PostPostFragment } from "./PostPostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostMirrorFragment = gql`
  fragment PostMirrorFragment on Mirror {
    id

    profile {
      ...ProfileFragment
    }
    mirrorOf {
      ... on Post {
        ...PostPostFragment
        profile {
          ...ProfileFragment
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
          ...ProfileFragment
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
  ${ProfileFragment}
  ${PostPostFragment}
  ${MediaFieldsFragment}
`;
