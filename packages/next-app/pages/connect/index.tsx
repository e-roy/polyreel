import type { NextPage } from "next";
import { SuggestedList, SearchProfilesList } from "@/components/connect";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Connect: NextPage = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="flex border rounded-xl mx-4">
        <FaSearch className="text-3xl text-stone-500 h-6 w-6 my-auto ml-4" />
        <input
          className="w-full p-2 rounded-xl outline-none"
          placeholder="Search Profiles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="border-stone-300 rounded-xl mt-4">
        {search ? <SearchProfilesList search={search} /> : <SuggestedList />}
      </div>
    </>
  );
};

export default Connect;
