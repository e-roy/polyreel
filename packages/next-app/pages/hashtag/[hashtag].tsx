import React, { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { SEARCH_PUBLICATIONS } from "@/queries/publications/search-publications";

import { Loading } from "@/components/elements";
import { Post } from "@/components/post";

const HashtagPage: NextPage = () => {
  const router = useRouter();
  const { hashtag } = router.query;

  const { loading, error, data } = useQuery(SEARCH_PUBLICATIONS, {
    variables: {
      request: {
        query: hashtag,
        type: "PUBLICATION",
        limit: 25,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full mx-2 lg:w-2/3 xl:w-1/2  min-h-9/10">
        <div className="px-4 lg:px-8 h-9/10 overflow-y-scroll border border-stone-300 rounded-xl shadow-lg">
          <div className="pb-4 text-center text-stone-700 text-2xl font-bold sticky top-0 bg-white z-10">
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

export default HashtagPage;
