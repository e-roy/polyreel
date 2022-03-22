import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATION } from "@/queries/publications/get-publication";

import { PublicationCard } from "@/components/cards";

export const GetPublication = () => {
  // const publicationId = "0x032f1a-0x07";
  // const publicationId = "0x5a-0x09";
  const publicationId = "0x12-0x05";
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: publicationId,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center">
        Get Publication from {publicationId}
      </h1>
      <PublicationCard publication={data.publication} />
    </div>
  );
};
