import { Post as PostType } from "@/types/graphql/generated";

import { Post } from "@/components/post/Post";
import { PostComments } from "@/components/post/PostComments";

interface StandardPostLayoutProps {
  publication: PostType;
}

export const StandardPostLayout = ({
  publication,
}: StandardPostLayoutProps) => {
  return (
    <div className="flex flex-col">
      <div className="my-1 border-stone-300">
        <div className="flex flex-1 justify-center w-full">
          <div className="w-full px-2 sm:p-6">
            <div className="mb-4">
              <Post publication={publication} />
            </div>
            <div className="pb-12">
              <PostComments postId={publication.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
