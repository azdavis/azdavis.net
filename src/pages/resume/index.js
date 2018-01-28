import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import css from "./index.module.css"

const Sep = () =>
	<span className={css.Sep}></span>

const Dl = ({children}) =>
	<dl className={css.Dl}>{children}</dl>

const Dd = ({children}) =>
	<dd className={css.Dd}>{children}</dd>

const Dt = ({children}) =>
	<dt className={css.Dt}>{children}</dt>

const mlWebapp =
	<a href="https://github.com/jerryyu8/tartanhacks-2017">
		machine learning webapp
	</a>

const cvPosterSim =
	<a href="https://github.com/mrama/Hack-CMU-2016">
		computer vision poster simulator
	</a>

const frontendDev =
	<a href="https://scottylabs.org/wdw/frontend">
		frontend development
	</a>

export default () => <div className={css.Root}>
	<Helmet title="Ariel Davis"/>
	<h1>Ariel Davis</h1>
	<div>
		<a data-print="azdavis@andrew.cmu.edu" href="mailto:azdavis@andrew.cmu.edu">Email</a>
		<Sep/>
		<a data-print="1-908-514-1006" href="tel:1-908-514-1006">Phone</a>
		<Sep/>
		<Link data-print="azdavis.xyz" to="/">Website</Link>
		<Sep/>
		<a data-print="github.com/azdavis" href="https://github.com/azdavis">GitHub</a>
	</div>
	<h2>Education</h2>
	<Dl>
		<Dt>May 2020</Dt>
		<Dd>
			<div>Carnegie Mellon University - Pittsburgh, PA</div>
			<div>B.S in Computer Science, Minor in Japanese Studies</div>
			<div>GPA 4.0</div>
		</Dd>
		<Dt>June 2016</Dt>
		<Dd>
			<div>Summit High School - Summit, NJ</div>
			<div>Summa Cum Laude</div>
		</Dd>
	</Dl>
	<h2>Selected Coursework</h2>
	<Dl>
		<Dt>Spring 2018</Dt>
		<Dd>
			<div>15-210: Parallel and Sequential Data Structures and Algorithms</div>
			<div>15-418: Parallel Computer Architecture and Programming</div>
			<div>82-272: Intermediate Japanese II</div>
		</Dd>
		<Dt>Fall 2017</Dt>
		<Dd>
			<div>15-213: Introduction to Computer Systems</div>
			<div>82-271: Intermediate Japanese I</div>
			<div>82-273: Introduction to Japanese Language and Culture</div>
		</Dd>
		<Dt>Summer 2017</Dt>
		<Dd>82-172: Elementary Japanese II</Dd>
		<Dt>Spring 2017</Dt>
		<Dd>
			<div>15-251: Great Theoretical Ideas in Computer Science</div>
			<div>82-171: Elementary Japanese I</div>
		</Dd>
		<Dt>Fall 2016</Dt>
		<Dd>
			<div>15-131: Great Practical Ideas in Computer Science</div>
			<div>15-150: Principles of Functional Programming</div>
		</Dd>
		<Dt>Summer 2015</Dt>
		<Dd>
			<div>15-122: Principles of Imperative Computation</div>
			<div>21-127: Concepts of Mathematics</div>
		</Dd>
	</Dl>
	<h2>Activities</h2>
	<Dl>
		<Dt>Spring 2018</Dt>
		<Dd>TA: 15-150</Dd>
		<Dt>Fall 2017</Dt>
		<Dd>TA: 15-131, 15-150</Dd>
		<Dt>Summer 2017</Dt>
		<Dd>TA: 15-150</Dd>
		<Dt>Spring 2017</Dt>
		<Dd>
			TartanHacks: helped to create a {mlWebapp}
		</Dd>
		<Dt>Fall 2016</Dt>
		<Dd>
			<div>HackCMU: helped to create a {cvPosterSim}</div>
			<div>ScottyLabs: gave a talk on basic {frontendDev}</div>
		</Dd>
		<Dt>Summer 2015</Dt>
		<Dd>
			Carnegie Mellon University Pre-College: took compressed-form CMU
			classes
		</Dd>
		<Dt>Summer 2014</Dt>
		<Dd>
			Northwestern University Center for Talent Development: learned
			HTML, CSS
		</Dd>
	</Dl>
	<h2>Achievements</h2>
	<Dl>
		<Dt>Fall 2016</Dt>
		<Dd>Dean's List</Dd>
		<Dt>Spring 2017</Dt>
		<Dd>Dean's List</Dd>
		<Dt>Fall 2017</Dt>
		<Dd>Dean's List</Dd>
		<Dt>2016</Dt>
		<Dd>
			<div>Summit High School Computer Science Award of Excellence</div>
			<div>National AP Scholar</div>
			<div>AP Scholar with Distinction</div>
		</Dd>
	</Dl>
	<h2>Skills</h2>
	<Dl>
		<Dt>Languages</Dt>
		<Dd>JavaScript, Haskell, Standard ML, Idris, Ruby, C</Dd>
		<Dt>Markup</Dt>
		<Dd>HTML, CSS, LaTeX, Markdown</Dd>
		<Dt>Tools</Dt>
		<Dd>Git, GitHub, Make, Shell, POSIX</Dd>
	</Dl>
</div>
