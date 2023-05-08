type ImageProps = {
  media: {
    height?: number;
    width?: number;
    url?: string;
    mimeType?: string;
  };
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
