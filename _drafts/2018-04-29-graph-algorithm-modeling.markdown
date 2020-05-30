---
layout: post
title:  Graph Algorithms in Alloy
image_path: /images/portfolio-snowy-sunrise.png
banner_path:
tagline: Modeling and formal verification of 3 MST and 2 shortest-path algorithms in Alloy
card_color: "#95A5A6"
ending:
  tagline: This project was developed in April 2018.
  link: https://www.youtube.com/watch?v=ceOfkHSTTaY
  link_text: watch demo
skills: alloy
filters: academic
---

# Overview

<aside class="post-aside">
  This project was developed with <a href="https://github.com/spwg">Spencer Greene</a> as part of the final project for the <a href="https://cs.brown.edu/courses/csci1230/">CSCI1950Y: Logic for Systems</a> course at Brown University.
</aside>

{% highlight ruby %}
Executing "Run run$1 for 7 but 6 Node, 6 State"
   Solver=sat4j Bitwidth=4 MaxSeq=7 SkolemDepth=1 Symmetry=20
   94525 vars. 1566 primary vars. 304546 clauses. 541ms.
   . found. Predicate is consistent. 599ms.

Executing "Check generatesShortestPathsAlways for 4 but 3 Node, 3 State"
   Solver=sat4j Bitwidth=4 MaxSeq=4 SkolemDepth=1 Symmetry=20
   21995 vars. 436 primary vars. 67045 clauses. 119ms.
   . found. Assertion is invalid. 282ms.

Executing "Check failureMeansNegativeWeightsPresent for 4 but 3 Node, 3 State"
   Solver=sat4j Bitwidth=4 MaxSeq=4 SkolemDepth=1 Symmetry=20
   22046 vars. 436 primary vars. 67133 clauses. 67ms.
   No counterexample found. Assertion may be valid. 121ms.

Executing "Check negWeightCycleMeansFailure for 4 but 3 Node, 3 State"
   Solver=sat4j Bitwidth=4 MaxSeq=4 SkolemDepth=1 Symmetry=20
   24090 vars. 436 primary vars. 74915 clauses. 78ms.
   . found. Assertion is invalid. 260ms.

Executing "Check generatesShortestPathsWhenPositive for 4 but 3 Node, 3 State"
   Solver=sat4j Bitwidth=4 MaxSeq=4 SkolemDepth=1 Symmetry=20
   22026 vars. 436 primary vars. 67077 clauses. 78ms.
   No counterexample found. Assertion may be valid. 115ms.

Executing "Check generatesConnectedPathsWhenPositive for 4 but 3 Node, 3 State"
   Solver=sat4j Bitwidth=4 MaxSeq=4 SkolemDepth=1 Symmetry=20
   21044 vars. 435 primary vars. 64151 clauses. 95ms.
   No counterexample found. Assertion may be valid. 121ms.

6 commands were executed. The results are:
   #1: Instance found. run$1 is consistent.
   #2: Counterexample found. .generatesShortestPathsAlways is invalid.
   #3: No counterexample found. failureMeansNegativeWeightsPresent may be valid.
   #4: Counterexample found. .negWeightCycleMeansFailure is invalid.
   #5: No counterexample found. generatesShortestPathsWhenPositive may be valid.
   #6: No counterexample found. generatesConnectedPathsWhenPositive may be valid.
{% endhighlight %}
