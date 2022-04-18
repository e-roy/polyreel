import { createContext, Dispatch } from "react";

type userProfile = {
  id: string;
  ownedBy: string;
  handle?: string;
  bio?: string;
  coverPicture?: string;
  location?: string;
  website?: string;
  twitter?: string | null;
  name?: string;
  picture?: {
    original: {
      url: string;
      mimeType: string;
    };
  };
};

type UserContextType = {
  profiles?: userProfile[];
  currentUser?: userProfile | undefined;
  setCurrentUser: Dispatch<userProfile | undefined>;
  refechProfiles: () => void;
};

export const UserContext = createContext<UserContextType>({
  currentUser: undefined,
  profiles: [],
  setCurrentUser: () => {},
  refechProfiles: () => {},
});
