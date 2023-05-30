import { useContext } from "react";
import { UserContext } from "@/context";
import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { SEARCH_PUBLICATIONS } from "@/graphql/publications/search-publications";

import { Loading, Error } from "@/components/elements";
import { Post } from "@/components/post";
import { logger } from "@/utils/logger";
interface IHashtagsListProps {}

export const HashtagsList = ({}: IHashtagsListProps) => {
  const { currentUser } = useContext(UserContext);

  const router = useRouter();
  const { hashtag } = router.query;

  const { loading, error, data } = useQuery(SEARCH_PUBLICATIONS, {
    variables: {
      request: {
        query: hashtag,
        type: "PUBLICATION",
        limit: 25,
      },
      reactionRequest: {
        profileId: currentUser?.id || null,
      },
      profileId: currentUser?.id || null,
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  logger("HashtagsList.tsx", data);

  return (
    <div className="flex justify-center">
      <div className="w-full mx-2">
        <div className="sm:px-2 lg:px-8">
          <div className="pb-4 text-center text-stone-700 dark:text-stone-100 text-2xl font-bold sticky top-0 bg-white dark:bg-stone-900 z-10">
            #{hashtag}
          </div>
          {data.search.items.map((publication: any, index: number) => (
            <div
              key={index}
              className="border-b-4 border-stone-400/40 py-4 my-4"
            >
              <Post publication={publication} postType="feed" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
