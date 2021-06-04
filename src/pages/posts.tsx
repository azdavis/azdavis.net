interface PostListItem {
  title: string;
  slug: string;
}

export function posts(posts: PostListItem[]) {
  return {
    lang: "en" as const,
    title: "Posts",
    styles: ["base"],
    body: (
      <>
        <a href="/">azdavis.xyz</a>
        <h1>Posts</h1>
        <ul>
          {posts.map(({ title, slug }) => (
            <li key={slug}>
              <a href={`/posts/${slug}`}>{title}</a>
            </li>
          ))}
        </ul>
      </>
    ),
  };
}
