import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import css from "./index.module.css"

const H1 = ({children}) =>
  <h1 className={css.H1}>{children}</h1>

const H2 = ({children}) =>
  <h2 className={css.H2}>{children}</h2>

const Div = ({children}) =>
  <div className={css.Div}>{children}</div>

const Dl = ({children}) =>
  <dl className={css.Dl}>{children}</dl>

export default () => <div>
  <Helmet title="man azdavis"/>
  <H1>NAME</H1>
  <Div>azdavis - a fella</Div>
  <H2>SYNOPSIS</H2>
  <Div><code>
    azdavis &lt;command&gt;
  </code></Div>
  <H2>DESCRIPTION</H2>
  <Div>
    azdavis is pursuing a major in computer science, with a minor in
    Japanese studies, from Carnegie Mellon University.
  </Div>
  <H2>COMMANDS</H2>
  <Div><Dl>
    <dt><Link to="/posts/"><code>posts</code></Link></dt>
    <dd>An assortment of thoughts.</dd>
    <dt><Link to="/profiles/"><code>profiles</code></Link></dt>
    <dd>A collection of accounts.</dd>
    <dt><Link to="/projects/"><code>projects</code></Link></dt>
    <dd>An assemblage of works.</dd>
    <dt><Link to="/resume/"><code>resume</code></Link></dt>
    <dd>A discussion of qualifications.</dd>
  </Dl></Div>
  <H2>AUTHORS</H2>
  <Div>Written by David and Karen Davis.</Div>
  <H2>COPYRIGHT</H2>
  <Div>Copyright 1998 Ariel Davis.</Div>
</div>
