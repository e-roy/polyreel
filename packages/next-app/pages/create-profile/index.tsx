import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/layout";

const CreateProfile: NextPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex-1 overflow-y-scroll px-4">Create Profile</main>
    </div>
  );
};

export default CreateProfile;
