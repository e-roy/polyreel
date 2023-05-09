// pages/api/ipfs-post.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecretKey = process.env.IPFS_PROJECT_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!projectId || !projectSecretKey) {
    res.status(400).send("IPFS project ID or secret key is not defined.");
    return;
  }

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization:
        "Basic " +
        Buffer.from(projectId + ":" + projectSecretKey).toString("base64"),
    },
  });

  if (req.method === "POST") {
    const payload = req.body;
    const result = await client.add(
      JSON.stringify({
        version: "1.0.0",
        metadata_id: uuidv4(),
        description: payload.description,
        content: payload.content,
        external_url: null,
        image: payload.image || null,
        imageMimeType: payload.imageMimeType || null,
        name: payload.name,
        attributes: payload.attributes || [],
        media: payload.media || [],
        appId: payload.appId || "polyreel.xyz",
      })
    );
    res.status(200).json(result);
  } else {
    res.status(405).send("Method not allowed");
  }
}
