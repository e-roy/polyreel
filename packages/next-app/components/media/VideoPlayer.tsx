export type VideoPlayerProps = {
  media: {
    height?: number;
    width?: number;
    url?: string;
    mimeType?: string;
  };
};

export const VideoPlayer = ({ media }: VideoPlayerProps) => {
  return (
    <div className="relative border rounded">
      <video id="plyr" controls>
        <source src={media.url} type={media.mimeType} />
      </video>
    </div>
  );
};
