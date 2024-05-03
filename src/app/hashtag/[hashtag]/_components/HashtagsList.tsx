"use client";

import { useQuery } from "@apollo/client";
import { SEARCH_PUBLICATIONS } from "../_graphql/search-publications";

import { Loading } from "@/components/elements/Loading";
import { Error } from "@/components/elements/Error";

import { Post } from "@/components/post/Post";
import { logger } from "@/utils/logger";
import { PrimaryPublication } from "@/types/graphql/generated";
interface IHashtagsListProps {
  hashtag: string;
}

export const HashtagsList = ({ hashtag }: IHashtagsListProps) => {
  const { loading, error, data } = useQuery(SEARCH_PUBLICATIONS, {
    variables: {
      request: {
        query: hashtag,
        where: {
          publicationTypes: "POST",
        },
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  const { searchPublications } = data;

  logger("HashtagsList.tsx", data);

  return (
    <div className={`px-2 max-w-4xl mx-auto`}>
      <div className="w-full mx-2">
        <div className="sm:px-2 lg:px-8">
          <div className="pb-4 text-center text-stone-700 dark:text-stone-100 text-2xl font-bold sticky top-0 bg-white dark:bg-stone-900 z-10">
            #{hashtag}
          </div>
          {searchPublications?.items?.map(
            (publication: PrimaryPublication, index: number) => (
              <div
                key={index}
                className="border-b-4 border-stone-400/40 py-4 my-4"
              >
                <Post publication={publication} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
