import { Media } from "@/types/graphql/generated";

type ImageProps = {
  media: Media;
};

export const Image = ({ media }: ImageProps) => {
  const checkImage = (url: string) => {
    if (url.startsWith("ipfs://"))
      return `https://ipfs.io/ipfs/${url.substring(7)}`;
    else return url;
  };

  return (
    <div className="relative border rounded-lg shadow-lg">
      <img
        src={checkImage(media.url as string)}
        alt=""
        className="rounded-lg"
      />
    </div>
  );
};
