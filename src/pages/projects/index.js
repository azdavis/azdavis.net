import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"

export default ({data: {site}}) => <div>
	<Helmet title={`Projects - ${site.siteMetadata.title}`}/>
	<Link to="/">Home</Link>
	<h1>Projects</h1>
	<ul>
		<li><a href="/tic-tac-toe/">Tic-Tac-Toe</a></li>
		<li><a href="/checkers/">Checkers</a></li>
	</ul>
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
