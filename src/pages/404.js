import React from "react"
import Helmet from "react-helmet"

export default ({data: {site}}) => <div>
	<Helmet title={`404 Not Found - ${site.siteMetadata.title}`}/>
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
