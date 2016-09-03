---
layout: post
title:  Math Battle II
image_path: /images/portfolio-math.png
tagline: An experiment in online real-time multiplayer, brand design, and how much people secretly like math
card_color: "#E461FF"
awards:
  - "10Under20 Recipient"
  - "Winner of 2015 Congressional App Challenge"
  - "\"Best UI Design\" at Local Hack Day 2015"
ending:
  tagline: Math Battle was released in August 2016.
  link: http://zacharyespiritu.com/MathBattle
  link_text: visit site
---

Nowadays, getting children (and adults!) to play “educational games” can be hard to nearly impossible. That’s where Math Battle comes in. Originally created at Local Hack Day 2015 @ General Assembly and winner of the 2015 Congressional App Challenge, Math Battle is an iOS game where two players play on the same screen and go head-to-head in a battle of intellect attempting to solve procedurally generating, math-based puzzles faster than the other player.

### Overview

Users can either play Math Battle locally on the same phone using a split-screen form of the game or compete in “ranked battles” via an online multiplayer mode. Battles consist of players competing to solve five procedurally generated puzzles faster than the other player. To do so, they are given a random set of nine “number tiles” and a target number.

Players must use *all* nine number tiles in order to come up with a math equation that, when evaluated, results in the target number. A player wins the battle when they have solved five puzzles faster than the other player or, after two minutes, the player with the highest number of solved puzzles wins.

The game’s shining component is its procedural puzzle generation system. Every time you play, a new puzzle is generated with a guaranteed solution. This allows for massive replayability, so you can challenge your enemies (and your math teachers, of course) to a Math Battle as many times as you want and still get new puzzles every time.

### Implementation

I programmed the majority of the app in Swift using the open-source game engine [cocos2d-objc][cocos2d-github], and designed and created all of the artwork myself using a combination of Adobe Illustrator and Sketch. I also implemented [Firebase][firebase]'s Realtime Database, Authentication, Cloud Messaging (push notifications), and Analytics modules for the backend.

Since this game was created with accessibility in mind, it was important for me to make sure that players could easily compete and improve their math skills against other users no matter where they were. As such, I engineered a way to take advantage of Firebase's notably fast data update and retreival benchmarks to allow for real-time online multiplayer battles. This allows players to compete on separate devices while still seeing all of the taps and moves of their opponent on the other side of their playfield.

I also implemented an [ELO rating system][elo-ratings] which further incentives players and students to continually play and improve their quick thinking skills in order to climb up the leaderboards.

### Design

A large amount of Math Battle's time in production was spent developing an unified brand design. As a starting point, I was primarily inspired by the look of the typeface, [ADAM.CG PRO][adam-cg-pro]. This led to the thick, black borders and the drop shadows seen around most of the elements. I also used bright colors to give the game a more friendly mood.

To give the game more polish, the last month or so of development was spent working on the animations seen throughout the game. In particular, the menu transition animations took a lot of time to get just right—however, it was worth it in the end for technical reasons as it allowed me to seamlessly load and deallocate memory for each gamemode menu instead of loading all the menus at once, which was calling memory warnings.

You can see these animations in the video below.

{% include youtube_player.html width=640 id="OmnT4P_ALu4" %}

### Marketing & Branding

For marketing purposes, I designed and printed Math Battle trading cards. They feature download information on the backside, and a randomized tile and background color combination on the front.

[cocos2d-github]: https://github.com/cocos2d/cocos2d-objc
[firebase]: https://firebase.google.com/
[elo-ratings]: https://en.wikipedia.org/wiki/Elo_rating_system
[adam-cg-pro]: https://www.behance.net/gallery/13756975/ADAMCG-PRO-Free-Typeface
