---
layout: post
title:  Math Battle II
image_path: /images/projects/math-battle/banner.png
tagline: An experiment in online real-time multiplayer, brand design, and how much people secretly like math
card_color: "#E461FF"
awards:
  - "10Under20 Recipient"
  - "Winner of 2015 Congressional App Challenge"
  - "\"Best UI Design\" at Local Hack Day 2015"
ending:
  tagline: Math Battle was released in July 2016.
  link: http://mathbattle.pw
  link_text: visit site
skills: swift objective-c python sass photoshop git sketch firebase
---

Nowadays, getting children (and adults!) to play “educational games” can be hard to nearly impossible. That’s where Math Battle comes in. Originally created at Local Hack Day 2015 @ General Assembly and winner of the 2015 Congressional App Challenge, Math Battle is an iOS game where two players play on the same screen and go head-to-head in a battle of intellect attempting to solve procedurally generating, math-based puzzles faster than the other player.

{% include youtube_player.html width=640 id="OmnT4P_ALu4" %}

### Overview

Users can either play Math Battle locally on the same phone using a split-screen form of the game or compete in “ranked battles” via an online multiplayer mode. Battles consist of players competing to solve five procedurally generated puzzles faster than the other player. To do so, they are given a random set of nine “number tiles” and a target number.

Players must use *all* nine number tiles in order to come up with a math equation that, when evaluated, results in the target number. A player wins the battle when they have solved five puzzles faster than the other player or, after two minutes, the player with the highest number of solved puzzles wins.

### Implementation

I programmed the majority of the app in Swift using the open-source game engine [cocos2d-objc][cocos2d-github], and designed and created all of the artwork myself using a combination of Adobe Illustrator and Sketch.

All puzzles are generated on the fly, each with a guaranteed solution. This allows for massive replayability, so you can challenge your enemies (and your math teachers, of course) to a Math Battle as many times as you want and still get new puzzles every time.

<div class="four-screenshot-grid lazyload" data-expand="-20">
    <img class="lazyload" data-src="/images/projects/math-battle/custom-match.png">
    <img class="lazyload" data-src="/images/projects/math-battle/practice-match.png">
    <img class="lazyload" data-src="/images/projects/math-battle/player-stats.png">
    <img class="lazyload" data-src="/images/projects/math-battle/leaderboard.png">
</div>

I also used [Firebase][firebase]'s Realtime Database, Authentication, Cloud Messaging (push notifications), and Analytics modules for the backend. I engineered a way to take advantage of Firebase's notably fast data update and retreival benchmarks to allow for real-time online multiplayer battles. This allows players to compete on separate devices while still seeing all of the taps and moves of their opponent on the other side of their playfield.

Finally, I implemented an [ELO rating system][elo-ratings] which further incentives players and students to continually play and improve their quick thinking skills in order to climb up the leaderboards.

### Design

A large amount of Math Battle's time in production was spent developing an unified brand design. As a starting point, I was primarily inspired by the look of the typeface, [ADAM.CG PRO][adam-cg-pro]. This led to the thick, black borders and the drop shadows seen around most of the elements. I also used bright colors to give the game a more friendly mood.

<figure class="six-screenshot-grid lazyload" data-expand="-20">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-design-1.png">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-design-2.png">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-design-3.png">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-design-4.png">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-design-5.png">
    <img class="lazyload" data-src="/images/projects/math-battle/gameplay-scene.png">
    <figcaption>Several iterations were necessary before the final gameplay design was reached.</figcaption>
</figure>

As an aside, one of the things I always like to do in my games is make sure that there is motion on the screen at all times—this prevents players from ever thinking that the game froze and also, in my opinion, simply makes for a better game feel overall. As such, almost all of the backgrounds in Math Battle are moving on a loop.

I'm most proud of the subtle, "intersecting" backgrounds as seen in the gameplay screens, which I achieved through some custom OpenGL tinkering to selectively prevent textures from rendering on top of one another. You can see this in the GIF below:

<figure class="lazyload" data-expand="-20">
    <img class="responsive-screenshot lazyload" data-src="/images/projects/math-battle/animations.gif">
</figure>

### Animations

To give the game more polish, the last month or so of development was spent working on the animations seen throughout the game. In particular, the menu transition animations took a lot of time to get just right—however, it was worth it in the end for technical reasons as it allowed me to seamlessly load and deallocate memory for each gamemode menu instead of loading all the menus at once, which was calling memory warnings.

### Trading Cards

For marketing purposes, I designed and printed Math Battle "trading cards." They feature download information on the backside, and a randomized tile and background color combination on the front.

I usually always have some on hand, so if you ever meet me in person, feel free to ask me for one.

<figure class="lazyload" data-expand="-20">
    <img class="responsive-image lazyload" data-src="/images/projects/math-battle/trading-cards.jpg">
</figure>

### Press/Award History

Math Battle was originally created at [Local Hack Day][local-hack-day] 2015 @ General Assembly in October 2015, where it won "Best UI Design" out of several dozen teams.

After a complete redesign of the app, in February 2016, I won the 2015 [Congressional App Challenge][congressional-app-challenge]. As a result, I was invited to Washington, D.C. to a reception with the other regional winners, political representatives, and engineers from tech companies such as Spotify and IBM.

Most recently, I was named on CEWeek's [10Under20: Young Innovators To Watch][ceweek-awards] list for my work on Math Battle. Since then, I've been featured in several publications around the internet—you can view several of these articles on the [Math Battle website][math-battle-website].

<figure class="lazyload" data-expand="-20">
    <img class="responsive-image lazyload" data-src="/images/projects/math-battle/ceweek-presentation.jpg">
    <figcaption>
        Receiving the 10Under20 award at CEWeek 2016.
    </figcaption>
</figure>

[cocos2d-github]: https://github.com/cocos2d/cocos2d-objc
[firebase]: https://firebase.google.com/
[elo-ratings]: https://en.wikipedia.org/wiki/Elo_rating_system
[adam-cg-pro]: https://www.behance.net/gallery/13756975/ADAMCG-PRO-Free-Typeface
[local-hack-day]: https://localhackday.mlh.io/
[congressional-app-challenge]: http://www.congressionalappchallenge.us/
[ceweek-awards]: http://ceweekny.com/about/10under20-2016/
[math-battle-website]: http://mathbattle.pw
