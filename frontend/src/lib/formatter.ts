const locale: string = navigator.language;

const mediumDateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale, {
  dateStyle: "medium",
});
const longDateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale, {
  dateStyle: "long",
});

type styleType = "medium" | "long";

export function formatDate(
  isoString: string,
  style: styleType = "medium",
): string {
  const date: Date = new Date(isoString);

  //  if (isNaN(date.getTime())) {
  //   throw new Error(`Invalid ISO date string: "${isoString}"`);
  // }

  return style === "long"
    ? longDateFormat.format(date)
    : mediumDateFormat.format(date);
}
