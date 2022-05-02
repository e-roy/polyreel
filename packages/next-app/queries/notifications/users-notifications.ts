import { gql } from "@apollo/client/core";

import { MediaFieldsFragment } from "../fragments/MediaFieldsFragment";
import { ProfileFragment } from "../fragments/ProfileFragment";

export const GET_NOTIFICATIONS = gql`
  query ($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          ...NewFollowerNotificationFields
        }
        ... on NewMirrorNotification {
          ...NewMirrorNotificationFields
        }
        ... on NewCollectNotification {
          ...NewCollectNotificationFields
        }
        ... on NewCommentNotification {
          ...NewCommentNotificationFields
        }
      }
      pageInfo {
        ...CommonPaginatedResultInfo
      }
    }
  }

  fragment CommentWithCommentedPublicationFields on Comment {
    ...CompactComment
    commentOn {
      ... on Post {
        ...CompactPost
      }
      ... on Mirror {
        ...CompactMirror
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  fragment NewFollowerNotificationFields on NewFollowerNotification {
    __typename
    createdAt
    isFollowedByMe
    wallet {
      ...Wallet
    }
  }
  fragment NewCollectNotificationFields on NewCollectNotification {
    __typename
    createdAt
    wallet {
      ...Wallet
    }
    collectedPublication {
      __typename
      ... on Post {
        ...CompactPost
      }
      ... on Mirror {
        ...CompactMirror
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  fragment NewMirrorNotificationFields on NewMirrorNotification {
    __typename
    createdAt
    profile {
      ...ProfileFragment
    }
    publication {
      ... on Post {
        ...CompactPost
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  fragment NewCommentNotificationFields on NewCommentNotification {
    __typename
    createdAt
    profile {
      ...ProfileFragment
    }
    comment {
      ...CommentWithCommentedPublicationFields
    }
  }
  fragment CompactProfile on Profile {
    id
    name
    handle
    picture {
      ...ProfileMediaFields
      ... on MediaSet {
        original {
          ...MediaFieldsFragment
        }
      }
    }
  }
  fragment CompactPublicationStats on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }
  fragment CompactMetadata on MetadataOutput {
    name
    description
    content
    media {
      ...ProfileMediaFields
    }
  }
  fragment CompactPost on Post {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...ProfileFragment
    }
    collectedBy {
      ...Wallet
    }
    createdAt
  }
  fragment CompactMirror on Mirror {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...ProfileFragment
    }
    createdAt
  }
  fragment CompactComment on Comment {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...CompactProfile
    }
    collectedBy {
      ...Wallet
    }
    createdAt
  }
  fragment CommonPaginatedResultInfo on PaginatedResultInfo {
    prev
    next
    totalCount
  }
  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }
  fragment ProfileMediaFields on ProfileMedia {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
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
  }
  fragment Wallet on Wallet {
    address
    defaultProfile {
      ...ProfileFragment
    }
  }
  ${MediaFieldsFragment}
  ${ProfileFragment}
`;
