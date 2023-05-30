import { Attribute } from "@/types/graphql/generated";

type uploadIpfsProfileProps = {
  name: string;
  bio: string;
  cover_picture: string;
  attributes: Attribute[];
};

export async function uploadIpfsProfile(payload: uploadIpfsProfileProps) {
  const response = await fetch("/api/ipfs-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error uploading to IPFS: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}
