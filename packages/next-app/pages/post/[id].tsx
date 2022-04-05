import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { useQuery } from "@apollo/client";
import { GET_PUBLICATION } from "@/queries/publications/get-publication";

import { Post, PostComments } from "@/components/post";

import { Loading } from "@/components/elements";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id, comment } = router.query;
  const { loading, error, data } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: id,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;
  // console.log(data);
  // console.log(comment);
  if (data.publication.__typename === "Comment") {
    router.push(
      `/post/${data.publication.mainPost.id}?comment=${data.publication.id}`
    );
  }

  return (
    <div className="flex flex-1 justify-center h-screen">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full sm:w-3/4 xl:w-1/2">
        <div className="mb-4">
          <Post publication={data.publication} postType="page" />
        </div>
        <PostComments postId={id as string} />
      </div>
    </div>
  );
};

export default PostPage;
