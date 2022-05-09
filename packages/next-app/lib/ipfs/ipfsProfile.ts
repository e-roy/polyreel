// import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

// const client = create({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });

import IPFSNetwork from "./IPFSNetwork";
const client = new IPFSNetwork();

type uploadIpfsProfileProps = {
  payload: {
    name: string;
    bio: string;
    location: string;
    cover_picture: string;
    social: any[];
  };
};

export const uploadIpfsProfile = async ({
  payload,
}: uploadIpfsProfileProps) => {
  // console.log("ipfs upload payload", payload);
  const result = await client.add(
    JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      appId: "polyreel.xyz",
      name: payload.name,
      bio: payload.bio,
      location: payload.location,
      cover_picture: payload.cover_picture,
      social: payload.social,
      attributes: [],
    })
  );

  return result;
};
