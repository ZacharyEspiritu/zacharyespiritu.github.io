---
layout: post
title:  collab/space
image_path: /images/portfolio-collab-space.png
banner_path:
tagline: An online, collaborative IDE with a live-updating editor, in-browser code compilation, and video chat
card_color: "#41D9F4"
ending:
  tagline: collab/space was developed at Hack at Brown in January 2018.
  link: http://collab.space/
  link_text: visit site
skills: racket git
filters: software
---

# Premise

Finding time to work with other students on collaborative coding assignments can be difficult. More so, even if two people are available at the same time doesn't mean that they're necessarily available in the same place.

And, sometimes, coding interviews aren't that great due to miscommunication between interviewers and their candidates.

Wouldn't it be great if there was an online IDE that solves both of these problems in one go?

# Overview

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/collab-space/demo.jpg">
    <figcaption>
        A screenshot of the interface as presented at Hack at Brown.
    </figcaption>
</figure>

*collab/space* is an online IDE designed for real-time collaboration. It's designed to serve three needs:

1. Companies looking to interview candidates in technical interviews
2. Students who want an easy way to work with other students on the same assignment
3. Developers who simply want an easy way to share code with other people

It achieves this support through the following features:

* Live-updating text editor, supporting multi-person editing at once
* Framework for in-browser compilation, that can support multiple language (demo only includes Python)
* Video and audio communication for instant collaboration vibes
* Automatic persistence of updates to code


# Implementation

I used Meteor to develop reactive components that ultimately resulted in the live-updating text editor. I also used React for the front end and MongoDB for fast database updates. Finally, I used CodeMirror for syntax highlighting, OpenTok for video and audio chat, and, as featured in the demo, Skulpt for in-browser Python compilation.
