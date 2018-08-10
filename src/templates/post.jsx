import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import timeago from "timeago.js";

const now = timeago();

const RelativeTime = ({date}) =>
  <time dateTime={date}>{now.format(date)}</time>

export default ({
  data: {
    site,
    markdownRemark,
  },
}) => (
  <div>
    <Helmet title={`${markdownRemark.frontmatter.title} - ${site.siteMetadata.title}`} />
    <Link to="/posts/">Posts</Link>
    <h1>{markdownRemark.frontmatter.title}</h1>
    (<RelativeTime date={markdownRemark.frontmatter.date} />)
    <div dangerouslySetInnerHTML={{__html: markdownRemark.html}} />
  </div>
);

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      html
      frontmatter {
        title
        path
        date
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;
