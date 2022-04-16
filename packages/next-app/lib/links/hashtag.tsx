import React from "react";
import Link from "next/link";
import type { LinkProps } from "./types";

export const hashtagRegex = /\B#([\w_]+)/;

export const HashtagComponent: React.FC<LinkProps> = ({ match, className }) => {
  return (
    <Link href={`/hashtag/` + match.slice(1)}>
      <span className={className}>{match}</span>
    </Link>
  );
};
