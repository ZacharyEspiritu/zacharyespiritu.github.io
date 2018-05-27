---
layout: post
title:  Reaction Line
image_path: /images/portfolio-reaction.png
banner_path: /images/projects/reaction-line/banner.png
tagline: A minimalistic, single-player game for iOS about sorting lines in the shortest time
card_color: "#F5A623"
awards:
  - "\"Audience Choice\" at Make<br>School Demo Day 2015"
  - "\"Student Choice Runner-up\" at Make School Demo Day 2015"
ending:
  tagline: Reaction Line was released in July 2015.
  link: http://zacharyespiritu.com/ReactionLine
  link_text: visit site
skills: swift objective-c bootstrap sketch photoshop git
filters: software games
---

# Elevator Pitch

Designed to be as aggravating as it is addicting, [Reaction Line][reaction-line-website] is a minimalistic, single-player game where you have a single objective: sort lines into red and blue stacks as quickly as possible. The catch? You only have one life.

<figure class="two-screenshot-grid grid-padding lazyload">
    <img class="lazyload" data-src="/images/projects/reaction-line/timed-mode.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/infinite-mode.png">
    <figcaption>Pick your poison: Timed Mode on the left, Infinite Mode on the right.</figcaption>
</figure>

# Overview

Reaction Line was developed while I was studying at the [Make School Summer Academy][make-school-sa] in 2015. While players can select from one of three gamemodes to play from (Timed, Infinite, and Evil), the mechanic is the same throughout: sort the lines on the screen by tapping the color on the bottom that matches with the next line in the stack.

This sounds simple enough, but if a player makes a single mistake, the lines on the screen "break" and their run immediately ends. This makes for some slightly irritating yet extremely addicting gameplay—try handing the game to a friend to try out and watch their expressions as they figure out how to play the game.

<figure class="four-screenshot-grid lazyload">
    <img class="lazyload" data-src="/images/projects/reaction-line/main-menu.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/options-menu.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/stats-menu.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/social-menu.png">
    <figcaption>Screenshots of the main menu flow.</figcaption>
</figure>

# Implementation

I programmed the majority of the app in Swift using the open-source game engine [cocos2d-objc][cocos2d-github]. I also added [Mixpanel][mixpanel] for analytics.

Figuring out how to avoid memory errors was probably the hardest challenge I encountered in the creation of this app, as the large stack of lines generated on each run would inevitably cause the app to panic and crash about halfway through each run due to insufficient memory. To solve this, I only spawned enough lines to fill the screen's height, and simply recolored line assets when they moved off screen and teleport them back to the top.

## Design

I went for a minimalistic design and based my color choices off of those that went well with the primary beige background. Also, I'm generally opposed to placing separate, darker objects or panels underneath text just for contrast, so I added drop shadow where necessary to make the HUD more readable.

In terms of movement design, the only major animation in this game is the lose transition. When a player makes a mistake, all of the lines on the screen suddenly become askew (accompanied by a satisfying *boing* sound) and begin to fall down the screen. I spent a lot of time on this one because I figured that this was the animation that players would see the most. (I'm evil, I know.)

<figure class="six-screenshot-grid lazyload">
    <img class="lazyload" data-src="/images/projects/reaction-line/old-endgame-1.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/old-endgame-2.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/old-endgame-3.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/old-endgame-4.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/win-screen.png">
    <img class="lazyload" data-src="/images/projects/reaction-line/lose-screen.png">
    <figcaption>It took several iterations to convey just the right amount of joy/disappointment at the end of a round.</figcaption>
</figure>

# Result

At the Demo Day at the end of the program, Reaction Line (along with [Tile, Tap, Push!][tile-tap-push-post], another project I worked on while at Make School) won the "Audience Choice" award as voted by the vistors in attendance. As a result, I was able to present both of my projects in front of everyone (approximately 100 people). I also received the "Student Choice Runner-Up" award as selected by my fellow students in the program.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/reaction-line/make-school-presentation.jpg">
</figure>

You can view a video of my entire presentation [here][make-school-demo-day-video]. Reaction Line is also available on the App Store [here][reaction-line-app-store].

[reaction-line-website]: http://zacharyespiritu.com/ReactionLine
[make-school-sa]: https://www.makeschool.com/summer-academy
[cocos2d-github]: https://github.com/cocos2d/cocos2d-objc
[mixpanel]: http://mixpanel.com/
[tile-tap-push-post]: /project/tile-tap-push
[make-school-demo-day-video]: https://www.youtube.com/watch?v=beEeJ__wOR8
[reaction-line-app-store]: https://itunes.apple.com/us/app/reaction-line-game-about-sorting/id1018598686
