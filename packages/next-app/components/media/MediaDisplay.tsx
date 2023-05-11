import { AudioPlayerCard, LivepeerPlayer, VideoPlayer, Image } from "./";
import { MediaSet, Post as PostType } from "@/types/graphql/generated";

interface IMediaDisplayProps {
  publication: PostType;
}

export const MediaDisplay = ({ publication }: IMediaDisplayProps) => {
  // console.log(publication);

  if (
    publication.metadata.media[0]?.original.mimeType === "video/mp4" ||
    publication.metadata.media[0]?.original.mimeType === "video/webm"
  )
    if (publication.metadata.media[0]?.original.url.includes("ipfs://")) {
      return (
        <LivepeerPlayer
          publication={publication}
          playbackId={publication.metadata.media[0]?.original.url}
        />
      );
    } else {
      return (
        <VideoPlayer source={publication.metadata.media[0]?.original.url} />
      );
    }

  if (publication.metadata.media[0]?.original.mimeType === "audio/mpeg")
    return <AudioPlayerCard publication={publication} />;

  return (
    <>
      {publication.metadata.media.map((media: MediaSet, index: number) => (
        <div key={index}>
          {media.original.url && media.original.mimeType !== "video/mp4" && (
            <Image media={media.original} />
          )}
        </div>
      ))}
    </>
  );
};
