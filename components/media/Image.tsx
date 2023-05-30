import { Media } from "@/types/graphql/generated";

type ImageProps = {
  media: Media;
  alt?: string;
};

export const Image = ({ media, alt }: ImageProps) => {
  const checkImage = (url: string) => {
    if (url.startsWith("ipfs://"))
      return `https://ipfs.io/ipfs/${url.substring(7)}`;
    else return url;
  };

  return (
    <div className="relative border rounded-lg shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={checkImage(media.url as string)}
        alt={alt}
        className="rounded-lg"
      />
    </div>
  );
};
