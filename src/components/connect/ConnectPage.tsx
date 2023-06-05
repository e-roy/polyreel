"use client";
// components/connect/ConnectPage.tsx

import { SuggestedList, SearchProfilesList } from "@/components/connect";
import { useState, ChangeEvent, useCallback } from "react";
import { FaSearch } from "react-icons/fa";

export const ConnectPage = () => {
  const [search, setSearch] = useState<string>("");

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <>
      <div className="flex border rounded-xl mx-4 mt-4">
        <FaSearch className="text-3xl text-stone-500 h-6 w-6 my-auto ml-4" />
        <input
          className="w-full p-2 rounded-xl outline-none"
          placeholder="Search Profiles"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <div className="border-stone-300 rounded-xl mt-4">
        {search ? <SearchProfilesList search={search} /> : <SuggestedList />}
      </div>
    </>
  );
};
