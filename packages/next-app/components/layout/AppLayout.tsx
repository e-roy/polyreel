import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { removeAuthenticationToken } from "@/lib/auth/state";

import { UserContext, Header } from "@/components/layout";
import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";

import { Loading } from "@/components/elements";

import { ENV_PROD, ENV_DEV } from "@/lib/constants";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  const { data: accountData } = useAccount();
  const { activeConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const [currentUserProfileId, setCurrentUserProfileId] = useState<
    string | null
  >(null);

  // useEffect(() => {
  //   setCurrentUserProfileId(
  //     localStorage.getItem("polyreel_current_user_profile_id")
  //   );
  // }, []);

  useEffect(() => {
    if (accountData?.address) {
      setCurrentUserProfileId(
        localStorage.getItem("polyreel_current_user_profile_id")
      );
    }
    activeConnector?.on("change", () => {
      console.log('activeConnector.on("change")');
      removeAuthenticationToken();
      disconnect();
    });
  }, [accountData?.address]);

  const {
    data: userProfilesData,
    loading: userProfilesLoading,
    error,
    refetch,
  } = useQuery(GET_PROFILES, {
    variables: {
      request: { ownedBy: accountData?.address },
    },
  });

  const { data: currentProfileData, loading: currentProfileLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { profileIds: [currentUserProfileId] },
      },
    }
  );

  // console.log(userProfilesData);
  // console.log(currentUserProfileId);
  // console.log(currentProfileData);

  const injectContext = {
    profiles: userProfilesData?.profiles?.items,
    currentUser: currentProfileData?.profiles.items[0],
    setCurrentUser: (profile: any) => {
      setCurrentUserProfileId(profile.id);
      localStorage.setItem("polyreel_current_user_profile_id", profile.id);
    },
    refechProfiles: refetch,
  };

  if (userProfilesLoading || currentProfileLoading) return <Loading />;

  // if (router.pathname === "/home" && !currentProfileData) {
  //   router.push("/select-profile");
  // }

  return (
    <UserContext.Provider value={injectContext}>
      <div className="flex flex-col h-screen">
        {router.pathname !== "/select-profile" && <Header />}
        <main className="flex-grow">{children}</main>
        {ENV_PROD && <footer className="h-2 bg-sky-200"></footer>}
        {ENV_DEV && <footer className="h-2 bg-purple-500"></footer>}
      </div>
    </UserContext.Provider>
  );
};
