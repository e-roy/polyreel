import React from "react";
import { useQuery } from "@apollo/client";
import { CREATE_MIRROR_TYPED_DATA } from "@/queries/publications/mirror";

import { Loading } from "@/components/elements";

const profileRequest = [
  {
    profileId: "0x032f1a",
    publicationIds: ["0x032f1a-0x02"],
  },
  {
    profileId: "0x05",
    publicationIds: ["0x032e32-0x01"],
  },
];

export const Mirror = () => {
  const { loading, error, data } = useQuery(CREATE_MIRROR_TYPED_DATA, {
    variables: {
      request: profileRequest,
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center">Mirror</h1>
    </div>
  );
};
