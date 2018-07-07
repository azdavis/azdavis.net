import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"

export default ({data: {site}}) => <div>
  <Helmet title={`404 Not Found - ${site.siteMetadata.title}`}/>
  <Link to="/">Home</Link>
  <h1>404 Not Found</h1>
  <p>This page does not exist</p>
</div>

export const pageQuery = graphql`
  query FourOhFour {
    site {
      siteMetadata {
        title
      }
    }
  }
`
