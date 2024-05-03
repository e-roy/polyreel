import axios from "axios";
import FormData from "form-data";
import { NextResponse, NextRequest } from "next/server";

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET_KEY;

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
    throw new Error("error.message");
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const ipfsHash = await uploadToIPFS(fileBuffer, file.name);

    return NextResponse.json({ hash: ipfsHash }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    return NextResponse.json(
      { error: "Failed to upload file to IPFS" },
      { status: 500 }
    );
  }
}
