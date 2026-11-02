# personal-website
The current version of my personal website, built using Jekyll.

## Installation

```console
git clone https://github.com/ZacharyEspiritu/zacharyespiritu.github.io.git
cd zacharyespiritu.github.io
bundle install
bundle exec jekyll serve
```

## HTML minification

The site uses [jekyll-compress-html](https://github.com/penibelst/jekyll-compress-html)
v3.2.0 as its outermost layout. It minifies generated HTML during the regular
GitHub Pages build, without requiring an unsupported Ruby plugin. The vendored
layout is in `_layouts/compress.html`, and its MIT license is in
`licenses/jekyll-compress-html.txt`. Sass already produces compressed CSS.

## Upcoming events

Edit `_data/events.yml` to update the yellow panel beneath the profile photo.
Each entry has a quoted `date` label and a `text` description (Markdown links
and emphasis are supported). Entries display in file order and wrap to fit
the panel. Remove past events manually; use `[]` to hide the panel entirely.

## Blog figures

The post layout labels top-level `<figure>` elements with a `<figcaption>` as
Figure A, Figure B, and so on. Write the caption text without the label; it
becomes a permalink that copies the figure's URL when clicked. Give figures
descriptive IDs so their links stay stable if you reorder them:

```html
<figure id="figure-example">
  <img src="/images/example.png" alt="Description of the image">
  <figcaption>What the figure shows.</figcaption>
</figure>
```

The ID is optional; the page will generate one from the figure letter if needed.
For an in-text reference, use `<a href="#figure-example" data-figure-ref>the figure</a>`.
The displayed letter then updates automatically with the figure order. Use the
`paper-figure` class and `paper-figure-viewport` wrapper for the text-width
figure layout with captions in the right margin on wide screens.
