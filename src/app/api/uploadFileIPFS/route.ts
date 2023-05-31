import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import FormData from "form-data";
import { NextResponse, type NextRequest } from "next/server";

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

// eslint-disable-next-line import/no-anonymous-default-export
export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: "Hello from the serverless function!",
  });
  // const file = req.body.file;

  // if (!file) {
  //   res.status(400).json({ error: "Missing file" });
  //   return;
  // }

  // try {
  //   const ipfsHash = await uploadToIPFS(file, "filename.ext");
  //   res.status(200).json({ hash: ipfsHash });
  // } catch (error) {
  //   res.status(500).json({ error: "error.message" });
  // }
}
