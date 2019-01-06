---
layout: post
title:  Snowy Sunrise
image_path: /images/portfolio-snowy-sunrise.png
banner_path:
tagline: A GLSL-based graphics team project demonstrating L-systems, screen-space volumetric lighting, and FXAA
card_color: "#95A5A6"
ending:
  tagline: Snowy Sunrise was developed in December 2018.
  link: https://www.youtube.com/watch?v=ceOfkHSTTaY
  link_text: watch demo
skills: c++ glsl
filters: academic
---

# Overview

For the final project of the <a href="https://cs.brown.edu/courses/csci1230/">CSCI1230: Introduction to Computer Graphics</a> course at Brown University, I worked with <a href="https://github.com/wizardofcos">Michael Cosgrove</a> to develop "Snowy Sunrise", a real-time GPU raymarched scene featuring L-systems, screen-space volumetric lighting, and fast-approximate anti-aliasing.

I was responsible for implementing both the volumetric lighting effect and fast-approximate anti-aliasing.

{% include youtube_player.html width=640 id="ceOfkHSTTaY" %}

# Render Pipeline

Our program uses three main shaders:

1. A raymarching shader, which renders the scene (both the landscape and the trees) to two render targets: a texture containing the normal, raymarched scene and an "occlusion texture", where all objects in the raymarched scene are rendered black with the light source as a white circle. (Originally, we had two separate raymarches for the occlusion texture and the normal scene---however, we were able to significantly optimize the performance of our program by combining them into a single shader with multiple render targets.)

    <figure class="lazyload">
        <img class="responsive-image lazyload" data-src="/images/projects/snowy-sunrise/occlusion-texture.png">
        <figcaption>
            A sample of the occlusion texture.
        </figcaption>
    </figure>
    <div class="vertical-spacer spacer-medium"></div>
    <figure class="lazyload">
        <img class="responsive-image lazyload" data-src="/images/projects/snowy-sunrise/scene-texture.png">
        <figcaption>
            A sample of the scene texture without the volumetric lighting effect.
        </figcaption>
    </figure>

2. A volumetric lighting shader, which takes samples from the occlusion texture in a radial fashion to simulate light rays shining across the screen. This shader then additively blends the light ray samples with the original texture to achieve the desired lighting effect.

    <figure class="lazyload">
        <img class="responsive-image lazyload" data-src="/images/projects/snowy-sunrise/volumetric-lighting-texture.png">
        <figcaption>
            The volumetric lighting texture, as sampled from the occlusion texture.
        </figcaption>
    </figure>
    <div class="vertical-spacer spacer-medium"></div>
    <figure class="lazyload">
        <img class="responsive-image lazyload" data-src="/images/projects/snowy-sunrise/blended-without-fxaa.png">
        <figcaption>
            The scene texture additively blended with the volumetric lighting texture.
        </figcaption>
    </figure>

3. A FXAA shader, which performs edge detection on the texture returned by the volumetric lighting shader and applies an anti-aliasing effect to those edges.

    <figure class="lazyload">
        <img class="responsive-image lazyload" data-src="/images/projects/snowy-sunrise/fxaa-edge-detection.png">
        <figcaption>
            The edges where the FXAA effect is applied are highlighted in red.
        </figcaption>
    </figure>
