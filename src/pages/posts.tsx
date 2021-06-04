import { Page } from "../page";
import { ReactElement } from "react";

interface PostListItem {
  title: string;
  slug: string;
}

export function posts(posts: PostListItem[]): ReactElement {
  return (
    <Page lang="en" title="Posts" styles={["base"]}>
      <a href="/">azdavis.xyz</a>
      <h1>Posts</h1>
      <ul>
        {posts.map(({ title, slug }) => (
          <li key={slug}>
            <a href={`/posts/${slug}`}>{title}</a>
          </li>
        ))}
      </ul>
    </Page>
  );
}
