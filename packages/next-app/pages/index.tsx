import type { NextPage } from "next";
import Head from "next/head";
import { ExplorePublications } from "@/components/explore";

const Landing: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ExplorePublications />
    </div>
  );
};

export default Landing;
