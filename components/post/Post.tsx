import React from "react";
import Link from "next/link";
import { PostBody, Stats } from "@/components/post";
import { Post as PostType } from "@/types/graphql/generated";
import { Publication } from "@/types/graphql/generated";
import { logger } from "@/utils/logger";

type PostProps = {
  publication: Publication;
  postType?: string;
};

export const Post = ({ publication, postType }: PostProps) => {
  // console.log("publication type", publication.__typename);

  // console.log("postType", postType);

  // logger("Post.tsx", publication);

  return (
    <div className="my-2">
      {publication.__typename === "Post" && (
        <>
          <PostBody publication={publication} />
          <Stats publication={publication} />
        </>
      )}

      {publication.__typename === "Mirror" && (
        <>
          {publication.mirrorOf.profile.handle && (
            <>
              {publication.mirrorOf.__typename === "Comment" ? (
                <Link
                  href={`/post/${publication.mirrorOf.mainPost.id}?comment=${publication.mirrorOf.id}`}
                >
                  <div className="mb-4 ml-6 text-xs sm:text-sm lg:text-medium font-semibold text-stone-500 dark:text-stone-400 dark:hover:text-stone-500 cursor-pointer hover:text-stone-700">
                    mirrored from{" "}
                    <span className="font-bold">
                      @{publication.mirrorOf.profile.handle}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href={`/post/${publication.mirrorOf.id}`}>
                  <div className="mb-4 ml-6 text-xs sm:text-sm lg:text-medium font-semibold text-stone-500 dark:text-stone-400 dark:hover:text-stone-500 cursor-pointer hover:text-stone-700">
                    mirrored from{" "}
                    <span className="font-bold">
                      @{publication.mirrorOf.profile.handle}
                    </span>
                  </div>
                </Link>
              )}
            </>
          )}
          <PostBody publication={publication as unknown as PostType} />
          <Stats publication={publication as unknown as PostType} />
        </>
      )}

      {publication.__typename === "Comment" && postType === "feed" && (
        <>
          <div className="mb-2">
            {publication.mainPost.profile && (
              <>
                <Link
                  href={`/post/${publication.mainPost.id}?comment=${publication.id}`}
                >
                  <div className="mb-4 ml-6 text-xs sm:text-sm lg:text-medium font-semibold text-stone-500 dark:text-stone-400 dark:hover:text-stone-500 cursor-pointer hover:text-stone-700">
                    <span className="font-bold">
                      @{publication.profile.handle}
                    </span>{" "}
                    commented on @
                    <span className="font-bold">
                      {publication.mainPost.profile.handle}
                    </span>
                  </div>
                </Link>
              </>
            )}
            {publication.mainPost && (
              <>
                <PostBody
                  publication={publication.mainPost as unknown as PostType}
                />
                <Stats publication={publication as unknown as PostType} />
              </>
            )}
          </div>
          <div className="ml-8 w-0.5 h-8 bg-gray-400" />
          <div className="p-2 sm:p-4 border rounded-lg shadow-md">
            <PostBody publication={publication as unknown as PostType} />
            <Stats publication={publication as unknown as PostType} />
          </div>
        </>
      )}

      {publication.__typename === "Comment" && postType === "commment" && (
        <div className="p-2 sm:p-4 border rounded-lg shadow-md">
          <PostBody publication={publication as unknown as PostType} />
          <Stats publication={publication as unknown as PostType} />
        </div>
      )}

      {publication.__typename === "Comment" && postType === "profile" && (
        <div className="p-2 sm:p-4">
          <div className="">
            <div className="mb-4">
              <PostBody
                publication={publication.mainPost as unknown as PostType}
              />
              <Stats publication={publication as unknown as PostType} />
            </div>
            <div className="ml-10 w-0.5 h-8 bg-gray-400 " />
            <div className="p-2 sm:p-4 border rounded-lg shadow-lg">
              <PostBody publication={publication as unknown as PostType} />
              <Stats publication={publication as unknown as PostType} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
