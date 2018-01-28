import React from "react"
import "./index.css"

const ResumePage = () => <div>
	<h1>Ariel Davis</h1>
	<div>
		<a data-print="azdavis@andrew.cmu.edu" href="mailto:azdavis@andrew.cmu.edu">Email</a>
		<span className="sep"></span>
		<a data-print="1-908-514-1006" href="tel:1-908-514-1006">Phone</a>
		<span className="sep"></span>
		<Link data-print="azdavis.xyz" to="/">Website</Link>
		<span className="sep"></span>
		<a data-print="github.com/azdavis" href="https://github.com/azdavis">GitHub</a>
	</div>
	<h2>Education</h2>
	<dl>
		<dt>May 2020</dt>
		<dd>
			<p>Carnegie Mellon University - Pittsburgh, PA</p>
			<p>B.S in Computer Science, Minor in Japanese Studies</p>
			<p>GPA 4.0</p>
		</dd>
		<dt>June 2016</dt>
		<dd>
			<p>Summit High School - Summit, NJ</p>
			<p>Summa Cum Laude</p>
		</dd>
	</dl>
	<h2>Selected Coursework</h2>
	<dl>
		<dt>Spring 2018</dt>
		<dd>
			<p>15-210: Parallel and Sequential Data Structures and Algorithms</p>
			<p>15-418: Parallel Computer Architecture and Programming</p>
			<p>82-272: Intermediate Japanese II</p>
		</dd>
		<dt>Fall 2017</dt>
		<dd>
			<p>15-213: Introduction to Computer Systems</p>
			<p>82-271: Intermediate Japanese I</p>
			<p>82-273: Introduction to Japanese Language and Culture</p>
		</dd>
		<dt>Summer 2017</dt>
		<dd>82-172: Elementary Japanese II</dd>
		<dt>Spring 2017</dt>
		<dd>
			<p>15-251: Great Theoretical Ideas in Computer Science</p>
			<p>82-171: Elementary Japanese I</p>
		</dd>
		<dt>Fall 2016</dt>
		<dd>
			<p>15-131: Great Practical Ideas in Computer Science</p>
			<p>15-150: Principles of Functional Programming</p>
		</dd>
		<dt>Summer 2015</dt>
		<dd>
			<p>15-122: Principles of Imperative Computation</p>
			<p>21-127: Concepts of Mathematics</p>
		</dd>
	</dl>
	<h2>Activities</h2>
	<dl>
		<dt>Spring 2018</dt>
		<dd>TA: 15-150</dd>
		<dt>Fall 2017</dt>
		<dd>TA: 15-131, 15-150</dd>
		<dt>Summer 2017</dt>
		<dd>TA: 15-150</dd>
		<dt>Spring 2017</dt>
		<dd>
			TartanHacks: helped to create a
			<a href="https://github.com/jerryyu8/tartanhacks-2017">machine learning webapp</a>
		</dd>
		<dt>Fall 2016</dt>
		<dd>
			<p>
				HackCMU: helped to create a
				<a href="https://github.com/mrama/Hack-CMU-2016">computer vision poster simulator</a>
			</p>
			<p>
				ScottyLabs: gave a talk on basic
				<a href="https://scottylabs.org/wdw/frontend">frontend development</a>
			</p>
		</dd>
		<dt>Summer 2015</dt>
		<dd>
			Carnegie Mellon University Pre-College: took compressed-form CMU
			classes
		</dd>
		<dt>Summer 2014</dt>
		<dd>
			Northwestern University Center for Talent Development: learned
			HTML, CSS
		</dd>
	</dl>
	<h2>Achievements</h2>
	<dl>
		<dt>Fall 2016</dt>
		<dd>Dean's List</dd>
		<dt>Spring 2017</dt>
		<dd>Dean's List</dd>
		<dt>Fall 2017</dt>
		<dd>Dean's List</dd>
		<dt>2016</dt>
		<dd>
			<p>Summit High School Computer Science Award of Excellence</p>
			<p>National AP Scholar</p>
			<p>AP Scholar with Distinction</p>
		</dd>
	</dl>
	<h2>Skills</h2>
	<dl>
		<dt>Languages</dt>
		<dd>JavaScript, Haskell, Standard ML, Idris, Ruby, C</dd>
		<dt>Markup</dt>
		<dd>HTML, CSS, LaTeX, Markdown</dd>
		<dt>Tools</dt>
		<dd>Git, GitHub, Make, Shell, POSIX</dd>
	</dl>
</div>
