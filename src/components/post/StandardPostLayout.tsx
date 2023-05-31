"use client";

import { Post as PostType } from "@/types/graphql/generated";

import { Post, PostComments } from "@/components/post";

import { WhoToFollow } from "@/components/home";

interface IStandardPostLayoutProps {
  publication: PostType;
}

export const StandardPostLayout = ({
  publication,
}: IStandardPostLayoutProps) => {
  //   console.log("publication", publication);
  return (
    <div className="">
      <div className={`grid grid-cols-12 lg:gap-4 xl:gap-8 2xl:gap-12`}>
        {/* Main Column */}
        <div className="w-full md:mx-2 col-span-12 lg:col-span-9">
          <div className="h-9/10 md:h-98vh my-1 overflow-y-scroll lg:border-r md:border-l border-stone-300">
            <div className="flex flex-1 justify-center w-full">
              <div className="w-full px-2 sm:p-6">
                <div className="mb-4">
                  {publication && (
                    <Post publication={publication} postType="page" />
                  )}
                </div>
                <div className="pb-12">
                  <PostComments postId={publication.id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="pt-4 hidden lg:block lg:col-span-3">
          <div className={`h-12 flex justify-end`}>
            {/* {!isWalletConnected ? (
              <ConnectButton />
            ) : (
              <>
                {correctNetwork ? (
                  <>{!verified && <Auth />}</>
                ) : (
                  <SwitchNetwork />
                )}
              </>
            )} */}
          </div>

          <div className={`mt-4`}>
            <WhoToFollow />
          </div>
        </div>
      </div>
    </div>
  );
};
