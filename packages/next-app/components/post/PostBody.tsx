import Link from "next/link";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoPlayer, Image } from "@/components/media";

export const PostBody = ({ publication }: any) => {
  return (
    <div className="text-stone-700 font-medium">
      <div className="flex justify-between">
        <Link href={`/profile/${publication.profile.handle}`}>
          <div className="flex cursor-pointer">
            {publication.profile.picture ? (
              <div className="h-12 w-12 relative rounded-full border-2 cursor-pointer">
                <img
                  src={publication.profile.picture.original.url}
                  alt=""
                  className="rounded-full h-12"
                />
              </div>
            ) : (
              <div className="bg-slate-300 rounded-full h-12 w-12 border-2 cursor-pointer"></div>
            )}
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

      <div className="overflow-hidden my-2">
        {publication.metadata.description}
      </div>
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
