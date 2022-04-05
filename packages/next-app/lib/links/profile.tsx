import React from "react";
import Link from "next/link";
import type { LinkProps } from "./types";

export const profileRegex = /\B@([\w_]+)/;

export const ProfileComponent: React.FC<LinkProps> = ({ match, className }) => {
  return (
    <Link href={`/profile/` + match.slice(1)}>
      <span className={className}>{match}</span>
    </Link>
  );
};
