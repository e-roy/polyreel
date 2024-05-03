"use client";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

import { useQuery } from "@apollo/client";

import { Loading } from "@/components/elements/Loading";
import { ErrorComponent } from "@/components/elements/ErrorComponent";

import { Notification } from "@/types/graphql/generated";

import { NotificationCard } from "./NotificationCard";

import { logger } from "@/utils/logger";

import { GET_NOTIFICATIONS } from "../_graphql/get-notifications";

export const NotificationsList = () => {
  const { currentUser } = useContext(UserContext);
  const { loading, error, data } = useQuery<{
    notifications: { items: Notification[] };
  }>(GET_NOTIFICATIONS, {
    variables: {
      request: {},
    },
    skip: !currentUser,
  });

  if (loading) return <Loading />;
  if (error) return <ErrorComponent />;

  const items = data?.notifications?.items;

  if (!items) return null;

  logger("NotificationsList.tsx", items);

  return (
    <div className="px-2">
      <div className="py-6 px-4">
        <h1 className="text-2xl font-semibold text-stone-700 dark:text-stone-100">
          Notifications
        </h1>
      </div>
      {items.map((item, index) => (
        <div key={item.id || index} className="border-b px-4">
          <NotificationCard item={item} />
        </div>
      ))}
    </div>
  );
};
