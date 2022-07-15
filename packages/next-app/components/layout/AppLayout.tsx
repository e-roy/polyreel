import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth/state";

import { UserContext, Header } from "@/components/layout";
import { useQuery, gql } from "@apollo/client";
import { GET_PROFILES } from "@/queries/profile/get-profiles";
import { ProfileFragmentFull } from "@/queries/fragments/ProfileFragmentFull";

import { Loading } from "@/components/elements";

import { Profile } from "@/types/lenstypes";

export const GET_DEFAULT_PROFILE = gql`
  query ($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      ...ProfileFragmentFull
    }
  }
  ${ProfileFragmentFull}
`;

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  const { address, connector, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    connector?.on("change", () => {
      removeAuthenticationToken();
      disconnect();
    });
  }, [address, connector, isDisconnected]);

  const { data: userProfilesData, loading: userProfilesLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { ownedBy: address },
      },
    }
  );

  const {
    data: currentProfileData,
    loading: currentProfileLoading,
    refetch,
  } = useQuery(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        ethereumAddress: address,
      },
    },
  });

  const [currentUserProfile, setCurrentUserProfile] = useState(
    currentProfileData?.defaultProfile
  );

  useEffect(() => {
    if (userProfilesData?.profiles) {
      const profileId = localStorage.getItem(
        "polyreel_current_user_profile_id"
      );
      if (profileId) {
        const profile = userProfilesData.profiles.items.find(
          (profile: Profile) => profile.id === profileId
        );
        if (profile) {
          setCurrentUserProfile(profile);
        } else if (currentProfileData?.defaultProfile) {
          setCurrentUserProfile(currentProfileData?.defaultProfile);
        } else {
          setCurrentUserProfile(userProfilesData.profiles.items[0]);
        }
      }
    }
  }, [userProfilesData?.profiles]);

  // console.log("ALL PROFILES", userProfilesData);
  // console.log(currentUserProfileId);
  // console.log("current profile", currentProfileData);
  // console.log("currentError", currentError);

  const injectContext = {
    profiles: userProfilesData?.profiles?.items,
    defaultProfile: currentProfileData?.defaultProfile,
    currentUser: currentUserProfile,
    setCurrentUser: (profile: any) => {
      // console.log(profile);
      setCurrentUserProfile(profile);
      localStorage.setItem("polyreel_current_user_profile_id", profile.id);
    },
    refechProfiles: refetch,
  };

  if (userProfilesLoading || currentProfileLoading) return <Loading />;

  return (
    <UserContext.Provider value={injectContext}>
      <div className="flex flex-col h-screen">
        {router.pathname !== "/select-profile" && <Header />}
        <main className="flex-grow">{children}</main>
      </div>
    </UserContext.Provider>
  );
};
