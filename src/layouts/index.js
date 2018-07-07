import React from "react"
import Helmet from "react-helmet"
import "./index.css"

export default ({children}) => <div>
  <Helmet>
    <html lang="en"/>
  </Helmet>
  {children()}
</div>
