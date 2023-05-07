import Link from "next/link";
import { ProfileHeader } from "@/components/post";

import { cardFormatDate } from "@/utils/formatDate";
import { Image, LivepeerPlayer } from "@/components/media";

import { Post as PostType } from "@/types/graphql/generated";

import {
  LinkItUrl,
  LinkItProfile,
  LinkItComment,
  LinkItHashtag,
} from "@/lib/links";

interface IPostBodyProps {
  publication: PostType;
}

export const PostBody = ({ publication }: IPostBodyProps) => {
  return (
    <div className="text-stone-700 font-medium">
      <div className="flex justify-between">
        <ProfileHeader
          profile={publication.profile}
          appId={publication.appId}
        />

        <div className="text-stone-700 text-xs sm:text-sm font-medium">
          {cardFormatDate(publication.createdAt)}
        </div>
      </div>
      {publication.metadata && (
        <div className="overflow-hidden my-2 line-clamp-4 text-stone-700 text-xs sm:text-sm md:text-base font-medium">
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
            <MediaDisplay publication={publication} />
          )}
        </div>
      </Link>
    </div>
  );
};

const MediaDisplay = ({ publication }: any) => {
  // console.log(publication);

  if (publication.metadata.media[0]?.original.mimeType === "video/mp4")
    return (
      <LivepeerPlayer
        publication={publication}
        playbackId={publication.metadata.media[0]?.original.url}
      />
    );

  return (
    <div className="md:flex md:flex-wrap">
      {publication.metadata.media.map((media: any, index: number) => (
        <div key={index}>
          {media.original.url && media.original.mimeType !== "video/mp4" && (
            <Image media={media.original} />
          )}
        </div>
      ))}
    </div>
  );
};
