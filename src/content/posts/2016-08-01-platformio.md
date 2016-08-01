---
layout:     post
title:      "Arudino Development using PlatformIO IDE"
subtitle:   "Because getting started should not be a struggle"
date:       "2016-08-01 18:04:00"
author:     "Dave Newson"
thumb_img:  "/assets/media/posts/2016-08-01-platformio/thumb.png"
header_img:
  url: "assets/media/posts/2016-08-01-platformio/platformio-code-blink.png"
  darken: 0.5
---

I have two fundamental issues with the "Getting Started" part of AVR (Arduino, Teensy) development;

 - Setting up the toolchain, and making it work with your IDE.
 - Setting up an IDE that won't make your eyes bleed, and making it work with the toolchain.

Ok, so really that's _one massive thing_, but while the toolchain is a requirement-of-entry, your 
choice of IDE _should_ be entirely personal choice.

Getting both to play nicely together is, sometimes, like trying to teach gentry to Beavis and Butthead.
 
# Problem example: Teensy 3.2

If you haven't noticed, I have a lot of love for the Teensy 3.2.  

The [PJRC Website](https://www.pjrc.com/), has a [Getting Started Guide](https://www.pjrc.com/teensy/loader.html) 
in which they tell you how to get the Teensy development toolchain up and running:

 - Install the Arduino software (including IDE)
 - Install any additional drivers you need for your OS.
 - Install the Teensyduino software
 
From here, you can use the Arduino IDE to write code, and the Teensy uploader is automagically hooked in, 
which sends the code to your plugged-in Teensy.

## Whats wrong with the setup process?

Technically, nothing.

Practically, lots of things. I really cannot convey how much I truly dislike the Arduino IDE.  
I should mention that I come from web-dev land where my IDE of choice helps me jump around, 
debug, modularised and manage my code with ease. The Arduino IDE helps me with none of this, 
and comes in a close second to Notepad as my least-favourite way to write code.

## What about using a different IDE?

That's fine, you can _try_ and use something like Eclipse or VisualStudio or CLion instead (_oh, how I wanted to like you, CLion_), 
but you've got to fight with the configurations and spend time making the toolchain work nicely.  
Some might say _"setting up VS isn't that hard"_, but again, VS is not _my_ IDE of choice.

I'm also very strongly of the opinion that toolchain setup should be **near instant** and **as hands-off as possible** on the first go.
In web-land you might liken to this using Vagrant to bring up a developer environment for a new starter. It's better to begin with 
things working and not knowing how, and then giving you the option to customise and explore later.  People lose days to setting things up
all by themselves.

Yes, Arduino IDE and Teensy _do_ give you this in some manner, but you end up with a crippled IDE. 
I want to use an IDE that I actually like, and that actually helps me to write code.

Further to that, **I just want to write code**._

# PlatformIO

[PlatformIO](http://platformio.org) is advertised as an _"Environment for Internet of Things development"_, which isn't
very informative.  

What you actually get:

 - Cross-platform development environment (Window, Mac, Linux)
 - Automatic installation of toolchains for a huge variety of hardware
 - Build-in serial monitor, terminal, debugger
 - Integrated, professional IDE 
 - And most importantly: **super easy setup**

There are 3 options for installing PlatformIO;

 - [PlatformIO CLI](http://platformio.org/get-started/cli): Use PlatformIO from the command-line, and keep it clean and separate.
 - [PlatformIO Integration](http://platformio.org/get-started/integration): Integration with a number of your favourite IDEs.
 - [PlatformIO IDE](http://platformio.org/platformio-ide): Use PlatformIO as part of its own IDE (using Atom, a powerful open-source IDE).

PlatformIO IDE gives you the greatest amount of power in the least amount of work, so let's take a quick look at that.
 
# Installing PlatformIO IDE

**Consider reading the [PlatformIO Installation Guide](http://docs.platformio.org/en/latest/ide/atom.html#installation), 
which is no doubt better than this one.**

## Dependencies (Python 2.7)

PlatformIO requires Python 2.7.  Some people see this as a hinderence, but come on. It's Python. Live a little.

<div class="text-center"><a href="https://www.python.org/downloads/release/python-2711/" target="_blank" class="btn btn-primary">Download Python 2.7.11</a></div>

When installing on Windows, don't forget to enable the "Path" option.

![Enabling Path registration during Python Install](/assets/media/posts/2016-08-01-platformio/python-path.png)

If you happen to forget to install Python first, PlatformIO will badger you to install it. 
You may need to reboot before PlatformIO can find it, if you do it that way around.

## PlatformIO

<div class="text-center"><a href="http://platformio.org/platformio-ide" target="_blank" class="btn btn-primary">Download the PlatformIO IDE</a></div>

Install it, and you're done.  

Under windows you'll find the IDE under **"Atom"** on your start menu.

# Using PlatformIO

**Consider reading the official [PlatformIO Getting Started Guide](http://docs.platformio.org/en/latest/ide/atom.html#quick-start), which
will no doubt be better than this one.**

Let's take a look at everyones favourite bad example; a blink script.

## Create a Project

From the PlatformIO homepage, click the **Project Examples** button.

![PlatformIO IDE Homepage](/assets/media/posts/2016-08-01-platformio/platformio-home-installed.png)

Select an example project from the list. We'll be using **amtelavr-and-arduino\ardunio-blink**.

![PlatformIO IDE Example Project Selection](/assets/media/posts/2016-08-01-platformio/platformio-project-add.png)

![PlatformIO IDE Example Project Selection](/assets/media/posts/2016-08-01-platformio/platformio-project-select-options.png)

When initialising the project PlatformIO will take a little while to download the required toolchain.
Once this finishes, your IDE should look like this:

![](/assets/media/posts/2016-08-01-platformio/platformio-code-installed.png)

Clicking on the **src/main.cpp** you should see your code:

![](/assets/media/posts/2016-08-01-platformio/platformio-code-blink.png)

## Hardware toolchain

For my Teensy I need to install the toolchain for the Teensy hardware. Let's do this now.

Click the "Initialise new PlatformIO project or modify existing ... " button, or find the same option in the PlatformIO menu.

![](/assets/media/posts/2016-08-01-platformio/platformio-project-button.png)

![](/assets/media/posts/2016-08-01-platformio/platformio-project-menu.png)

Next, find the Teensy 3.2 in the "Select board" drop-down, to add support to your project.

![](/assets/media/posts/2016-08-01-platformio/platformio-build-target-select-options.png)

![](/assets/media/posts/2016-08-01-platformio/platformio-build-target-select.png)

Finally, you'll need to change your build target, in order for the code to build onto the teensy.

Find the "Build Target" button in the very bottom-left of the IDE.

![](/assets/media/posts/2016-08-01-platformio/platformio-build-target-button.png)

![](/assets/media/posts/2016-08-01-platformio/platformio-build-target.png)

All done. 

## Run your code

Hit the "Upload" button, and your code should be compiled and sent to your hardware. Awesome.

# Why PlatformIO

Hopefully this article has given you a really quick insight into how easy it is to get off the ground when you use
PlatformIO; the environment feels easy, professional, and I didn't have to mess around with anything complicated.

I love that PlatformIO and Atom are all open-source tools, too. Unlike some closed-source counterparts, if you
encounter a problem and _it annoys you enough_ you can try to submit a fix, or at least engauge the authors
and see if they're willing to solve the problem for you.

This is what Arduino and AVR development _should_ be.  Now I can concentrate on the software, and not on all the
bridges I need to build.

