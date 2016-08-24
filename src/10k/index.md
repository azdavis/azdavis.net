# Avoiding website bloat

As our devices get faster and better, and web standards and technologies
improve, so too do the websites we visit.

…by some measures. Certainly, it has never before been possible to create web
experiences with such interactivity and depth. Yet, websites have also never
before been as bloated with distracting ads, huge images, and invasive tracking
scripts and cookies. Increased processing power is offset by ever-huger
websites.

Much has been said on this website obesity crisis. Major tech companies have
brought their proposed solutions ([one][amp], [two][ins]) to the table.
Designers have expressed their frustration with "heavy" websites ([one][woc],
[two][mws], [three][bmw]). Competitions have been created to encourage the
practice of reducing website size as much as possible ([one][c5k], [two][c1k]).

[amp]: https://www.ampproject.org
[ins]: https://instantarticles.fb.com
[woc]: http://idlewords.com/talks/website_obesity.htm
[mws]: http://motherfuckingwebsite.com
[bmw]: http://bettermotherfuckingwebsite.com
[c5k]: http://www.the5k.org/about.php
[c1k]: https://a-k-apart.com

How, then, can one craft a website, while making sure it is as small as
possible and loads as quickly as possible?

## Minification

A file of source code can be transformed into a new file which conveys the
exact same set of instructions to the computer, but is smaller. This process of
transformation is called minification.

Consider this small CSS file:

    html {
        color: #333;
        font: 18px/1.5 Georgia, serif;
    }

    body {
        max-width: 40em;
        margin: 0 auto;
        padding: 10px;
    }

With the use of a minifier, we can create a minified version of this file.

    html{color:#333;font:18px/1.5 Georgia,serif}body{max-width:40em;margin:0 auto;padding:10px}

The original file and the minified file instruct the computer to do exactly the
same things. The original file is clearly superior for human programmers to
work with, but since the minified file is smaller, it should be served to
users.

Bear in mind that while we have reduced the size of this file, no meaning is
lost. Then, one can view minification as a form of lossless compression.
Speaking of which,

## Compression

### Lossless

Any file can be transformed into a new file by identifying repeating patterns
in the file, and encoding these patterns. This avoids redundancies in the file,
decreasing its size. This process of transformation is called lossless
compression.

In the specific case of lossless compression, again, no data is lost (hence the
name). By applying a reverse transformation, we can get back the original file.

[gzp]: http://www.gzip.org
[dfl]: https://en.wikipedia.org/wiki/DEFLATE

[`gzip`][gzp] is a program that uses an algorithm called [DEFLATE][dfl] to
compress files. Servers can be configured to automatically `gzip` source files
and serve these compressed files to users, whose computers then decompress the
compressed file.

### Lossy

Some files like images and videos can be compressed lossily. Lossy compression
algorithms remove unnecessary or less important data from files, creating a
new, smaller file. In this case, data *is* lost, but [many][tpg] lossy
compression algorithms are quite good at only removing data whose absence a
user wouldn't notice.

[tpg]: https://tinypng.com

## Inlining

A HTML document can request other documents with `link href` or `script src`.

    <!DOCTYPE html>
    <html>
        <head>
            <title>Hello</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <p>World</p>
            <script src="script.js"></script>
        </body>
    </html>

The protocol by which HTML and other documents are transferred from server to
user is called HTTP. In HTTP 1, each new request for another document takes a
little extra time. Although this problem is solved in HTTP 2, HTTP 1 is still
widespread enough that we need to worry about it.

If, instead of the first HTML document requesting other documents, we just
included the contents of those other documents in the first document, we could
reduce the number of HTTP requests, causing the page to load faster.

If `style.css` and `script.js` look like this:
