"use client";

import { useQuery } from "@apollo/client";
import { SEARCH_PUBLICATIONS } from "../_graphql/search-publications";

import { Loading } from "@/components/elements/Loading";
import { ErrorComponent } from "@/components/elements/ErrorComponent";

import { Post } from "@/components/post/Post";
import { logger } from "@/utils/logger";
import { PaginatedPublicationPrimaryResult } from "@/types/graphql/generated";

type SearchPublicationsResult = {
  searchPublications: PaginatedPublicationPrimaryResult;
};

interface HashtagsListProps {
  hashtag: string;
}

export const HashtagsList: React.FC<HashtagsListProps> = ({ hashtag }) => {
  const { loading, error, data } = useQuery<SearchPublicationsResult>(
    SEARCH_PUBLICATIONS,
    {
      variables: {
        request: {
          query: hashtag,
          where: {
            publicationTypes: "POST",
          },
        },
      },
    }
  );

  if (loading) return <Loading />;
  if (error) return <ErrorComponent />;

  const { searchPublications } = data!;

  logger("HashtagsList.tsx", data);

  return (
    <div className="px-2 max-w-4xl mx-auto">
      <div className="w-full mx-2">
        <div className="sm:px-2 lg:px-8">
          <div className="pb-4 text-center text-stone-700 dark:text-stone-100 text-2xl font-bold sticky top-0 bg-white dark:bg-stone-950 z-10">
            #{hashtag}
          </div>
          {searchPublications?.items?.map((publication, index) => (
            <div
              key={publication.id ?? index}
              className="border-b-4 border-stone-400/40 py-4 my-4"
            >
              <Post publication={publication} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
