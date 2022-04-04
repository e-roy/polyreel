import { useEffect, useState } from "react";

import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

type AddGifProps = {
  onSelect: (gif: any) => void;
};

export const AddGif = ({ onSelect }: AddGifProps) => {
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    const fetchGifs = async () => {
      const gifs = await gf.search(search, {
        sort: "relevant",
      });
      setGifs(gifs.data as any);
    };
    fetchGifs();
  }, [search]);

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
        <div className="columns-3">
          {gifs &&
            gifs.length > 0 &&
            gifs.map((gif: any, index: number) => (
              <img
                key={index}
                src={gif.images.original.url}
                onClick={() => {
                  onSelect(gif.images.original.url);
                }}
                className="border-2 border-stone-200 rounded-lg cursor-pointer w-full hover:border-sky-400"
              />
            ))}
        </div>
      </div>
    </div>
  );
};
