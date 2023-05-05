import { useContext } from "react";
import { UserContext } from "@/context";

import { useQuery, gql } from "@apollo/client";

import { ProfileFragmentLite } from "@/queries/fragments/ProfileFragmentLite";
import { PostPostFragment } from "@/queries/fragments/PostPostFragment";
import { PostMirrorFragment } from "@/queries/fragments/PostMirrorFragment";
import { PostCommentFragment } from "@/queries/fragments/PostCommentFragment";

import { Loading, Error } from "@/components/elements";

import { NotificationCard } from "./";

import { logger } from "@/utils/logger";

const GET_NOTIFICATIONS = gql`
  query ($request: NotificationRequest!) {
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

export const Notifications = () => {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) return <Loading />;
  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      request: {
        profileId: currentUser?.id,
        limit: 25,
      },
    },
  });
  if (loading) return <Loading />;
  if (error) return <Error />;

  logger("Notifications.tsx", data);

  return (
    <div className="py-2">
      {data.notifications &&
        data.notifications.items &&
        data.notifications.items.map((item: any, index: number) => (
          <div key={index}>
            <NotificationCard item={item} />
          </div>
        ))}
    </div>
  );
};
