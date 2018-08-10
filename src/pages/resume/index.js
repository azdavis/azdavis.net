import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import css from "./index.module.css";

const H1 = ({children}) => <h1 className={css.H1}>{children}</h1>;

const H2 = ({children}) => <h2 className={css.H2}>{children}</h2>;

const Defn = ({children}) => <div className={css.Defn}>{children}</div>;

const Term = ({children}) => <div className={css.Term}>{children}</div>;

const mlWebapp = (
  <a href="https://github.com/jerryyu8/tartanhacks-2017">
    machine learning webapp
  </a>
);

const cvPosterSim = (
  <a href="https://github.com/mrama/Hack-CMU-2016">
    computer vision poster simulator
  </a>
);

const frontendDev = (
  <a href="https://scottylabs.org/wdw/frontend">frontend development</a>
);

const InfoA = ({children, href, print}) => (
  <span className={css.SepAfter}>
    <a className={css.Print} data-print={print} href={href}>
      {children}
    </a>
  </span>
);

const InfoLink = ({children, to, print}) => (
  <span className={css.SepAfter}>
    <Link className={css.Print} data-print={print} to={to}>
      {children}
    </Link>
  </span>
);

export default ({data: {site}}) => (
  <div>
    <Helmet title={`Resume - ${site.siteMetadata.title}`} />
    <H1>Ariel Davis</H1>
    <div>
      <InfoA
        href="mailto:ariel.z.davis@icloud.com"
        print="ariel.z.davis@icloud.com"
      >
        Email
      </InfoA>
      <InfoA print="1-908-514-1006" href="tel:1-908-514-1006">
        Phone
      </InfoA>
      <InfoLink print="azdavis.xyz" to="/">
        Website
      </InfoLink>
      <InfoA print="github.com/azdavis" href="https://github.com/azdavis">
        GitHub
      </InfoA>
    </div>
    <H2>Education</H2>
    <Term>May 2020</Term>
    <Defn>
      <div>Carnegie Mellon University - Pittsburgh, PA</div>
      <div>B.S in Computer Science, Minor in Japanese Studies</div>
      <div>GPA ~3.9</div>
    </Defn>
    <Term>June 2016</Term>
    <Defn>
      <div>Summit High School - Summit, NJ</div>
      <div>Summa Cum Laude</div>
    </Defn>
    <H2>Selected Coursework</H2>
    <Term>Fall 2018</Term>
    <Defn>
      <div>15-312: Foundations of Programming Languages</div>
      <div>15-440: Distributed Systems</div>
      <div>82-371: Advanced Japanese I</div>
      <div>82-373: Structure of the Japanese Language</div>
    </Defn>
    <Term>Spring 2018</Term>
    <Defn>
      <div>15-210: Parallel and Sequential Data Structures and Algorithms</div>
      <div>15-418: Parallel Computer Architecture and Programming</div>
      <div>82-272: Intermediate Japanese II</div>
    </Defn>
    <Term>Fall 2017</Term>
    <Defn>
      <div>15-213: Introduction to Computer Systems</div>
      <div>82-271: Intermediate Japanese I</div>
      <div>82-273: Introduction to Japanese Language and Culture</div>
    </Defn>
    <H2>Activities</H2>
    <Term>Summer 2018</Term>
    <Defn>Internship: Stripe</Defn>
    <Term>Spring 2018</Term>
    <Defn>TA: 15-150</Defn>
    <Term>Fall 2017</Term>
    <Defn>TA: 15-131, 15-150</Defn>
    <Term>Summer 2017</Term>
    <Defn>TA: 15-150</Defn>
    <Term>Spring 2017</Term>
    <Defn>TartanHacks: helped to create a {mlWebapp}</Defn>
    <Term>Fall 2016</Term>
    <Defn>
      <div>HackCMU: helped to create a {cvPosterSim}</div>
      <div>ScottyLabs: gave a talk on basic {frontendDev}</div>
    </Defn>
    <Term>Summer 2015</Term>
    <Defn>
      Carnegie Mellon University Pre-College: took compressed-form CMU classes
    </Defn>
    <Term>Summer 2014</Term>
    <Defn>
      Northwestern University Center for Talent Development: learned HTML, CSS
    </Defn>
    <H2>Skills</H2>
    <Term>Languages</Term>
    <Defn>JavaScript, Standard ML, Rust, Ruby, C</Defn>
    <Term>Markup</Term>
    <Defn>HTML, CSS, LaTeX, Markdown</Defn>
    <Term>Tools</Term>
    <Defn>Git, GitHub, Make, Shell, POSIX</Defn>
  </div>
);

export const pageQuery = graphql`
  query Resume {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
