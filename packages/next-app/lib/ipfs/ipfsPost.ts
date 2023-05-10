// description: payload.description,
// content: payload.content,
// external_url: null,
// image: payload.image || null,
// imageMimeType: payload.imageMimeType || null,
// name: payload.name,
// attributes: payload.attributes || [],
// media: payload.media || [],

type uploadIpfsPostProps = {
  name: string;
  description: string;
  content: string;
  image: string | null;
  imageMimeType: any | null;
  attributes: any[];
  media: any[];
};

export async function uploadIpfsPost(payload: uploadIpfsPostProps) {
  const response = await fetch("/api/ipfs-post", {
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
