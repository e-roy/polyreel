// pages/api/ipfs-profile.ts

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
        appId: "polyreel.xyz",
        name: payload.name,
        bio: payload.bio,
        cover_picture: payload.cover_picture || null,
        attributes: payload.attributes || [],
      })
    );
    res.status(200).json(result);
  } else {
    res.status(405).send("Method not allowed");
  }
}
