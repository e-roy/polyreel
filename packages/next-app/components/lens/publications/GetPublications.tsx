import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";

import { PublicationCard } from "@/components/cards";

type GetPublicationsProps = {
  profileId: string;
};

export const GetPublications = ({
  profileId = "0x12",
}: GetPublicationsProps) => {
  // const profileId = "0x13";
  // const profileId = "0x12";

  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 50,
      },
    },
  });
  console.log("publicactions", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div className="p-2 border rounded">
      <h1 className="text-xl font-bold text-center">
        Get Publications from {profileId}
      </h1>
      <div className="flex flex-wrap">
        {data.publications.items.map((publication: any, index: number) => (
          <div key={index} className="w-1/4 m-2">
            <PublicationCard publication={publication} />
          </div>
        ))}
      </div>
    </div>
  );
};
