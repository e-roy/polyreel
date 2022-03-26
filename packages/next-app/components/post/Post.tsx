import React from "react";
import Link from "next/link";
import { PostBody } from "@/components/post";

export const Post = ({ publication }: any) => {
  return (
    <div className="p-4 border-t border-b border-stone-300">
      {publication.__typename === "Mirror" && (
        <div>
          <Link href={`/profile/${publication.mirrorOf.profile.handle}`}>
            <div className="mb-4 ml-6 font-semibold text-stone-500 cursor-pointer hover:text-stone-900">
              mirrored from{" "}
              <span className="text-stone-700">
                @{publication.mirrorOf.profile.handle}
              </span>
            </div>
          </Link>
          <PostBody publication={publication} />
        </div>
      )}

      {publication.__typename === "Comment" && (
        <div className="">
          <div className="mb-4">
            <div className="mb-4 ml-6 font-semibold text-stone-500 ">
              @{publication.profile.handle} Commented on @
              {publication.mainPost.profile.handle}
            </div>
            <PostBody publication={publication.mainPost} />
          </div>
          <div className="ml-10 w-0.5 h-8 bg-gray-400 " />
          <div className="p-4">
            <PostBody publication={publication} />
          </div>
        </div>
      )}

      {publication.__typename === "Post" && (
        <PostBody publication={publication} />
      )}
    </div>
  );
};
