import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";

const links = {
  mlWebapp: "https://github.com/jerryyu8/tartanhacks-2017",
  cvPoster: "https://github.com/mrama/Hack-CMU-2016",
  frontendDev: "https://scottylabs.org/wdw/frontend",
};

export default ({data: {site}}) => (
  <div>
    <Helmet title={`Resume - ${site.siteMetadata.title}`} />
    <h1>Ariel Davis</h1>
    <dl>
      <dt>Email</dt>
      <dd>
        <a href="mailto:ariel.z.davis@icloud.com">ariel.z.davis@icloud.com</a>
      </dd>
      <dt>Website</dt>
      <dd>
        <Link to="/">azdavis.xyz</Link>
      </dd>
      <dt>GitHub</dt>
      <dd>
        <a href="https://github.com/azdavis">azdavis</a>
      </dd>
    </dl>
    <h2>Education</h2>
    <dl>
      <dt>May 2020</dt>
      <dd>
        <div>Carnegie Mellon University - Pittsburgh, PA</div>
        <div>B.S in Computer Science, Minor in Japanese Studies</div>
        <div>GPA ~3.9</div>
      </dd>
      <dt>June 2016</dt>
      <dd>
        <div>Summit High School - Summit, NJ</div>
        <div>Summa Cum Laude</div>
      </dd>
    </dl>
    <h2>Selected Coursework</h2>
    <dl>
      <dt>Fall 2018</dt>
      <dd>
        <div>15-312: Foundations of Programming Languages</div>
        <div>15-440: Distributed Systems</div>
        <div>82-371: Advanced Japanese I</div>
        <div>82-373: Structure of the Japanese Language</div>
      </dd>
      <dt>Spring 2018</dt>
      <dd>
        <div>
          15-210: Parallel and Sequential Data Structures and Algorithms
        </div>
        <div>15-418: Parallel Computer Architecture and Programming</div>
        <div>82-272: Intermediate Japanese II</div>
      </dd>
      <dt>Fall 2017</dt>
      <dd>
        <div>15-213: Introduction to Computer Systems</div>
        <div>82-271: Intermediate Japanese I</div>
        <div>82-273: Introduction to Japanese Language and Culture</div>
      </dd>
    </dl>
    <h2>Activities</h2>
    <dl>
      <dt>Summer 2018</dt>
      <dd>Internship at Stripe: improved upon an internal CodePen-like tool</dd>
      <dt>Spring 2018</dt>
      <dt>Fall 2017</dt>
      <dt>Summer 2017</dt>
      <dd>
        Teaching Assistant: for an introductory functional programming class
      </dd>
      <dt>Spring 2017</dt>
      <dd>
        TartanHacks: helped to create a{" "}
        <a href={links.mlWebapp}>machine learning webapp</a>
      </dd>
      <dt>Fall 2016</dt>
      <dd>
        <div>
          HackCMU: helped to create a{" "}
          <a href={links.cvPoster}>computer vision poster simulator</a>
        </div>
        <div>
          ScottyLabs: gave a talk on basic{" "}
          <a href={links.frontendDev}>frontend development</a>
        </div>
      </dd>
      <dt>Summer 2015</dt>
      <dd>
        Carnegie Mellon University Pre-College: took compressed-form CMU classes
      </dd>
      <dt>Summer 2014</dt>
      <dd>
        Northwestern University Center for Talent Development: learned HTML, CSS
      </dd>
      <h2>Skills</h2>
      <dt>Languages</dt>
      <dd>JavaScript, Standard ML, Rust, Ruby, C</dd>
      <dt>Markup</dt>
      <dd>HTML, CSS, LaTeX, Markdown</dd>
      <dt>Tools</dt>
      <dd>Git, GitHub, Make, Shell, POSIX</dd>
    </dl>
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
