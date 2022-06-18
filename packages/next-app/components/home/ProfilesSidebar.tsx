import { useState } from "react";
import { SearchProfiles, RecommendedProfiles } from ".";
import { SearchIcon } from "@heroicons/react/outline";

export const ProfilesSidebar = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex border rounded-xl mx-4 shadow-lg">
        <SearchIcon className="text-3xl text-stone-500 h-6 w-6 my-auto ml-4" />
        <input
          className="w-full p-2 rounded-xl outline-none"
          placeholder="Search Profiles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-y-scroll h-3/4 px-1 border border-stone-300 rounded-xl mt-4 mx-4 shadow-lg">
        {search ? <SearchProfiles search={search} /> : <RecommendedProfiles />}
      </div>
    </>
  );
};
