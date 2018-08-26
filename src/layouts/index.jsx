import React from "react";
import Helmet from "react-helmet";
import "./index.css";

export default ({children}) => (
  <div>
    <Helmet>
      <html lang="en" />
      <meta name="referrer" content="no-referrer" />
      <link rel="icon" href="/favicon.png" />
    </Helmet>
    {children()}
  </div>
);
