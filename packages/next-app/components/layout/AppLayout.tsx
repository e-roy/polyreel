import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAccount } from "wagmi";

import { removeAuthenticationToken } from "@/lib/auth/state";

import { UserContext, Header } from "@/components/layout";
import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";

import { Loading } from "@/components/elements";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  const [{ data: accountData }] = useAccount();

  const [currentUserProfileId, setCurrentUserProfileId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setCurrentUserProfileId(
      localStorage.getItem("polyreel_current_user_profile_id")
    );
  }, []);

  useEffect(() => {
    // console.log("accountData", accountData);
    accountData?.connector?.on("change", () => {
      removeAuthenticationToken();
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

  if (userProfilesLoading) return <Loading />;
  if (currentProfileLoading) return <Loading />;

  if (router.pathname === "/home" && !currentProfileData) {
    router.push("/select-profile");
  }

  return (
    <UserContext.Provider value={injectContext}>
      {router.pathname !== "/select-profile" && <Header />}
      <main className="">{children}</main>
    </UserContext.Provider>
  );
};
