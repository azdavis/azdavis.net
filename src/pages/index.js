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

const Dl = ({children}) =>
	<dl className={css.Dl}>{children}</dl>

const Dd = ({children}) =>
	<dd className={css.Dd}>{children}</dd>

const Dt = ({children}) =>
	<dt className={css.Dt}>{children}</dt>

export default () => <div className={css.Root}>
	<Helmet title="man azdavis"/>
	<MainTitle>NAME</MainTitle>
	<SecContent>azdavis - a fella</SecContent>
	<SecTitle>SYNOPSIS</SecTitle>
	<SecContent>azdavis <Link to="resume">--show-resume</Link></SecContent>
	<SecTitle>DESCRIPTION</SecTitle>
	<SecContent>
		azdavis is pursuing a major in computer science, with a minor in
		Japanese studies, from Carnegie Mellon University.
	</SecContent>
	<SecTitle>PROFILES</SecTitle>
	<SecContent><Dl>
		<Dt><a href="https://github.com/azdavis">GitHub</a></Dt>
		<Dd>A server for git remotes.</Dd>
		<Dt><a href="https://www.reddit.com/user/azdavis">Reddit</a></Dt>
		<Dd>A place for people to discuss things.</Dd>
		<Dt><a href="https://news.ycombinator.com/user?id=azdavis">Hacker News</a></Dt>
		<Dd>A place for hackers to discuss things.</Dd>
		<Dt><a href="https://keybase.io/azdavis">Keybase</a></Dt>
		<Dd>A place for verification of profile ownership.</Dd>
	</Dl></SecContent>
	<SecTitle>AUTHORS</SecTitle>
	<SecContent>Written by David and Karen Davis.</SecContent>
	<SecTitle>COPYRIGHT</SecTitle>
	<SecContent>Copyright 1998 Ariel Davis.</SecContent>
</div>
