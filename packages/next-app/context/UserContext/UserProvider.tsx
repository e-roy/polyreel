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

  const {
    data: defaultProfileData,
    loading: defaultProfileLoading,
    refetch,
  } = useQuery(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        ethereumAddress: address,
      },
    },
    skip: !address,
  });

  const { data: verifyData, loading: verifyLoading } = useQuery(VERIFY, {
    variables: {
      request: { accessToken: getAuthenticationToken() },
    },
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

  // useEffect(() => {
  //   const body = document.querySelector("body");
  //   // console.log(`body`, body);
  //   // if (body) {
  //   //   body.classList.add(theme);
  //   //   return () => body.classList.remove(theme);
  //   // }
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, []);

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
      refechProfiles: refetch,
      verified: verifyData?.verify,
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
