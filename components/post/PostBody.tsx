import Link from "next/link";

import { cardFormatDate } from "@/utils/formatDate";
import { MediaDisplay } from "@/components/media";

import { Post as PostType } from "@/types/graphql/generated";

import {
  LinkItUrl,
  LinkItProfile,
  LinkItComment,
  LinkItHashtag,
  urlRegex,
} from "@/lib/links";
import { Avatar } from "../elements";

interface IPostBodyProps {
  publication: PostType;
}

export const PostBody = ({ publication }: IPostBodyProps) => {
  // get urls from publication.metadata.content
  // const urls = publication.metadata.content.match(urlRegex);
  // console.log("urls", urls);

  return (
    <div className={`border-b dark:border-stone-300/30 my-2 py-4 sm:p-4`}>
      <div className={`grid grid-cols-8 md:grid-cols-12`}>
        <div className={`col-span-1`}>
          <Avatar
            profile={publication.profile}
            size={`small`}
            href={`/profile/${publication.profile.handle}`}
          />
        </div>
        <div className={`flex flex-col col-span-7 md:col-span-11`}>
          <div className={`flex`}>
            <Link
              className={`hover:underline w-full`}
              href={`/profile/${publication.profile.handle}`}
              passHref
            >
              <span
                className={`text-stone-700 dark:text-stone-100 font-medium w-full`}
              >
                {publication.profile.name}
              </span>
              <span
                className={`text-stone-500 dark:text-stone-400 font-medium text-xs pl-2 my-auto`}
              >
                @{publication.profile.handle}
              </span>
            </Link>
            <span
              className={`text-right w-full text-stone-500 dark:text-stone-400 text-xs sm:text-sm my-auto`}
            >
              {cardFormatDate(publication.createdAt)}
            </span>
          </div>
          <div className={`w-full`}>
            {publication.metadata && (
              <div className="overflow-hidden my-2 line-clamp-4 text-stone-700 dark:text-stone-300 text-xs sm:text-sm md:text-base font-medium">
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
          </div>
        </div>
        <div className={``}></div>
      </div>
      <div>
        {publication.metadata && publication.metadata.media && (
          <MediaDisplay publication={publication} />
        )}
      </div>
    </div>
  );
};
