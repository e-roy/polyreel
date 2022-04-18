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

      //   description: payload.description,
      //   content: payload.content,
      //   external_url: null,
      //   image: payload.media.length > 0 ? payload.media[0]?.item : null,
      //   imageMimeType: payload.media.length > 0 ? payload.media[0]?.type : null,
      //   name: payload.name,
      //   media: payload.media || [],
    })
  );

  // console.log("upload result ipfs", result);
  return result;
};
