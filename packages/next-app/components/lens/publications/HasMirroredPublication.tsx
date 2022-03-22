import React from "react";
import { useQuery } from "@apollo/client";
import { HAS_MIRRORED } from "@/queries/publications/has-mirrored-publication";

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

export const HasMirroredPublication = () => {
  const { loading, error, data } = useQuery(HAS_MIRRORED, {
    variables: {
      request: profileRequest,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center">
        Has Mirrored Publication
      </h1>
    </div>
  );
};
