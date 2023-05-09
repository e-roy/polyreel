import { useContext } from "react";
import { UserContext } from "@/context";

import { useQuery, gql } from "@apollo/client";

import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";

import { Loading, Error } from "@/components/elements";

import { Notification } from "@/types/graphql/generated";

import { NotificationCard } from "./";

import { logger } from "@/utils/logger";

const GET_NOTIFICATIONS = gql`
  query (
    $request: NotificationRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          __typename
          createdAt
          isFollowedByMe
          wallet {
            address
            defaultProfile {
              ...ProfileFragmentLite
            }
          }
        }
        ... on NewCollectNotification {
          __typename
          createdAt
          collectedPublication {
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
          wallet {
            defaultProfile {
              ...ProfileFragmentLite
            }
            address
          }
        }
        ... on NewCommentNotification {
          __typename
          createdAt
          comment {
            ...PostCommentFragment
          }
          profile {
            ...ProfileFragmentLite
          }
        }
        ... on NewMirrorNotification {
          __typename
          createdAt
          publication {
            ... on Post {
              ...PostPostFragment
            }
            ... on Comment {
              ...PostCommentFragment
            }
          }
          profile {
            ...ProfileFragmentLite
          }
        }
        ... on NewMentionNotification {
          __typename
          createdAt
          mentionPublication {
            ... on Post {
              ...PostPostFragment
            }
            ... on Comment {
              ...PostCommentFragment
            }
          }
        }
        ... on NewReactionNotification {
          notificationId
          createdAt
          profile {
            ...ProfileFragmentLite
          }
          reaction
          publication {
            ... on Post {
              ...PostPostFragment
            }
            ... on Comment {
              ...PostCommentFragment
            }
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFragmentLite}
  ${PostPostFragment}
  ${PostMirrorFragment}
  ${PostCommentFragment}
`;

export const NotificationsList = () => {
  const { currentUser } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      request: {
        profileId: currentUser?.id,
        limit: 25,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
    skip: !currentUser,
  });
  if (error) return <Error />;

  if (!data || !data.notifications) return null;

  const { items } = data.notifications;

  logger("NotificationsList.tsx", data);

  return (
    <div className={`px-2`}>
      <div className={`py-6 px-4`}>
        <h1
          className={`text-2xl font-semibold text-stone-700 dark:text-stone-100`}
        >
          Notifications
        </h1>
      </div>
      {items &&
        items.map((item: Notification, index: number) => (
          <div key={index} className={`border-b px-4`}>
            <NotificationCard item={item} />
          </div>
        ))}
    </div>
  );
};
