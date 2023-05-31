import axios from "axios";
import FormData from "form-data";
import { NextResponse, type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET_KEY;

export const runtime = "nodejs";

const uploadToIPFS = async (
  file: Buffer,
  filename: string
): Promise<string> => {
  const url = "https://ipfs.infura.io:5001/api/v0/add";
  const auth = Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

  // Create a new FormData instance and append the file
  const formData = new FormData();
  formData.append("file", file, filename);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${auth}`,
      },
    });

    // Return the IPFS hash (CID)
    return response.data.Hash;
  } catch (error) {
    throw new Error("error uploading to IPFS");
  }
};

const uploadJSONToIPFS = async (json: object): Promise<string> => {
  // Convert JSON object to a Buffer
  const buffer = Buffer.from(JSON.stringify(json));

  // Upload the buffer to IPFS and get the hash
  return await uploadToIPFS(buffer, "metadata.json");
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    version: "1.0.0",
    metadata_id: uuidv4(),
    description: body.description,
    content: body.content,
    external_url: null,
    image: body.image || null,
    imageMimeType: body.imageMimeType || null,
    name: body.name,
    attributes: body.attributes || [],
    media: body.media || [],
    appId: body.appId || "polyreel.xyz",
  };

  // const file = request.body.file;
  // const file = null;

  // if (!file) {
  //   return {
  //     status: 400,
  //     body: { error: "Missing file" },
  //   };
  // }

  try {
    // const ipfsHash = await uploadToIPFS(file, "filename.ext");
    const ipfsHash = await uploadJSONToIPFS(data);

    return NextResponse.json({
      hash: ipfsHash,
    });
  } catch (error) {
    return {
      status: 500,
      body: { error: error },
    };
  }
}
