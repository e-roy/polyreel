import { useEffect, useMemo, useState } from "react";

import { useAccount, useDisconnect } from "wagmi";

import { UserContext } from "./UserContext";

import {
  getAuthenticationToken,
  removeAuthenticationToken,
} from "@/lib/auth/state";

import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull, ProfileFragmentLite } from "@/queries/fragments";

import { Loading } from "@/components/elements";

import { Profile } from "@/types/graphql/generated";

import { logger } from "@/utils/logger";

const GET_DEFAULT_PROFILE = gql`
  query ($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      ...ProfileFragmentFull
    }
  }
  ${ProfileFragmentFull}
`;

const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFragmentLite
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  ${ProfileFragmentLite}
`;

const VERIFY = gql`
  query ($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

export interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
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
      skip: !address,
    }
  );

  // if (userProfilesData)
  //   logger("UserProvider.tsx ---- userProfilesData", userProfilesData, "green");

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
    skip: !address,
  });

  // if (currentProfileData)
  //   logger(
  //     "UserProvider.tsx ---- currentProfileData",
  //     currentProfileData,
  //     "green"
  //   );

  const { data: verifyData, loading: verifyLoading } = useQuery(VERIFY, {
    variables: {
      request: { accessToken: getAuthenticationToken() },
    },
  });

  // if (verifyData)
  //   logger("UserProvider.tsx ---- verifyData", verifyData, "green");

  // let verifyData = { verify: true };
  // let verifyLoading = false;

  const [currentUserProfile, setCurrentUserProfile] = useState(
    currentProfileData?.defaultProfile
  );

  if (!userProfilesLoading && !currentProfileLoading && !verifyLoading) {
    if (userProfilesData)
      logger(
        "UserProvider.tsx ---- userProfilesData",
        userProfilesData,
        "green"
      );

    if (currentProfileData)
      logger(
        "UserProvider.tsx ---- currentProfileData",
        currentProfileData,
        "green"
      );

    if (verifyData)
      logger("UserProvider.tsx ---- verifyData", verifyData, "green");
  }

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

  const injectContext = useMemo(
    () => ({
      profiles: userProfilesData?.profiles?.items,
      defaultProfile: currentProfileData?.defaultProfile,
      currentUser: currentUserProfile,
      setCurrentUser: (profile: Profile) => {
        console.log(profile);
        setCurrentUserProfile(profile);
        localStorage.setItem("polyreel_current_user_profile_id", profile.id);
      },
      refechProfiles: refetch,
      verified: verifyData?.verify,
      loading: verifyLoading,
    }),
    [
      userProfilesData,
      currentProfileData,
      currentUserProfile,
      verifyData,
      verifyLoading,
    ]
  );

  if (userProfilesLoading || currentProfileLoading) return <Loading />;

  return (
    <UserContext.Provider value={injectContext}>
      {children}
    </UserContext.Provider>
  );
};
