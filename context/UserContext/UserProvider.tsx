import { useEffect, useMemo, useState } from "react";

import { useAccount, useDisconnect } from "wagmi";

import { UserContext } from "./UserContext";

import {
  getAuthenticationToken,
  removeAuthenticationToken,
} from "@/lib/auth/state";

import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull, ProfileFragmentLite } from "@/graphql/fragments";

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

  const {
    data: defaultProfileData,
    loading: defaultProfileLoading,
    refetch: refechProfiles,
  } = useQuery(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        ethereumAddress: address,
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

  // let verifyData = { verify: true };
  // let verifyLoading = false;

  const [currentUserProfile, setCurrentUserProfile] = useState(
    defaultProfileData?.defaultProfile
  );

  if (!userProfilesLoading && !defaultProfileLoading && !verifyLoading) {
    if (userProfilesData)
      logger(
        "UserProvider.tsx ---- userProfilesData",
        userProfilesData,
        "green"
      );

    if (defaultProfileData)
      logger(
        "UserProvider.tsx ---- defaultProfileData",
        defaultProfileData,
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
        } else if (defaultProfileData?.defaultProfile) {
          setCurrentUserProfile(defaultProfileData?.defaultProfile);
        } else {
          setCurrentUserProfile(userProfilesData.profiles.items[0]);
        }
      }
    }
  }, [userProfilesData?.profiles]);

  const injectContext = useMemo(
    () => ({
      profiles: userProfilesData?.profiles?.items,
      defaultProfile: defaultProfileData?.defaultProfile,
      currentUser: defaultProfileData?.defaultProfile,
      // currentUser: currentUserProfile,
      setCurrentUser: (profile: Profile) => {
        console.log(profile);
        setCurrentUserProfile(profile);
        localStorage.setItem("polyreel_current_user_profile_id", profile.id);
      },
      refechProfiles: refechProfiles,
      verified: verifyData?.verify,
      refetchVerify: refetchVerify,
      loading: verifyLoading,
    }),
    [
      userProfilesData,
      defaultProfileData,
      currentUserProfile,
      verifyData,
      verifyLoading,
    ]
  );

  if (userProfilesLoading || defaultProfileLoading) return <Loading />;

  return (
    <UserContext.Provider value={injectContext}>
      {children}
    </UserContext.Provider>
  );
};
