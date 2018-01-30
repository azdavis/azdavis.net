module.exports = {
	siteMetadata: {
		title: "man azdavis",
	},
	plugins: [
		"gatsby-plugin-react-helmet",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				path: `${__dirname}/src/posts`,
				name: "markdown-pages",
			}
		},
		{
			resolve: "gatsby-transformer-remark",
			options: {
				plugins: [
					"gatsby-remark-prismjs",
				],
			},
		},
	],
}
