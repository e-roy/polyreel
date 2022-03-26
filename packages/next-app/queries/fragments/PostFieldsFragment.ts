import { gql } from "@apollo/client";

export const PostFieldsFragment = gql`
  fragment PostFieldsFragment on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
    }
    metadata {
      name
      description
      content
      media {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
      attributes {
        displayType
        traitType
        value
      }
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }
`;
