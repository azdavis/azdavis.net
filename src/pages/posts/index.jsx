import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";

const mkPostLink = ({node}) => (
  <li key={node.id}>
    <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
  </li>
);

export default ({
  data: {
    site,
    allMarkdownRemark: {edges},
  },
}) => (
  <div>
    <Helmet title={`Posts - ${site.siteMetadata.title}`} />
    <Link to="/">Home</Link>
    <h1>Posts</h1>
    <ul>{edges.map(mkPostLink)}</ul>
  </div>
);

export const pageQuery = graphql`
  query Posts {
    allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}) {
      edges {
        node {
          id
          frontmatter {
            title
            path
            date
          }
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`;
