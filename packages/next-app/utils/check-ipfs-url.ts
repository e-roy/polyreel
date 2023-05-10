export const checkIpfsUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith("ipfs://")) {
    const ipfs = url.replace("ipfs://", "");
    return `https://gateway.ipfscdn.io/ipfs/${ipfs}`;
  } else return url;
};
