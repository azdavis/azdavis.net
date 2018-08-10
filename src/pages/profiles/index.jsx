import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";

export default ({data}) => (
  <div>
    <Helmet title={`Profiles - ${data.site.siteMetadata.title}`} />
    <Link to="/">Home</Link>
    <h1>Profiles</h1>
    <dl>
      <dt>
        <a href="https://github.com/azdavis">GitHub</a>
      </dt>
      <dd>A server for git remotes.</dd>
      <dt>
        <a href="https://www.reddit.com/user/azdavis">Reddit</a>
      </dt>
      <dd>A place for people to discuss things.</dd>
      <dt>
        <a href="https://news.ycombinator.com/user?id=azdavis">Hacker News</a>
      </dt>
      <dd>A place for hackers to discuss things.</dd>
      <dt>
        <a href="https://keybase.io/azdavis">Keybase</a>
      </dt>
      <dd>A place for verification of profile ownership.</dd>
    </dl>
  </div>
);

export const pageQuery = graphql`
  query Profiles {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
