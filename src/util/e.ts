export function e(
  name: string,
  attrs: { [k: string]: string },
  body?: string[],
): string {
  const attrString = Object.entries(attrs)
    .map(([a, b]) => `${a}=${JSON.stringify(b)}`)
    .join(" ");
  const fst = attrString.length === 0 ? name : name + " " + attrString;
  return body == null ? `<${fst} />` : `<${fst}>${body.join("")}</${name}>`;
}
