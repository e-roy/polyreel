import React from "react";
import { useQuery } from "@apollo/client";
import { HAS_COLLECTED } from "@/queries/publications/has-collected-publication";
import { Loading } from "@/components/elements";

export const HasCollectedPublication = () => {
  const { loading, error, data } = useQuery(HAS_COLLECTED, {
    variables: {
      request: {
        walletAddress: "0x109eCbC12836F7Dd63255254fa973d21425819aE",
        publicationIds: ["0x032f1a-0x02", "0x17-0x01"],
      },
    },
  });
  console.log(error);
  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center">
        Get Collected Publication
      </h1>
    </div>
  );
};
