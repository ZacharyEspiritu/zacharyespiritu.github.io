---
layout: post
title:  "Creating a Ranking System for Math Battle II"
short_title: "Math Battle II's Ranking System"
image_path: /images/portfolio-math.png
tagline: I'm about three months into the process of rewriting Math Battle from scratch, when somewhere along the way, I thought to myself, "What if Math Battle had a multiplayer ELO rating system?"
card_color: "#E461FF"
---

I'm about three months into the process of rewriting Math Battle from scratch, when somewhere along the way, I thought to myself:

> Huh, what if Math Battle was became an online multiplayer game where players compete for rankings?

And so the quest began to create a ranking system.

<figure class="lazyload" data-expand="-20">
    <img class="responsive-screenshot lazyload" data-src="/images/projects/math-battle/leaderboard.png">
</figure>

## Goals for creating a ranking system

[GiantBomb](http://www.giantbomb.com/ranking-system/3015-2163/) defines a ranking system as a mechanism that "tallies the player's current progress and relative skill, by tracking raw numbers of multiple statistics (like score and time) during a session of gameplay. This results in a competitive meta-game where the goal is usually to reach the top position."

In establishing a ranking system for Math Battle, I set out with three goals in mind:

1. The ranking system **encourages players to play** (in other words, discourages players from not playing in order to save their current ranking) while still making every game "high-stakes" in the sense that you'll still be able to gain or lose a meaningful amount of points regardless of matchup.
2. **Differences in skill level** in a matchup should be accounted for and increase or decrease the reward or penalty given for winning or losing.
3. **Lopsided victories** (example: beating another player 5–0) should be assumed to have been the result of the winner being significantly better than the other player (even though the pairing algorithm matched the two knowing they had even ranks) and should be accounted for and should increase the reward or penalty given for winning or losing.

### Example ranking systems

There were four ranking systems that I looked at when designing the rating system for Math Battle:

* [ELO system](https://en.wikipedia.org/wiki/ELO_rating_system)
* [TrueSkill](http://research.microsoft.com/en-us/projects/trueskill/details.aspx)
* [Magic: The Gathering - Planeswalker Points](https://www.wizards.com/magic/planeswalkerpoints)
* [Clash of Clans - Trophy System](http://forum.supercell.net/showthread.php/342724-TROPHY-OFFERS-Formulas-discovered%21%21)

I took elements from each of these systems to create the current ranking algorithm in Math Battle.

## BattlePoints, or BP: Math Battle II's form of currency

Hearkening back to the old days of Pokémon, I decided that Math Battle II's ranking system would be called **Battle Points, or BP**. It's a modified version of the ELO system, where players are given points for a win or a loss proportional to their opponent's current rank and their own rank, as well as taking into account the number of previous games each player has played and the score in each game.

### The basic equations

The ELO ranking system was formulated for use in two-player matchups, making it a perfect starting point for Math Battle II. There are multiple variations of the ELO formula, but the one that I am using is

$$R = R_0 + K(1 - E)$$

where $$R$$ is the new rating, $$R_0$$ is the old rating, $$K$$ is an arbitrary multiplier that determines the volatility of ranking changes (more on this below), and $$E$$ is the probability of a given player winning based on the difference in ranking between the player and its opponent.

The probability of a player winning is given by the following equation:

$$1 \over 1 + 10^{R_{\mathrm{opponent}} - R_{\mathrm{player}}}$$

It might not be clear what this second equation does, but what it usually will do is return a number between 0 (inclusive) and 1 (exclusive) representing the probability of $$player$$ winning the match against $$opponent$$ based on their ranking.

I decided that each player will start with a base of **1000** ranking points and will go up or down from there.

### The K-factor

The **K-factor** in the equation is an arbitrary variable that determines the volatility of ranking changes. If the K-factor used to calculate a ranking shift is higher, rankings will change more drastically per match than if the K-factor was lower.

To take advantage of this, I've implemented a provisional rating system similar to the one used by the [United States Chess Federation](https://new.uschess.org/home/), such that the $$K$$ constant decreases as a player's ranking increases.

For example, a player whose ranking is 1254 will be more volatile than a player whose ranking is 1765, even if the difference in rankings between them and their opponent is the same amount. (This is not to say that 1254 players will be matched up with 1765 players—it's just an example of the changing volatility of rankings in any given match.)

I've set the K-factor to change with the following bracket system:

| Rating Level | K-factor |
|:------------:|:--------:|
|  700 - 1200  |    32    |
|  1201 - 1500 |    28    |
|  1501 - 2000 |    24    |
|     2001+    |    16    |

The philosophy behind these numbers is that a player's change in skill is more volatile in their early stages and therefore this volatility should be reflected in their ranking's ability to change.

In addition, the gradation of the K-factor reduces rating change at the top end of the rating spectrum, thereby reducing the possibility for rapid ratings inflation or deflation for those with a low K-factor. This is under the assumption that there will be a significantly lower number of players on the high end of the ratings spectrum, and therefore there will be less opponents of similar rating level to be matched against, causing the algorithm to defer to a lower ranked player.

If this behavior is exhibited multiple times, inaccurate rating inflation could occur. In addition, if a high ranked player is unlucky in a match against a lower ranked player, sudden rating deflation could occur as well.

*(To be quite clear, the K-factor is individual for each player. A player with ranking 1197 has a K-factor of 32 even if they are playing against a player with ranking 1215, who has a K-factor of 28.)*

## Taking into account the score of each game

I also wanted to take into account the score of each game played. I'm assuming here that a lopsided matchup (example: in a 5-point match, the match ends 5–0) may be a possibility that a matchup was lopsided in the favor of one of the players significantly, *even though both players had similar ranks*. (A similar, but completely aesthetic, system is found in the game Divekick.)

To do this, we multiply the given rating loss/increase from the K-factor equation by an arbitrary value based on the K-factor tables:

| Rating Level | Lopsided victory modifier |
|:------------:|:-------------------------:|
|  700 - 1200  |            1.2            |
|  1201 - 1500 |            1.5            |
|  1501 - 2000 |            1.8            |
|     2001+    |            2.1            |

You'll notice that, as opposed to the K-factor equation, where the rating volatility decreases as players increase in rank, this table increases the penalty for lopsided victores as rakings increase. This encourages players to avoid going AFK during rounds or giving up while further encourages them to attempt to solve puzzles as fast as possible.

## Conclusion

Math Battle's algorithm aims to encourage players to play and improve their problem-solving abilities. There's obviously some room for fixes here and there, and some of the reasoning is simply arbitrary, but it has worked well so far in test environments. The goal is to roll this out by the end of the year—we'll see how it goes from here!
