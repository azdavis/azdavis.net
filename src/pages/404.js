import React from "react"
import Helmet from "react-helmet"
import css from "./404.module.css"

export default () => <div className={css.Root}>
	<Helmet title="404 Not Found"/>
	<h1>404 Not Found</h1>
	<p>This page does not exist</p>
</div>
