import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";
import { PostFragment } from "@/graphql/fragments/PostFragment";
import { CommentFragment } from "@/graphql/fragments/CommentFragment";
import { QuoteFragment } from "@/graphql/fragments/QuoteFragment";

export const GET_NOTIFICATIONS = gql`
  query ($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on ReactionNotification {
          id
          reactions {
            reactions {
              reaction
              reactedAt
            }
            profile {
              id
            }
          }
          publication {
            ... on Post {
              ...PostFragment
            }
          }
        }
        ... on CommentNotification {
          id
          comment {
            ...CommentFragment
          }
        }
        ... on MirrorNotification {
          id
          mirrors {
            mirrorId
          }
          publication {
            ... on Post {
              ...PostFragment
            }
          }
        }
        ... on QuoteNotification {
          id
          quote {
            ...QuoteFragment
          }
        }
        ... on ActedNotification {
          id
          actions {
            actedAt
          }
          publication {
            ... on Post {
              ...PostFragment
            }
          }
        }
        ... on FollowNotification {
          id
          followers {
            ...ProfileFragmentLite
          }
        }
        ... on MentionNotification {
          id
          publication {
            ... on Post {
              ...PostFragment
            }
            ... on Comment {
              ...CommentFragment
            }
            ... on Quote {
              ...QuoteFragment
            }
          }
        }
      }
      pageInfo {
        next
        prev
      }
    }
  }
  ${ProfileFragmentLite}
  ${PostFragment}
  ${CommentFragment}
  ${QuoteFragment}
`;
