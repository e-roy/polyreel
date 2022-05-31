import { createContext, Dispatch } from "react";
import { Profile } from "@/types/lenstypes";

type userProfile = Profile;

type UserContextType = {
  profiles?: userProfile[];
  currentUser?: userProfile;
  setCurrentUser: Dispatch<userProfile>;
  refechProfiles: () => void;
};

export const UserContext = createContext<UserContextType>({
  currentUser: undefined,
  profiles: [],
  setCurrentUser: () => {},
  refechProfiles: () => {},
});
