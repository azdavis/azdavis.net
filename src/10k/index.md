As our devices get faster and better, and web standards and technologies
improve, so too do the websites we visit.

…by some measures. Certainly, it has never before been possible to create web
experiences with such interactivity and depth. Yet, websites have also never
before been as bloated with distracting ads, huge images, and invasive tracking
scripts and cookies. Increased processing power is offset by ever-huger
websites.

Much has been said on this conundrum. Major tech companies have brought their
proposed solutions ([one][amp], [two][ins]) to the table. Designers have
expressed their frustration with overlarge websites ([one][woc], [two][mw],
[three][bmw]). Competitions have been created to encourage the practice of
reducing website size as much as possible ([one][5k], [two][10k]).

[amp]: https://www.ampproject.org
[ins]: https://instantarticles.fb.com
[woc]: http://idlewords.com/talks/website_obesity.htm
[mw]: http://motherfuckingwebsite.com
[bmw]: http://bettermotherfuckingwebsite.com
[5k]: http://www.the5k.org/about.php
[10k]: https://a-k-apart.com

How, then, can one craft a website, while making sure it is as small as
possible and loads as quickly as possible?

## Minification

A file of source code can be transformed into a new file which conveys the
exact same set of instructions to the computer, but is smaller. This process of
transformation is called minification.

Consider this small CSS file:

    body {
        max-width: 40em;
        margin: 1em auto;
        padding: 10px;
    }

With the use of a minifier, we can create a minified version of this file.

    body{max-width:40em;margin:1em auto;padding:10px}

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

`gzip` is a program that uses the [DEFLATE][] algorithm to compress files.
Servers can be configured to automatically `gzip` source files and serve these
compressed files to users, whose computers then decompress the compressed file.

[DEFLATE]: https://en.wikipedia.org/wiki/DEFLATE

This page, for instance, is about 10000 bytes, but using `gzip` (that's the `z`
in the `tar` command), its size is reduced to about 4000 bytes - less than half
the size.

    $ tar czf index.tar.gz index.html
    $ stat -c %s index.html index.tar.gz
    9730
    4241

Note that this example is purely illustrative - with a properly configured
server, like [Surge][], this is done automatically.

[Surge]: https://surge.sh

### Lossy

Some files like images and videos can be compressed lossily. Lossy compression
algorithms remove unnecessary or less important data from files, creating a
new, smaller file. In this case, data is lost, but lossy compression algorithms
([TinyPNG][], [Lepton][]) are quite good at only removing data whose absence a
user wouldn't notice.

[TinyPNG]: https://tinypng.com
[Lepton]: https://github.com/dropbox/lepton

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
user is called [HTTP][]. In HTTP/1.1, each new request for another document
takes a little extra time. Although this problem is solved in [HTTP/2][],
HTTP/1.1 is still widespread enough that we need to worry about it.

[HTTP]: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
[HTTP/2]: https://en.wikipedia.org/wiki/HTTP/2

If, instead of the first HTML document requesting other documents, we just
included the contents of those other documents in the first document, we could
reduce the number of HTTP requests, causing the page to load faster.

If `style.css` looks like this:

    body {
        max-width: 40em;
        margin: 1em auto;
        padding: 10px;
    }

And `script.js` looks like this:

    console.log("The devtools are open!")

Then by inlining these files' contents,

    <!DOCTYPE html>
    <html>
        <head>
            <title>Hello</title>
            <style>
                body {
                    max-width: 40em;
                    margin: 1em auto;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <p>World</p>
            <script>
                console.log("The devtools are open!")
            </script>
        </body>
    </html>

we can reduce the number of HTTP requests from 3 to 1.

Note, however, that we should minify everything as well.

    <!DOCTYPE html><html><head><title>Hello</title><style>body{max-width:40em;margin:1em auto;padding:10px}</style></head><body><p>World</p><script>console.log("The devtools are open!")</script></body></html>

## Use tooling

Automated services can fetch your website, measure the time it took until first
load, and provide feedback on how to improve the performance and accessibility
of your site. [PageSpeed Insights][] is one such service. It's also worth
paying attention to the browser developer tools, specifically the sections on
performance and network requests.

[PageSpeed Insights]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz/10k

## Have less stuff

No matter how much one compresses, certain types of large files will always
contribute a big amount to a page size. For such resources, one should perform
an exacting cost-benefit analysis to decide whether to keep such resources or
ditch them.

For instance, does downloading 100KB of webfont help your site because you're
able to choose the exact appearance of your text, or is the benefit given by
custom fonts not worth the extra few hundred milliseconds of page load?
Consider also the unsavory [flash of unstyled text][] as the webfont downloads.

[flash of unstyled text]:  https://en.wikipedia.org/wiki/Flash_of_unstyled_content

Does including a large hero image at the top of your page really increase user
engagement, or does it simply serve to make load times longer and frustrate
users as they are forced to scroll down to the beginning of the actual content?

Are dozens of tracking scripts, analytics services, and advertisement providers
really necessary, or can you get by with just one or two? Or none?

## A case study

This site was put together with the help of `make` and a few `npm`
devDependencies. It's written in [Pug][], [Stylus][], and [TypeScript][], which
respectively compile to HTML, CSS, and JavaScript. I use Pug's `include`
directive to inline the compiled (and [Browserify][]'d if necessary) CSS and
JavaScript, then run it through [an HTML minifier][] (which also minifies the
included CSS and JavaScript). All of this is coordinated with a makefile; one
can check it out on [GitHub][].

<p id="load"></p>

[Pug]: http://pug.timothygu.me
[Stylus]: http://stylus-lang.com
[TypeScript]: https://www.typescriptlang.org
[Browserify]: http://browserify.org
[an HTML minifier]: http://perfectionkills.com/experimenting-with-html-minifier
[GitHub]: https://github.com/azdavis/azdavis.xyz

---

## About the author

I'm Ariel Davis, and I study computer science at Carnegie Mellon. You probably
shouldn't trust what I say. Learn more on [Keybase][].

[Keybase]: https://keybase.io/azdavis
