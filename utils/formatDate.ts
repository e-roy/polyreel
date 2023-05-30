import { format } from "timeago.js";

function cardFormatDate(dateStr: string) {
  return format(dateStr, "en_US");
}

export { cardFormatDate };
