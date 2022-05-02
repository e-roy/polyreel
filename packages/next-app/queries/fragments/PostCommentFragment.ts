import { gql } from "@apollo/client";

import { ProfileFragment } from "./ProfileFragment";
import { PostPostFragment } from "./PostPostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostCommentFragment = gql`
  fragment PostCommentFragment on Comment {
    id

    profile {
      ...ProfileFragment
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
    mainPost {
      ... on Post {
        ...PostPostFragment
      }
      ... on Mirror {
        id
        metadata {
          name
          description
          content
          image
          media {
            original {
              url
              width
              height
              size
              mimeType
            }
          }
        }
        profile {
          id
          handle
          picture {
            ... on MediaSet {
              original {
                url
                width
                height
                size
                mimeType
              }
            }
          }
        }
      }
    }
    commentOn {
      ... on Post {
        id
        profile {
          handle
        }
      }
      ... on Comment {
        id
        profile {
          handle
        }
      }
      ... on Mirror {
        id
        profile {
          handle
        }
      }
    }

    stats {
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
    }
    createdAt
    appId
  }
  ${ProfileFragment}
  ${PostPostFragment}
  ${MediaFieldsFragment}
`;
