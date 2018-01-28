import React from "react"
import Link from "gatsby-link"
import "./index.css"

const IndexPage = () => <div>
	<h1>NAME</h1>
	<div className="sec">azdavis - a fella</div>
	<h2>SYNOPSIS</h2>
	<div className="sec">azdavis <Link to="resume">--show-resume</Link></div>
	<h2>DESCRIPTION</h2>
	<div className="sec">
		azdavis is pursuing a major in computer science, with a minor in
		Japanese studies, from Carnegie Mellon University.
	</div>
	<h2>PROFILES</h2>
	<dl className="sec">
		<dt><a href="https://github.com/azdavis">GitHub</a></dt>
		<dd>A server for git remotes.</dd>
		<dt><a href="https://www.reddit.com/user/azdavis">Reddit</a></dt>
		<dd>A place for people to discuss things.</dd>
		<dt><a href="https://news.ycombinator.com/user?id=azdavis">Hacker News</a></dt>
		<dd>A place for hackers to discuss things.</dd>
		<dt><a href="https://keybase.io/azdavis">Keybase</a></dt>
		<dd>A place for verification of profile ownership.</dd>
	</dl>
	<h2>AUTHORS</h2>
	<div className="sec">Written by David and Karen Davis.</div>
	<h2>COPYRIGHT</h2>
	<div className="sec">Copyright 1998 Ariel Davis.</div>
</div>

export default IndexPage
