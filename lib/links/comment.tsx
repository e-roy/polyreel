import React from "react";
import Link from "next/link";
import type { LinkProps } from "./types";

export const commentRegex = /[\u4e00-\u9fa5_a-zA-Z0-9\d\D\s\S]+/;

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
