const formatter = new Intl.DateTimeFormat("ru", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});

export default function dateFormatter(date: Date) {
  return formatter.format(date).slice(0, -2);
}
