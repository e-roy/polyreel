import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/layout";
import { GetProfiles } from "@/components/lens/profiles";

import { useAccount } from "wagmi";

const MePage: NextPage = () => {
  const [{ data: accountData }, getAccount] = useAccount();

  const [profileId, setProfileId] = useState("");
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Head>
        <title>polyreel</title>
        <meta name="description" content="polyreel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex-1 overflow-y-scroll bg-stone-100 px-4">
        <GetProfiles
          ownedBy={accountData?.address}
          setProfileId={setProfileId}
        />
      </main>

      {/* <footer className="px-4 py-2">footer</footer> */}
    </div>
  );
};

export default MePage;
