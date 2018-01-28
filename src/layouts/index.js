import React from "react"
import Helmet from "react-helmet"
import "./index.css"

export default ({children}) => <div>
	<Helmet>
		<html lang="en"/>
		<link rel="icon" href="/favicon.png"/>
	</Helmet>
	{children()}
</div>
