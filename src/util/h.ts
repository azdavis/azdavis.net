type ElemName =
  | "a"
  | "body"
  | "dd"
  | "div"
  | "dl"
  | "dt"
  | "h1"
  | "head"
  | "header"
  | "html"
  | "link"
  | "meta"
  | "p"
  | "strong"
  | "time"
  | "title";

export function h(
  name: ElemName,
  attrs: Record<string, string>,
  body?: (string | null)[],
): string {
  const attrString = Object.entries(attrs)
    .map(([a, b]) => `${a}=${JSON.stringify(b)}`)
    .join(" ");
  const fst = attrString.length === 0 ? name : name + " " + attrString;
  // w3c html validate doesn't like self-closing tag syntax *shrug*
  // https://google.github.io/styleguide/htmlcssguide.html#Document_Type
  return body === undefined
    ? `<${fst}>`
    : `<${fst}>${body.filter((x) => x !== null).join("")}</${name}>`;
}
