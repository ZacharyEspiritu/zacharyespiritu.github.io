---
layout: post
title:  "About This Site"
tagline: "A behind-the-scenes look"
card_color: "#333333"
ending:
  tagline: The source code of the entire site is available on Github.
  link: https://github.com/ZacharyEspiritu/zacharyespiritu.github.io
  link_text: view Github repo
---

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
