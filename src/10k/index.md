As our devices get faster and better, and web standards and technologies
improve, so too do the websites we visit.

…by some measures. Certainly, it has never before been possible to create web
experiences with such interactivity and depth. Yet, websites have also never
before been as bloated with distracting ads, huge images, and invasive tracking
scripts and cookies. Increased processing power is offset by ever-huger
websites.

Much has been said on this conundrum. Major tech companies have brought their
proposed solutions ([one][amp], [two][ins]) to the table. Designers have
expressed their frustration with "heavy" websites ([one][woc], [two][mw],
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

`gzip` is a program that uses the [DEFLATE][] algorithm to compress files.
Servers can be configured to automatically `gzip` source files and serve these
compressed files to users, whose computers then decompress the compressed file.

[DEFLATE]: https://en.wikipedia.org/wiki/DEFLATE

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
user is called HTTP. In HTTP 1, each new request for another document takes a
little extra time. Although this problem is solved in HTTP 2, HTTP 1 is still
widespread enough that we need to worry about it.

If, instead of the first HTML document requesting other documents, we just
included the contents of those other documents in the first document, we could
reduce the number of HTTP requests, causing the page to load faster.

If `style.css` looks like this:

    html {
        color: #333;
        font: 18px/1.5 Georgia, serif;
    }

And `script.js` looks like this:

    console.log("How did this make it to production?")

Then by inlining these files' contents,

    <!DOCTYPE html>
    <html>
        <head>
            <title>Hello</title>
            <style>
                html {
                    color: #333;
                    font: 18px/1.5 Georgia, serif;
                }
            </style>
        </head>
        <body>
            <p>World</p>
            <script>
                console.log("How did this make it to production?")
            </script>
        </body>
    </html>

we can reduce the number of HTTP requests from 3 to 1.

Note, however, that we should minify everything as well.

    <!DOCTYPE html><html><head><title>Hello</title><style>html{color:#333;font:18px/1.5 Georgia,serif}</style></head><body><p>World</p><script>console.log("How did this make it to production?")</script></body></html>

## Have less stuff

No matter how much one compresses, certain types of large files will always
contribute a big amount to a page size. For such resources, one should perform
an exacting cost-basis analysis to decide whether to keep such resources or
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

## Use tooling

Automated services can fetch your website, measure the time it took until first
load, and provide feedback on how to improve the performance and accessibility
of your site. [PageSpeed Insights][] is one such service.

[PageSpeed Insights]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz/10k
