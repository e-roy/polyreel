import { createContext, Dispatch } from "react";
import { Profile } from "@/types/lenstypes";

type userProfile = Profile;

// type userProfile = {
//   id: string;
//   ownedBy: string;
//   handle?: string;
//   bio?: string;
//   coverPicture?: string;
//   location?: string;
//   website?: string;
//   twitter?: string | null;
//   name?: string;
//   picture?: {
//     original: {
//       url: string;
//       mimeType: string;
//     };
//   };
// };

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
