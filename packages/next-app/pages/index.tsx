import type { NextPage } from "next";
import Head from "next/head";
import { Hero, What, How, Why, Creators } from "@/components/landing";

const Landing: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <What />
      <How />
      {/* <Why /> */}
      <Creators />
    </div>
  );
};

export default Landing;
