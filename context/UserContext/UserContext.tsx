import { createContext, Dispatch } from "react";
import { Profile } from "@/types/graphql/generated";

export interface UserContextType {
  profiles?: Profile[];
  defaultProfile?: Profile;
  currentUser?: Profile;
  setCurrentUser: Dispatch<Profile>;
  refechProfiles: () => void;
  verified?: boolean;
  refetchVerify: () => void;
  loading?: boolean;
}

export const UserContext = createContext<UserContextType>({
  profiles: undefined,
  defaultProfile: undefined,
  currentUser: undefined,
  setCurrentUser: () => {},
  refechProfiles: () => {},
  verified: undefined,
  refetchVerify: () => {},
  loading: true,
});
