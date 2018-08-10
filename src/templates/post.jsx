import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import timeago from "timeago.js";

const now = timeago();

const RelativeTime = ({date}) => (
  <time dateTime={date}>{now.format(date)}</time>
);

const mkPageTitle = (data) =>
  `${data.markdownRemark.frontmatter.title} - ${data.site.siteMetadata.title}`;

export default ({data}) => (
  <div>
    <Helmet title={mkPageTitle(data)} />
    <Link to="/posts/">Posts</Link>
    <h1>{data.markdownRemark.frontmatter.title}</h1>(
    <RelativeTime date={data.markdownRemark.frontmatter.date} />)
    <div dangerouslySetInnerHTML={{__html: data.markdownRemark.html}} />
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
