import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"

export default ({data: {site}}) => <div>
  <Helmet title={`Projects - ${site.siteMetadata.title}`}/>
  <Link to="/">Home</Link>
  <h1>Projects</h1>
  <dl>
    <dt><a href="/tic-tac-toe/">Tic-Tac-Toe</a></dt>
    <dd>A simple game.</dd>
    <dt><a href="/checkers/">Checkers</a></dt>
    <dd>A more complicated game.</dd>
  </dl>
</div>

export const pageQuery = graphql`
  query Projects {
    site {
      siteMetadata {
        title
      }
    }
  }
`
