"use client";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext/UserContext";

import { useQuery } from "@apollo/client";

import { Loading } from "@/components/elements/Loading";
import { Error } from "@/components/elements/Error";

import { Notification } from "@/types/graphql/generated";

import { NotificationCard } from "./NotificationCard";

import { logger } from "@/utils/logger";

import { GET_NOTIFICATIONS } from "../_graphql/get-notifications";

export const NotificationsList = () => {
  const { currentUser } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      request: {},
    },
    skip: !currentUser,
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  if (!data || !data.notifications) return null;

  const { items } = data.notifications;

  logger("NotificationsList.tsx", items);

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
