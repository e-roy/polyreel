import { gql } from "@apollo/client";

import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const PostProfileFragment = gql`
  fragment PostProfileFragment on Profile {
    id
    name
    handle
    picture {
      ... on MediaSet {
        original {
          ...MediaFieldsFragment
        }
      }
    }
  }
  ${MediaFieldsFragment}
`;
