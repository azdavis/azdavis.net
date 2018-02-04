import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import timeago from "timeago.js"

const now = timeago()
export default ({data: {site, markdownRemark: {frontmatter, html}}}) => <div>
	<Helmet title={`${frontmatter.title} - ${site.siteMetadata.title}`}/>
	<Link to="/">azdavis.xyz</Link>
	<h1>{frontmatter.title}</h1>
	<time dateTime={frontmatter.date}>{now.format(frontmatter.date)}</time>
	<div dangerouslySetInnerHTML={{__html: html}}/>
</div>

export const pageQuery = graphql`
	query BlogPostByPath($path: String!) {
		markdownRemark(frontmatter: { path: { eq: $path } }) {
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
`
