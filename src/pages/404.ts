import { page } from "../components/page";
import { e } from "../util/e";

export const error404 = page(
  "en",
  "404 Not Found",
  ["base"],
  [
    e("a", { href: "/" }, ["azdavis.net"]),
    e("h1", {}, ["404 Not Found"]),
    e("p", {}, ["This page does not exist."]),
  ],
);
