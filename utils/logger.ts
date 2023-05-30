export const logger = (file: string, data: any, bgcolor?: string) => {
  if (process.env.NODE_ENV !== "development") return null;
  console.log(
    "%c LOGGER:  " + file + "   =====>",
    `background-color: ${
      bgcolor ? bgcolor : `blue`
    }; color: white; font-weight: bold; padding: 2px 6px;`,
    data
  );
};
