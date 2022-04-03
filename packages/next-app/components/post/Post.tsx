import React from "react";
import Link from "next/link";
import { PostBody, Stats } from "@/components/post";

type PostProps = {
  publication: any;
  postType?: string;
};

export const Post = ({ publication, postType }: PostProps) => {
  // console.log("publication", publication);
  // console.log("publication type", publication.__typename);

  // console.log("postType", postType);
  return (
    <div className="">
      {publication.__typename === "Post" && (
        <>
          <Link href={`/post/${publication.id}`}>
            <div className="cursor-pointer">
              <PostBody publication={publication} />
            </div>
          </Link>
          <Stats publication={publication} />
        </>
      )}

      {publication.__typename === "Mirror" && (
        <div>
          <Link href={`/profile/${publication.mirrorOf.profile.handle}`}>
            <div className="cursor-pointer">
              {publication.mirrorOf.profile.handle && (
                <div className="mb-4 ml-6 font-semibold text-stone-500 cursor-pointer hover:text-stone-900">
                  mirrored from{" "}
                  <span className="text-stone-700">
                    @{publication.mirrorOf.profile.handle}
                  </span>
                </div>
              )}

              <PostBody publication={publication} />
            </div>
          </Link>

          <Stats publication={publication} />
        </div>
      )}

      {publication.__typename === "Comment" && postType === "feed" && (
        <>
          {publication.commentOn.id === publication.mainPost.id && (
            <div className="">
              <div className="mb-4">
                {publication.mainPost.profile && (
                  <div>
                    <Link href={`/post/${publication.mainPost.id}`}>
                      <div className="mb-4 ml-6 font-semibold text-stone-500 cursor-pointer">
                        @{publication.profile.handle} Commented on @
                        {publication.mainPost.profile.handle}
                      </div>
                    </Link>
                  </div>
                )}
                {publication.mainPost && (
                  <>
                    <Link href={`/post/${publication.mainPost.id}`}>
                      <div className="cursor-pointer">
                        <PostBody publication={publication.mainPost} />
                      </div>
                    </Link>
                    <Stats publication={publication.mainPost} />
                  </>
                )}
              </div>
              <div className="ml-10 w-0.5 h-8 bg-gray-400 " />
              <div className="p-4 border rounded-lg shadow-md">
                <PostBody publication={publication} />
                <Stats publication={publication} />
              </div>
            </div>
          )}
        </>
      )}

      {publication.__typename === "Comment" && postType === "commment" && (
        <div className="p-4 border rounded-lg shadow-md">
          <PostBody publication={publication} />
          <Stats publication={publication} />
        </div>
      )}

      {publication.__typename === "Comment" && postType === "profile" && (
        <div className="p-4 border rounded-lg shadow-md">
          <div className="">
            <div className="mb-4">
              {/* {publication.mainPost && ( */}
              <>
                <PostBody publication={publication.mainPost} />
                <Stats publication={publication.mainPost} />
              </>
              {/* )} */}
            </div>
            <div className="ml-10 w-0.5 h-8 bg-gray-400 " />
            <div className="p-4 border rounded-lg shadow-md">
              <PostBody publication={publication} />
              <Stats publication={publication} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
