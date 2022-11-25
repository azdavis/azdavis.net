export function e(
  name: string,
  attrs: { [k: string]: string },
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
