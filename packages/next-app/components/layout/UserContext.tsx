import { createContext, Dispatch } from "react";

type userProfile = {
  id: string;
  handle?: string;
  bio?: string;
  coverPicture?: {
    original: {
      url: string;
      mimeType: string;
    };
  };
  location?: string;
  website?: string;
  twitterUrl?: string;
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
  currentUser?: userProfile;
  setCurrentUser: Dispatch<userProfile | undefined>;
};

export const UserContext = createContext<UserContextType>({
  currentUser: undefined,
  profiles: [],
  setCurrentUser: () => {},
});
