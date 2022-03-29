import Link from "next/link";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoPlayer, Image } from "@/components/media";
import { Avatar } from "@/components/elements";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkifyOptions";
import "linkify-plugin-mention";

export const PostBody = ({ publication }: any) => {
  return (
    <div className="text-stone-700 font-medium">
      <div className="flex justify-between">
        <Link href={`/profile/${publication.profile.handle}`}>
          <div className="flex cursor-pointer">
            <Avatar profile={publication.profile} size={"small"} />
            <div>
              <div className="ml-4 my-auto font-semibold">
                @{publication.profile.handle}
              </div>
              <div className="ml-4 my-auto text-xs">
                {publication.profile.name}
              </div>
            </div>
          </div>
        </Link>
        <div className="text-xs">{cardFormatDate(publication.createdAt)}</div>
      </div>
      <Linkify tagName="div" options={linkifyOptions}>
        <div className="overflow-hidden my-2 linkify">
          {publication.metadata.description}
        </div>
        {publication.metadata.description !== publication.metadata.content && (
          <div className="overflow-hidden my-2 linkify">
            {publication.metadata.content}
          </div>
        )}
      </Linkify>

      <div>
        {publication.metadata.media && (
          <div className="flex flex-wrap">
            {publication.metadata.media.map((media: any, index: number) => (
              <div key={index}>
                {media.original.url &&
                  media.original.mimeType !== "video/mp4" && (
                    <Image media={media.original} />
                  )}
                {media.original.url &&
                  media.original.mimeType === "video/mp4" && (
                    <VideoPlayer media={media.original} />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
