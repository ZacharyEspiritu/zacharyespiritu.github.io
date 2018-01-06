---
layout: post
title:  Negotiatus
image_path: /images/projects/negotiatus/team-photo.jpg
banner_path: /images/callout.jpg
tagline: Sole developer of several large projects as a Software Engineering Intern for the summer of 2016
card_color: "#33CB43"
ending:
  tagline: I worked for Negotiatus from June to August 2016.
  link: http://negotiatus.com
  link_text: visit site
skills: postgresql javascript ruby rails jquery git sass
---

In the summer of 2016, I worked with [Negotiatus][negotiatus] as a Software Engineering Intern. Using a combination of personal negotiatiors and fancy technology, Negotiatus gets business owners the office supplies that they normally get for about 20% less.

For 11 weeks, I worked on their Ruby on Rails-based web application with the CTO and the Lead Engineer as my mentors. While my knowledge of Rails (and Ruby, for that matter) was minimal before I started, by the end of my internship, I had developed several user-facing projects, performed emergency bug fixes, and engineered automated solutions on the backend to several processes that previously had to be completed manually.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/negotiatus/team-photo.jpg">
    <figcaption>The Negotiatus team.</figcaption>
</figure>

### The tl;dr Version

This is a quick breakdown of some of the things I did:

- Engineered several web scrapers with natural language processing capabilities to automate proprietary processes covered by NDA, saving hundreds of hours of human labor.
- Co-developed automated test suite from scratch for over 7000 lines of code with over 70% coverage.
- Developed cron-like system where clients can schedule recurring orders, leading to increased expected monthly revenue.
- Created a modular, user-facing notification system allowing notifications associated with any database object to be sent to any user with a single line of code.
- Built several HTML email templates and integrated them with previous plain text system.

### HTML Emails

My first main project was to transform the company's automated, plain-text emails to a more professional-looking HTML-based system. I built several HTML email templates that work across all major email clients, such as Apple Mail, the infamous Gmail, the more infamous Gmail for iOS, and the even more infamous Outlook Web Client.

I shudder at the thought of having to use table-based layouts for anything other than email templates.

<figure class="lazyload">
    <img class="lazyload" data-src="/images/projects/negotiatus/email-template.png">
    <figcaption>An example of an HTML email template I created.</figcaption>
</figure>

### Notification System

I also was tasked with creating a user-facing "notification center" at which businesses could see updates on their order status and other important information. I developed both the backend and frontend for this feature.

Since I like to keep modules as isolated as possible in my code as to make integration as easy as possible, I engineered a modular system that allowed notifications associated with any database object to be sent to any user with a single line of code.

Part of the design specs for the notification center was the implementation of a three-tiered priority system, which you can see in the screenshots below.

### Scheduled Orders

I developed both the backend and frontend for the "Scheduled Orders" feature, which allows clients to schedule recurring orders on an interval or calendar-based pattern. Every time the current date matches the pattern on a schedule, it automatically creates a new order using the products the client has placed in the schedule.

The system also allows clients to update their schedule's pattern as well as change the products in their scheduled order at any point.

### Automated Testing

While I was at Negotiatus, one of the major problems the team and I encountered was that we had no test suite of any kind. To solve this problem, I worked in tandem with the Lead Engineer to develop an automated test suite from scratch.

I personally configured [rSpec][rspec] and [Travis CI][travis-ci] to give us the testing functionality that we wanted and wrote behavior-driven tests for approximately three weeks. By the time I had left the company, we had over 70% coverage for over 7000 lines of code.

### Web Scrapers

Throughout my internship, I engineered several web scrapers with natural language processing capabilities, which included fuzzy string matching and adjective/specifier extraction.

While I'm not able to go into the specifics of what these scrapers did due to NDA, they all automated proprietary processes that originally had to be done manually, which ultimately saved hundreds of hours of human labor in the long-term.

[negotiatus]: http://negotiatus.com
[rspec]: http://rspec.info/
[travis-ci]: https://travis-ci.com/
