// components/media/Image.tsx

import { Media } from "@/types/graphql/generated";

type ImageProps = {
  media: Media;
  alt?: string;
};

const checkImage = (url: string): string => {
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.substring(7)}`;
  }
  return url;
};

export const Image = ({ media, alt }: ImageProps): JSX.Element => {
  return (
    <div className="relative border rounded-lg shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={checkImage(media.url)} alt={alt} className="rounded-lg" />
    </div>
  );
};
