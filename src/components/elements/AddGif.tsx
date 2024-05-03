"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

type AddGifProps = {
  onSelect: (gif: string) => void;
};

type Gif = {
  images: {
    original: {
      url: string;
    };
  };
};

export const AddGif = ({ onSelect }: AddGifProps) => {
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);

  const fetchGifs = useCallback(async () => {
    const response = await gf.search(search, {
      sort: "relevant",
    });
    setGifs(response.data as Gif[]);
  }, [search]);

  useEffect(() => {
    fetchGifs();
  }, [fetchGifs]);

  const handleSelect = useCallback(
    (url: string) => {
      onSelect(url);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLImageElement>, url: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(url);
      }
    },
    [handleSelect]
  );

  const gifElements = useMemo(
    () =>
      gifs.map((gif, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={gif.images.original.url}
          alt=""
          tabIndex={0}
          onClick={() => handleSelect(gif.images.original.url)}
          onKeyDown={(e) => handleKeyDown(e, gif.images.original.url)}
          className="border-2 border-stone-200 rounded-lg cursor-pointer w-full hover:border-sky-400 focus:outline-none focus:border-sky-400"
        />
      )),
    [gifs, handleSelect, handleKeyDown]
  );

  return (
    <div className="py-1 px-2 text-stone-500 hover:text-stone-800 cursor-pointer my-auto rounded-lg">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Gifs"
        className="w-full border border-stone-400 rounded-lg p-1 mb-1 focus:outline-none focus:border-stone-700"
      />
      <div className="overflow-y-scroll max-h-96 rounded-lg mb-12">
        <div className="columns-3">{gifElements}</div>
      </div>
    </div>
  );
};
