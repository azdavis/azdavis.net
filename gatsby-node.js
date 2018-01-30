const path = require("path")
const post = path.resolve("src/templates/post.js")

exports.createPages = ({boundActionCreators: {createPage}, graphql}) =>
	graphql(`{
		allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			limit: 1000
		) {
			edges {
				node {
					frontmatter {
						path
					}
				}
			}
		}
	}`).then(result => {
		if (result.errors) {
			return Promise.reject(result.errors)
		}
		for (const {node} of result.data.allMarkdownRemark.edges) {
			createPage({
				path: node.frontmatter.path,
				component: post,
				context: {},
			})
		}
	})
