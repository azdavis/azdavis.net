import React from "react"

export default ({data: {markdownRemark: {frontmatter, html}}}) =>
	<div>
		<h1>{frontmatter.title}</h1>
		<h2>{frontmatter.date}</h2>
		<div dangerouslySetInnerHTML={{__html: html}}/>
	</div>

export const pageQuery = graphql`
	query BlogPostByPath($path: String!) {
		markdownRemark(frontmatter: { path: { eq: $path } }) {
			html
			frontmatter {
				date(formatString: "YYYY-MM-DD")
				path
				title
			}
		}
	}
`
