import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr, { APITypes, PlyrProps, PlyrInstance } from "plyr-react";
import "plyr-react/dist/plyr.css";

export type HLSVideoPlayerProps = {
  media: {
    height?: number;
    width?: number;
    url?: string;
    mimeType?: string;
  };
  playbackId?: string | null;
  streamIsActive?: boolean;
  refreshStream?: boolean;
};

export const HLSVideoPlayer = ({
  media,
  playbackId,
  streamIsActive,
  refreshStream,
}: HLSVideoPlayerProps) => {
  const ref = useRef<APITypes>(null);
  useEffect(() => {
    if (playbackId) {
      const loadVideo = async () => {
        const video = document.getElementById("plyr") as HTMLVideoElement;
        var hls = new Hls();
        //   hls.loadSource(`https://cdn.livepeer.com/${playbackId}/index.m3u8`);
        hls.loadSource(`${media.url}`);

        hls.attachMedia(video);
        // @ts-ignore
        ref.current!.plyr.media = video;

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const playPromise = (ref.current!.plyr as PlyrInstance).play();
          if (playPromise !== undefined) {
            playPromise
              .then((_) => {
                // Automatic playback started!
                // Show playing UI.
                console.log("Automatic playback started!");
              })
              .catch((error) => {
                // Auto-play was prevented
                // Show paused UI.
                console.log("ERROR:", error);
              });
          }
        });
      };
      loadVideo();
    }
  }, [playbackId, refreshStream]);

  return (
    <div className="h-96 w-96 relative border rounded">
      <video id="plyr" controls>
        <source src={media.url} type={media.mimeType} />
      </video>
    </div>
  );

  return (
    <Plyr
      id="plyr"
      options={{ volume: 0.1, autoplay: false }}
      source={{} as PlyrProps["source"]}
      ref={ref}
    />
  );
};
