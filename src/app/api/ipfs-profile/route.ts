import axios from "axios";
import FormData from "form-data";
import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { jsonResponse } from "@/lib/server-helpers/json-response";

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET_KEY;

export const runtime = "nodejs";

interface MetadataAttributes {
  trait_type: string;
  value: string;
}

interface MetadataJSON {
  version: string;
  metadata_id: string;
  appId: string;
  name: string;
  bio: string;
  cover_picture: string | null;
  attributes: MetadataAttributes[];
}

const uploadToIPFS = async (
  file: Buffer,
  filename: string
): Promise<string> => {
  const url = "https://ipfs.infura.io:5001/api/v0/add";
  const auth = Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

  const formData = new FormData();
  formData.append("file", file, filename);

  try {
    const response = await axios.post<{ Hash: string }>(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.Hash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Error uploading to IPFS");
  }
};

const uploadJSONToIPFS = async (json: MetadataJSON): Promise<string> => {
  const buffer = Buffer.from(JSON.stringify(json));
  return await uploadToIPFS(buffer, "metadata.json");
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data: MetadataJSON = {
      version: "1.0.0",
      metadata_id: uuidv4(),
      appId: body.appId || "polyreel.xyz",
      name: body.name,
      bio: body.bio,
      cover_picture: body.cover_picture || null,
      attributes: body.attributes || [],
    };

    const ipfsHash = await uploadJSONToIPFS(data);

    return jsonResponse({ hash: ipfsHash }, 200);
  } catch (error) {
    return jsonResponse({ error: "Error processing IPFS" }, 500);
  }
}
