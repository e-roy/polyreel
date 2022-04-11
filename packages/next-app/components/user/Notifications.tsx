import { useContext } from "react";
import { UserContext } from "@/components/layout";

import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@/queries/notifications/users-notifications";

import { Loading } from "@/components/elements";

import { NotificationCard } from "./";

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
  if (error) return <p>Error :(</p>;
  // console.log(data);
  return (
    <div className="p-2">
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
