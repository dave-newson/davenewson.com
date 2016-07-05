---
layout: project
title:      "MaximumFish"
subtitle:   "A JavaScript benchmark with personality"

header_img:
  url: "assets/media/projects/maximumfish/header.jpg"
  darken: 0.5
---

Built over a weekend in 2008, Maximum Fish is a "simple" JavaScript-based fish tank, masquerading as a benchmark tool.

<div class="text-center">
    <a href="/maximumfish/" class="btn btn-primary" target="_blank">Open Maximum Fish</a>
</div>

# What

Each fish is re-positioned in the DOM using absolute positioning, every frame.
Each frame is timed, and several frames make up one "tick".
If the duration of a tick is within a predefined limit, another fish is added to the pool.

This continues until ticks start to take too long, and fish stop being added.
If a predefined number of "ticks" pass without any new fish being added to the pool, you're presented with your number of Maximum Fish.

Each different fish also has its own personality, too. Some move faster than others. Some have a higher chance of turning around. Some are cuter. Some are more-eye-than-fish.

# Interesting things

Back in 2008 this script struggled on most browsers, stopping at about 20-30 fish.
Modern browsers have become far more efficient, and the best ones offload the render thread, presenting DOM changes from blocking the JavaScript thread.

This separation of the threads can lead to the jerky/laggy movement of the fish, but it also means much more fish (thousands) can be handled by
the browser before the JavaScript thread finally starts exceeding the time limits.

At some point in 2010 I tried rewriting MaximumFish to use jQuery instead of raw JavaScript,
but at the time this raised the overhead so much that less than 10 fish could be displayed.

# Fun things

If you're bored ...

## Top dog

Once you hit your Maximum Fish, let them continue swimming, and try to work out which fish is at the top.

## Cheats

The script doesn't handle resizing, so using a smaller window results in much faster rendering, allowing for even more fish.

Minimising the window or changing tab used to stop the Browser's renderer all together, letting the relatively
light-weight non-DOM JavaScript execute unabated, resulting in a truly ludicrous number of fish.

Some browsers however prevent this, as they pause the JavaScript thread when the tab is not visible.




