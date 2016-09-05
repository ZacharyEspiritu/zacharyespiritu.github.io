---
layout: post
title:  Tile, Tap, Push!
image_path: /images/bg.jpg
tagline: A tile-tapping time for two players and blatant ripoff of "Don’t Touch The White Tile"
card_color: "#4A90E2"
awards:
  - "\"Audience Choice\" at Make<br>School Demo Day 2015"
  - "\"Student Choice Runner-up\" at Make School Demo Day 2015"
ending:
  tagline: Tile, Tap, Push! was released in July 2015.
  link: http://zacharyespiritu.com/TileTapPush
  link_text: visit site
---

[Tile, Tap, Push!][tile-tap-push-website] is a two-player, fast-paced game that's all about reaction time and quick thinking. Tap an endless stream of white tiles faster than your opponent to win!

<figure class="two-landscape-screenshot-grid lazyload" data-expand="-20">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/main-menu.png">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/options-menu.png">
    <figcaption>The main menu and options screen, from which players can change the colors on each side.</figcaption>
</figure>

### Overview

Tile, Tap, Push! was developed while I was studying at the [Make School Summer Academy][make-school-sa] in 2015. Even though I didn't really know iOS development at the time, I got bored during the tutorial section of the program and decided just to jump right into creating an app for the first time.

The gameplay is simple: two players sit on opposite sides of the screen and race to tap the white tiles on the screen in front of them as fast as possible. Every time a player taps a tile correctly, the dividing line in the center moves towards their opponent, which fills more of the screen with the player's color. However, if a player makes an incorrect tap, the line moves back towards them. The first player to completely fill the screen with their color wins the game.

There's also a single player mode where one player attempts to survive as long as possible against a line that moves down the screen with increasing speed.

<figure class="two-screenshot-grid lazyload" data-expand="-20">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/single-player.png">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/single-player-end.png">
    <figcaption>Single player mode.</figcaption>
</figure>

### Implementation and Design

I programmed the majority of the app in Swift using the open-source game engine [cocos2d-objc][cocos2d-github]. I also added [Mixpanel][mixpanel] for analytics and Game Center integration for single player mode leaderboards.

I liked the idea of a "rolling" grid for the tiles, so I had the height of each tile row scale up as it approaches the player. This also helped to make it clearer to new players *which* white tile they had to press—before, players would tap any of the white tiles on their side of the screen.

<figure class="two-landscape-screenshot-grid grid-padding lazyload" data-expand="-20">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/old-gameplay.png">
    <img class="lazyload" data-src="/images/projects/tile-tap-push/new-gameplay.png">
    <figcaption>The MVP design of the gameplay (blue/red) vs the final, current design (gray/orange).</figcaption>
</figure>

### Result

At the Demo Day at the end of the program, Tile, Tap, Push (along with [Reaction Line][reaction-line-post], another project I worked on while at Make School) won the "Audience Choice" award as voted by the vistors in attendance. As a result, I was able to present both of my projects in front of everyone (approximately 100 people). I also received the "Student Choice Runner-Up" award as selected by my fellow students in the program.

You can view the entire presentation in the video below:

{% include youtube_player.html width=640 id="beEeJ__wOR8" %}

Tile, Tap, Push! is available to download on the App Store [here][tile-tap-push-app-store].

[tile-tap-push-website]: http://zacharyespiritu.com/TileTapPush
[make-school-sa]: https://www.makeschool.com/summer-academy
[cocos2d-github]: https://github.com/cocos2d/cocos2d-objc
[mixpanel]: http://mixpanel.com/
[reaction-line-post]: /project/reaction-line
[tile-tap-push-app-store]: https://itunes.apple.com/app/id1016306913
