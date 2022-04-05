import React from "react";
import Link from "next/link";
import type { LinkProps } from "./types";

export const commentRegex = /([\s\w\d\n]+)/;

export const CommentComponent: React.FC<LinkProps> = ({
  match,
  className,
  publicationId,
}) => {
  return (
    <Link href={`/post/${publicationId}`}>
      <span className={className}>{match}</span>
    </Link>
  );
};
