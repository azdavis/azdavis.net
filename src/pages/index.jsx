import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import "./index.css";

const Heading = ({children}) => <h1 className="Heading">{children}</h1>;

const Subheading = ({children}) => <h2 className="Subheading">{children}</h2>;

const Section = ({children}) => (
  <section className="Section">{children}</section>
);

const DescList = ({children}) => <dl className="DescList">{children}</dl>;

export default () => (
  <div>
    <Helmet title="man azdavis" />
    <Heading>NAME</Heading>
    <Section>azdavis - a fella</Section>
    <Subheading>SYNOPSIS</Subheading>
    <Section>
      <code>azdavis &lt;command&gt;</code>
    </Section>
    <Subheading>DESCRIPTION</Subheading>
    <Section>
      azdavis is pursuing a major in computer science, with a minor in Japanese
      studies, from Carnegie Mellon University.
    </Section>
    <Subheading>COMMANDS</Subheading>
    <Section>
      <DescList>
        <dt>
          <Link to="/posts/">
            <code>posts</code>
          </Link>
        </dt>
        <dd>An assortment of thoughts.</dd>
        <dt>
          <Link to="/profiles/">
            <code>profiles</code>
          </Link>
        </dt>
        <dd>A collection of accounts.</dd>
        <dt>
          <Link to="/projects/">
            <code>projects</code>
          </Link>
        </dt>
        <dd>An assemblage of works.</dd>
        <dt>
          <Link to="/resume/">
            <code>resume</code>
          </Link>
        </dt>
        <dd>A discussion of qualifications.</dd>
      </DescList>
    </Section>
    <Subheading>AUTHORS</Subheading>
    <Section>Written by David and Karen Davis.</Section>
    <Subheading>COPYRIGHT</Subheading>
    <Section>Copyright 1998 Ariel Davis.</Section>
  </div>
);
