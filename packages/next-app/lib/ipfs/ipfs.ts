import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export const uploadIpfs = async (payload: any) => {
  console.log("ipfs upload payload", payload);
  const result = await client.add(
    JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: payload.description,
      content: payload.content,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: payload.name,
      attributes: [],
      media: [
        // {
        //   item: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Gfp-far-landscape-view.jpg",
        //   type: "image/jpeg",
        // },
      ],
      appId: "testAPP",
    })
  );

  // console.log("upload result ipfs", result);
  return result;
};
