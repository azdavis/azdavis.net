import React from "react"
import PropTypes from "prop-types"
import Header from "../components/Header"
import "./index.css"

const TemplateWrapper = ({ children }) =>
	<div>
		<Header/>
		{children()}
	</div>

TemplateWrapper.propTypes = {
	children: PropTypes.func,
}

export default TemplateWrapper
