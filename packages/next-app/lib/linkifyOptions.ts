export const linkifyOptions = {
  formatHref: function (href: string, type: "mention"): string {
    console.log(href);
    console.log(type);
    if (type === "mention") {
      href = "/profile/" + href.slice(1);
    }
    return href;
  },
  target: "_blank",
  rel: "noreferrer",
};
