import Link from "next/link";
import { useEffect, useState } from "react";
import { cardFormatDate } from "@/utils/formatDate";
import { VideoPlayer, Image } from "@/components/media";
import { Avatar } from "@/components/elements";

import {
  LinkItUrl,
  LinkItProfile,
  LinkItComment,
  LinkItHashtag,
} from "@/lib/links";

export const PostBody = ({ publication }: any) => {
  // console.log(publication);
  const [adjustBorder, setAdjustBorder] = useState("");
  useEffect(() => {
    // console.log(publication.appId);
    if (publication.appId?.includes("Lenster"))
      setAdjustBorder("border-purple-600");
    if (publication.appId === "polyreel.xyz")
      setAdjustBorder("border-blue-500");
  }, [publication.appId]);

  return (
    <div className="text-stone-700 font-medium">
      <div className="flex justify-between">
        {publication.profile && (
          <Link href={`/profile/${publication.profile.handle}`}>
            <div
              className={`ml-4 flex cursor-pointer hover:text-stone-900 shadow hover:shadow-xl rounded-r-xl border-r pr-4 ${adjustBorder}`}
            >
              <div className="-ml-4">
                <Avatar profile={publication.profile} size={"small"} />
              </div>
              <div className="-mt-0.5">
                <div className="ml-4 my-auto font-semibold">
                  @{publication.profile.handle}
                </div>
                <div className="ml-4 my-auto text-xs">
                  {publication.profile.name}
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="text-xs">{cardFormatDate(publication.createdAt)}</div>
      </div>
      {publication.metadata && (
        <div className="overflow-hidden my-2 line-clamp-4">
          <LinkItUrl className="text-sky-600 hover:text-sky-500 z-50">
            <LinkItProfile className="text-sky-600 hover:text-sky-500 cursor-pointer">
              <LinkItHashtag className="text-sky-600 hover:text-sky-500 cursor-pointer">
                <LinkItComment
                  className=" cursor-pointer"
                  publicationId={publication.id}
                >
                  {publication.metadata.content}
                </LinkItComment>
              </LinkItHashtag>
            </LinkItProfile>
          </LinkItUrl>
        </div>
      )}
      <Link href={`/post/${publication.id}`}>
        <div className="cursor-pointer">
          {publication.metadata && publication.metadata.media && (
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
      </Link>
    </div>
  );
};
