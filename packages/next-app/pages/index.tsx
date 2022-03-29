import type { NextPage } from "next";
import Head from "next/head";
import { Hero } from "@/components/landing";

const Landing: NextPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
    </div>
  );
};

export default Landing;
