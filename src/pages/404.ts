import { page } from "../components/page";
import { h } from "../util/h";
import { name as siteName } from "../util/site";

export const error404 = page("en", "404 Not Found", ["base"], {}, [
  h("a", { href: "/" }, [siteName]),
  h("h1", {}, ["404 Not Found"]),
  h("p", {}, ["This page does not exist."]),
]);
