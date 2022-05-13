import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

type uploadIpfsProfileProps = {
  payload: {
    name: string;
    bio: string;
    cover_picture: string;
    attributes: any[];
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
      cover_picture: payload.cover_picture || null,
      attributes: payload.attributes || [],
    })
  );

  return result;
};
