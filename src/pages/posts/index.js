import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import timeago from "timeago.js"

const now = timeago()
const PostLink = ({id, frontmatter}) => <li key={id}>
	<Link to={frontmatter.path}>{frontmatter.title}</Link>
	{" "}
	(<time dateTime={frontmatter.date}>{now.format(frontmatter.date)}</time>)
</li>

export default ({data: {site, allMarkdownRemark: {edges}}}) => <div>
	<Helmet title={`Posts - ${site.siteMetadata.title}`}/>
	<Link to="/">home</Link>
	<h1>Posts</h1>
	<ul>
		{edges.map(edge => PostLink(edge.node))}
	</ul>
</div>

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
`
