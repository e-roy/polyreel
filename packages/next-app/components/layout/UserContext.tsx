import { createContext, Dispatch } from "react";
import { Profile } from "@/types/lenstypes";

type userProfile = Profile;

type UserContextType = {
  profiles?: userProfile[];
  defaultProfile?: userProfile;
  currentUser?: userProfile;
  setCurrentUser: Dispatch<userProfile>;
  refechProfiles: () => void;
};

export const UserContext = createContext<UserContextType>({
  profiles: [],
  defaultProfile: undefined,
  currentUser: undefined,
  setCurrentUser: () => {},
  refechProfiles: () => {},
});
