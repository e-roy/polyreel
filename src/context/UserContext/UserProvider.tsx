"use client";
// context/UserContext/UserProvider.tsx

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAccount, useDisconnect } from "wagmi";

import { UserContext } from "./UserContext";

import {
  getAuthenticationToken,
  removeAuthenticationToken,
} from "@/lib/auth/state";

import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull } from "@/graphql/fragments/ProfileFragmentFull";
import { ProfileFragmentLite } from "@/graphql/fragments/ProfileFragmentLite";

import { Loading } from "@/components/elements/Loading";

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
  query ($request: ProfilesRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFragmentLite
      }
      pageInfo {
        prev
        next
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

  // useEffect(() => {
  //   connector?.on("change", () => {
  //     removeAuthenticationToken();
  //     disconnect();
  //   });
  // }, [address, connector, isDisconnected]);

  const { data: userProfilesData, loading: userProfilesLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { where: { ownedBy: [address] } },
      },
      skip: !address,
    }
  );

  const {
    data: defaultProfileData,
    loading: defaultProfileLoading,
    refetch: refetchProfiles,
  } = useQuery(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        for: address,
      },
    },
    skip: !address,
  });

  const token = getAuthenticationToken();

  const {
    data: verifyData,
    loading: verifyLoading,
    refetch: refetchVerify,
  } = useQuery(VERIFY, {
    variables: {
      request: { accessToken: token },
    },
    skip: !token || !address,
  });

  useEffect(() => {
    if (!userProfilesLoading && !defaultProfileLoading && !verifyLoading) {
      if (userProfilesData) {
        logger(
          "UserProvider.tsx ---- userProfilesData",
          userProfilesData,
          "green"
        );
      }
      if (defaultProfileData) {
        logger(
          "UserProvider.tsx ---- defaultProfileData",
          defaultProfileData,
          "green"
        );
      }
      if (verifyData) {
        logger("UserProvider.tsx ---- verifyData", verifyData, "green");
      }
    }
  }, [
    userProfilesData,
    defaultProfileData,
    verifyData,
    userProfilesLoading,
    defaultProfileLoading,
    verifyLoading,
  ]);

  const setCurrentUser = useCallback((profile: Profile) => {
    localStorage.setItem("polyreel_current_user_profile_id", profile.id);
  }, []);

  const injectContext = useMemo(
    () => ({
      profiles: userProfilesData?.profiles?.items,
      defaultProfile: defaultProfileData?.defaultProfile,
      currentUser: defaultProfileData?.defaultProfile,
      setCurrentUser,
      refetchProfiles,
      verified: verifyData?.verify || false,
      refetchVerify,
      loading: verifyLoading,
    }),
    [
      userProfilesData,
      defaultProfileData,
      verifyData,
      verifyLoading,
      setCurrentUser,
      refetchProfiles,
      refetchVerify,
    ]
  );

  if (userProfilesLoading || defaultProfileLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={injectContext}>
      {children}
    </UserContext.Provider>
  );
};
