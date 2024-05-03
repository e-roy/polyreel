// components/media/ImageDisplay.tsx

import { Image as Media } from "@/types/graphql/generated";

type ImageDisplayProps = {
  media: Media;
  alt?: string;
};

const checkImage = (url: string): string => {
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.substring(7)}`;
  }
  return url;
};

export const ImageDisplay = ({
  media,
  alt,
}: ImageDisplayProps): JSX.Element => {
  return (
    <div className="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={checkImage(media.uri)}
        alt={alt}
        className="rounded-lg max-h-[80vh] mx-auto"
      />
    </div>
  );
};
