---
layout: post
title:  "About"
tagline: "A behind-the-scenes look into the website (and myself, for good measure)"
card_color: "#4990E2"
ending:
  tagline: The source code of the entire site is available on Github.
  link: https://github.com/ZacharyEspiritu/zacharyespiritu.github.io
  link_text: view Github repo
---

# About Me

I was born in New Jersey, moved to Arizona when I was two, and moved back to New Jersey when I was nine. (Phew!) Right now, I'm in Providence, Rhode Island, where I'm studying computer science at Brown University.

Before Brown, I was a student at Regis High School, a tuition-free instutition located in the Upper East Side of Manhattan. I commuted ninety minutes each way, and it was great.

# About This Site

Hosted on [Github Pages][github-pages], this site is built on [Jekyll][jekyll], a static site generator built in Ruby. I built the site's theme from scratch, and the source code for it (licensed under the MIT license) can be found at my Github repo [here][source-code].

For the automatically sorting "cards" seen on the front page, I use [Isotope][isotope].

If you've viewed some of the articles or project writeups, you'll notice that the images only load after the page has rendered. I'm using [Lazysizes][lazysizes] to lazily load the images in for faster response times.

Finally, in order to make sure all the necessary, visual-based Javascript is loaded before the page renders, I use [PleaseWait][please-wait] to display a brief interstitial with a humorous loading message until the page is ready to display.

[github-pages]: https://pages.github.com/
[jekyll]: https://jekyllrb.com/
[source-code]: https://github.com/ZacharyEspiritu/zacharyespiritu.github.io
[isotope]: http://isotope.metafizzy.co/
[lazysizes]: http://afarkas.github.io/lazysizes/
[please-wait]: http://pathgather.github.io/please-wait/
