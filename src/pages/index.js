import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import css from "./index.module.css"

const MainTitle = ({children}) =>
	<h1 className={css.MainTitle}>{children}</h1>

const SecTitle = ({children}) =>
	<h2 className={css.SecTitle}>{children}</h2>

const SecContent = ({children}) =>
	<div className={css.SecContent}>{children}</div>

export default () => <div>
	<Helmet title="man azdavis"/>
	<MainTitle>NAME</MainTitle>
	<SecContent>azdavis - a fella</SecContent>
	<SecTitle>SYNOPSIS</SecTitle>
	<SecContent><code>
		azdavis (
			<Link to="resume/">resume</Link> {"| "}
			<Link to="posts/">posts</Link> {"| "}
			<Link to="projects/">projects</Link>
		)
	</code></SecContent>
	<SecTitle>DESCRIPTION</SecTitle>
	<SecContent>
		azdavis is pursuing a major in computer science, with a minor in
		Japanese studies, from Carnegie Mellon University.
	</SecContent>
	<SecTitle>AUTHORS</SecTitle>
	<SecContent>Written by David and Karen Davis.</SecContent>
	<SecTitle>COPYRIGHT</SecTitle>
	<SecContent>Copyright 1998 Ariel Davis.</SecContent>
</div>
