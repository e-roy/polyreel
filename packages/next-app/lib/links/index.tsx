import React, { Fragment, isValidElement, cloneElement } from "react";
import type { ReactNode } from "react";
import type { Component, HOCLinkProps } from "./types";
import { UrlComponent, urlRegex } from "./url";
import { ProfileComponent, profileRegex } from "./profile";
import { CommentComponent, commentRegex } from "./comment";
import { HashtagComponent, hashtagRegex } from "./hashtag";
import { getKey } from "./get-key";

const ctrlCharactersRegex =
  /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;

/**
 * Make urls clickable.
 * @param text Text to parse
 * @param options {@link Options}
 */
export function linkIt(
  text: string,
  linkComponent: Component,
  linkRegex: RegExp
): string | ReactNode[] {
  const elements: ReactNode[] = [];
  let rest = text;

  while (true) {
    const match = linkRegex.exec(rest);
    if (!match || match[0] === undefined) break;

    const urlStartIndex = match.index;
    const urlEndIndex = match.index + match[0].length;

    const textBeforeMatch = rest.slice(0, urlStartIndex);
    const url = rest
      .slice(urlStartIndex, urlEndIndex)
      .replace(ctrlCharactersRegex, "");
    rest = rest.slice(urlEndIndex);
    textBeforeMatch && elements.push(textBeforeMatch);
    elements.push(linkComponent(url, getKey()));
  }

  rest && elements.push(<Fragment key={getKey()}>{rest}</Fragment>);

  if (elements.length === 0) {
    return text;
  }

  return elements;
}

function findText(
  children: ReactNode,
  component: Component,
  regex: RegExp
): ReactNode {
  if (typeof children === "string") {
    return linkIt(children, component, regex);
  }

  if (Array.isArray(children)) {
    return children.map((c) => findText(c, component, regex));
  }

  if (
    isValidElement(children) &&
    children.props.children &&
    children.type !== "a" &&
    children.type !== "button"
  ) {
    return cloneElement(
      children,
      { ...children.props, key: getKey() },
      findText(children.props.children, component, regex)
    );
  }

  return children;
}

/**
 * LinkIt component can wrapped around any React component to linkify any
 * urls
 * @example
 * ```
 * <LinkIt
 *   component={(match, key) => <a href={match} key={key}>{match}</a>}
 *   regex={regexToMatch}
 * >
 *  www.google.com<div>hi match_me</div>
 * </LinkIt>
 * ```
 */
export const LinkIt: React.FC<{
  component: Component;
  regex: RegExp;
  children: ReactNode;
}> = (props) => {
  return (
    <Fragment>
      {findText(props.children, props.component, props.regex)}
    </Fragment>
  );
};

/**
 * Link URLs
 */
export const LinkItUrl: React.FC<HOCLinkProps> = (props) => {
  return (
    <Fragment>
      {findText(
        props.children,
        (match, key) => (
          <UrlComponent key={key} match={match} className={props.className} />
        ),
        urlRegex
      )}
    </Fragment>
  );
};

/**
 * Link Profile handles
 */
export const LinkItProfile: React.FC<HOCLinkProps> = (props) => {
  return (
    <Fragment>
      {findText(
        props.children,
        (match, key) => (
          <ProfileComponent
            key={key}
            match={match}
            className={props.className}
          />
        ),
        profileRegex
      )}
    </Fragment>
  );
};

/**
 * Link Comments
 */
export const LinkItComment: React.FC<HOCLinkProps> = (props) => {
  return (
    <Fragment>
      {findText(
        props.children,
        (match, key) => (
          <CommentComponent
            key={key}
            match={match}
            className={props.className}
            publicationId={props.publicationId}
          />
        ),
        commentRegex
      )}
    </Fragment>
  );
};

/**
 * Link Hashtags
 */
export const LinkItHashtag: React.FC<HOCLinkProps> = (props) => {
  return (
    <Fragment>
      {findText(
        props.children,
        (match, key) => (
          <HashtagComponent
            key={key}
            match={match}
            className={props.className}
          />
        ),
        hashtagRegex
      )}
    </Fragment>
  );
};

export * from "./url";
export * from "./profile";
export * from "./comment";
export * from "./types";
export * from "./hashtag";
