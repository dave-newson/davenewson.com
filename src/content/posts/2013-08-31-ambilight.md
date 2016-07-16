---
layout: post
title:      "Ambilight with Teensy 2"
subtitle:   "Make your wall glow with the image from your TV."
date:       "2013-08-31 12:00:00"
author:     "Dave Newson"
thumb_img:  "assets/media/posts/2013-08-31-ambilight/diagram.png"
header_img:
  url: "assets/media/posts/2013-08-31-ambilight/frame.jpg"
  darken: 0.25
---

<iframe width="640" height="480" src="//www.youtube.com/embed/tbXNDtHj18c?rel=0" frameborder="0" allowfullscreen=""></iframe>

[Ambilight](http://en.wikipedia.org/wiki/Ambilight "http://en.wikipedia.org/wiki/Ambilight") is an ambient lighting system for TVs, developed by Philips. Ambilight takes the colours near the edge of your TV screen and projects them onto the wall surrounding the TV using LEDs.

This effect helps to reduce eye-strain when watching in complete darkness, makes your TV appear much bigger due to the colours “bleeding” out from the edge of the frame, and improves your immersion by filling your peripheral vision with the same colours that appear on-screen.

It also looks **_cool as hell_**.

Philips Ambilight is only available on select Philips TVs, however some clever souls hacked together an LED light strip, microcontroller and a few chunks of code, so now you too can have an Ambilight setup for your TV! …provided you're playing back your media from a PC.

Being stupidly excitable about things like this I decided to give the whole thing a try.

This idea, and the core of this tutorial, comes from an article by [Phillip Burgess](http://learn.adafruit.com/users/12 "http://learn.adafruit.com/users/12") called [Adalight](http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/overview "http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/overview"), made for the [Adafruit Learning System](http://learn.adafruit.com/ "http://learn.adafruit.com/"), which is just packed with awesome ideas.

While the original guide uses an [Arduino Uno](http://arduino.cc/en/Main/arduinoBoardUno "http://arduino.cc/en/Main/arduinoBoardUno") and the [Processing 2 environment](http://processing.org/ "http://processing.org/") to generate the effect, this guide will use the [Teensy 2](http://www.pjrc.com/store/teensy.html "http://www.pjrc.com/store/teensy.html") (because that's what I had laying around) and [XBMC (Xbox Media Center)](http://xbmc.org/ "http://xbmc.org/") with the [BobLight plugin](https://github.com/bobo1on1/script.xbmc.boblight/ "https://github.com/bobo1on1/script.xbmc.boblight/").

## The Concept

The method behind this madness is simple:

![Adalight with XBMC and Teensy2 - The core concept](/assets/media/posts/2013-08-31-ambilight/concept.png "Adalight with XBMC and Teensy2 - The core concept")

  - We play back our video with XBMC.
  - The BobLight plugin processes the video, averaging the edges of the screen into individual “pixel” blocks.
  - This data is passed by serial (USB) to the microcontroller, our Teensy 2.
  - The microcontroller uses an SPI interface to pass this data to an LED light strip.
  - The LEDs projects our individual “pixels”, averaged from the video, onto the wall.

## The Parts

You will need:

  - A TV
  - Connected to a PC
  - Running [XBMC](http://xbmc.org/ "http://xbmc.org/")
  - A Teensy 2 ([$16 from PJRC](http://www.pjrc.com/store/teensy.html "http://www.pjrc.com/store/teensy.html"))
  - USB cable for the Teensy
  - WS2801 50 piece LED light strip ([~$35 from a wholesaler](http://www.aliexpress.com/wholesale/wholesale-ws2801.html "http://www.aliexpress.com/wholesale/wholesale-ws2801.html") or [$40 from AdaFruit](http://www.adafruit.com/products/322 "http://www.adafruit.com/products/322"))
  - 5v 2.5amp power supply ([$10 from Adafruit](http://www.adafruit.com/products/276 "http://www.adafruit.com/products/276"), or you might have one laying around)
  - A solding iron, wires, all that jazz.
  - Some way to mount the LEDs to your TV. Likely also some improvisational skills.

## 1. Getting the code onto the Teensy

Before we can do anything else, we want to get the code for Adalight onto our Teensy 2\. I'm assuming you're on Windows - if you're on Linux you should be able to <abbr title="Read The Fine Manual">RTFM</abbr> for most of this. Even if you're already dropping code onto your Teensy 2, you might want to read this anyway.

I'm also assuming you've already mastered [plugging in the Teensy 2](http://www.pjrc.com/teensy/first_use.html "http://www.pjrc.com/teensy/first_use.html") to your PC.

### Setting up the IDE

This is all outlined in detail by [the Teensy Loader guide](http://www.pjrc.com/teensy/loader.html "http://www.pjrc.com/teensy/loader.html"), but here we go:

  - [Download and install the Arduino IDE software.](http://www.arduino.cc/en/Main/Software "http://www.arduino.cc/en/Main/Software")
  - [Download and install the TeensyDunio software.](http://www.pjrc.com/teensy/td_download.html "http://www.pjrc.com/teensy/td_download.html") It installs right over the top of the Arduino IDE software.

### Grab the Adalight code

  - Hop over to [Adalight on Github](https://github.com/adafruit/Adalight "https://github.com/adafruit/Adalight") and download the latest copy of the code using the “Download Zip” button.
  - Extract this Zip directly to your “My Documents” (eg. C:\Users\<user>\Documents\). There should already be an Arduino folder there. This is where the IDE looks for sketches.

### The Code

  - Fire up the Teensy IDE
  - Click `File` > `Sketchbook` > `LEDStream`
  - Connect the Teensy 2 to the PC via USB
  - Click `File` > `Upload`

This code _will_ compile onto a Teensy 2, however you will notice the LED on the Teensy does not light up. This is because the Arudio and Teensy 2 have the onboard LED on different pins.

Scroll down to around line 50 and you should see a reference to `LED pin for Teensy:`. Uncomment these lines, and comment the ones for the Arduino. You have something like this:

<pre class="c code c">
// LED pin for Adafruit 32u4 Breakout Board:
//#define LED_DDR  DDRE
//#define LED_PORT PORTE
//#define LED_PIN  _BV(PORTE6)
// LED pin for Teensy:
#define LED_DDR  DDRD
#define LED_PORT PORTD
#define LED_PIN  _BV(PORTD6)
// LED pin for Arduino:
//#define LED_DDR  DDRB
//#define LED_PORT PORTB
//#define LED_PIN  _BV(PORTB5)
</pre>

Note that **these are only references to the _onboard-LED_ pins and not the pins for the light strip**. Not only are the LED pins different on the Teensy 2, but so are the pins for SPI that talk to the light strip.

## 2. Improvements to the code

If you want to know the how this all works and why the pins are different, read on - otherwise [skip to section 3](#wiring-up-the-leds "tutorials:electronics:ambilight-with-teensy-2 ↵").

### Improving the test pattern

Before we go into too much detail, let's add a helpful feature to the code. During the startup process when you first supply power to the Teensy, the Teensy will try to send instructions to the LEDs to light up the red, then green, then blue channels. This is a simple test pattern to make sure everything's wired up correctly.

When we plug in the Teensy right now, the LED stays off and we've no idea what's going on. We're going to add a simple instruction to flash the onboard-LED when each test pattern flash should occur.

Replace the code around line 130 with the following:

<pre class="code">  
  // Issue test pattern to LEDs on startup.  This helps verify that
  // wiring between the Arduino and LEDs is correct.  Not knowing the
  // actual number of LEDs connected, this sets all of them (well, up
  // to the first 25,000, so as not to be TOO time consuming) to red,
  // green, blue, then off.  Once you're confident everything is working
  // end-to-end, it's OK to comment this out and reprogram the Arduino.
  uint8_t testcolor[] = { 0, 0, 0, 255, 0, 0 };
  for(char n=3; n>=0; n--) {
    for(c=0; c<25000; c++) {
      for(i=0; i<3; i++) {
        for(SPDR = testcolor[n + i]; !(SPSR & _BV(SPIF)); );
      }
    }
    LED_PORT |= LED_PIN;  // LED on
    delay(1); // One millisecond pause = latch
    LED_PORT &= ~LED_PIN;  // LED off
  }
</pre>

We've simply added the `LED on` and `LED off` instructions between the stages of our test pattern. Now when you connect the Teensy, the onboard-LED will flash at the point when the red, then green, then blue LEDs are supposed to be tested on the light strip.

This will help you debug your wiring, or let you know if you've somehow managed to blow up your Teensy.

## 3. Wiring up the LEDs

### LED Strip Wires

Because these LED strips can be assembled by _whomever_, the wiring colours don't follow a standard. The original Adalight how-to for the wiring is a little misleading in that regard, as it tells you the colour to connect but goes into no detail why.

Let's take a close look at one of our boards and figure out our LED strips wiring. Yours is probably a bit different to mine, but the core concepts are the same.

![WS2801 on an LED light strip](/assets/media/posts/2013-08-31-ambilight/ws2801.jpg "WS2801 on an LED light strip")

If you look closely at the image above, you'll notice:

  - Indicated by the red arrow, the 5v+ terminal marking is connected to the red wire.
  - Indicated by the blue arrow, the “Cl” marking for the Clock terminal is connected to the blue wire.
  - The white arrow points to an arrow marking on the board, which indicates the “direction of flow” for the SPI interface. Data sent to the board from the Teensy should travel in this direction.
  - You may also be able to make out the “U1” marking, which is the Upload terminal (SPI inbound), connected to the green wire.

From this, we can infer that:

  - Blue wire = Clock
  - Green wire = Upload
  - Red wire = 5v+
  - Yellow wire = Ground

If you can't see any markings on your own board you can also accept that this particular chip, the WS2801S0 TH121226, has the Clock on pin 1 and Upload on pin 2\. Pin 1 is indicated by a little circular indent in the same corner of the chip.

### Connecting the Teensy

Now we've identified all our wires we can connect the Teensy! To do this we want to connect:

  - The `clock` wire to `B1` on the Teensy (SCK / SPI Clock)
  - The `upload` wire to `B2` on the Teensy (MOSI / Data Out)
  - The `ground` wire to `GND` on the Teensy

### Connecting the Power

Before the LEDs will illuminate we need to connect the 5v power supply. The guide recommends a 5v, 2.5amp supply for 50 LEDs, but I used a 5v, 1amp power supply from an old phone charger I had knocking about, and the brightness seems perfectly OK on my light strip.

![ 5v 1amp phone charger](/assets/media/posts/2013-08-31-ambilight/power.jpg " 5v 1amp phone charger")

In case you don't know about these things, the 5v+ wire is the one inside the white casing, while the surrounding wire from the sheath is the ground wire.

Connect the ground to the ground of the light strip, and the +5v to the +5v of the light strip. Simple.

Ensure that **both ends** of your LED light strip are grounded. I grounded one end to the Teensy while the other end was grounded to the power supply.

### The entire setup

My complete wiring setup looks like the one below. Remember; your wiring may be different depending on the LED strip you use. Be sure to follow the steps above to identify which wires are what.

[![Adalight for Teensy 2 wiring diagram](/assets/media/posts/2013-08-31-ambilight/diagram.png)](/assets/media/posts/2013-08-31-ambilight/diagram.png)

## 4. Test run

With these pieces of equipment and such low voltages, it's unlikely you can blow anything up by wiring it up wrong, just don't short out any components and you should be fine.

Once you have everything wired up, plug in your power supply to the wall, and then plug in your Teensy. If you've managed to follow everything above, you should see the LED light strip light up red, then green, then blue!

<iframe width="640" height="480" src="//www.youtube.com/embed/Pmi4JiJZ_mQ?rel=0" frameborder="0" allowfullscreen=""></iframe>

If that _doesn't_ happen…

### Troubleshooting

#### Only one of the LEDs lights up

You've plugged the wrong end of the light strip into to the Teensy. The SPI data can only be uploaded to the last “pixel” in the chain if this happens.

#### The LEDs light up in a crazy random sequence

You've either got your Clock and Upload wires backwards, or you've not grounded **both** ends of the LED light strip.

#### Nothing happens at all

You might have a short, or another problem with your wiring - check that your Teensy isn't getting hot as that's usually a good indication you've got something plugged in incorrectly.

Try taking the Ground wire connected to the Teensy, disconnect it, then tap it against the Ground port on the Teensy. This interruption on the ground wire will usually cause one or more of the LEDs in the chain to cycle colours.

## 5. XBMC and Boblight

Let's get this working with the PC and some videos. You'll need to install XBMC if you don't already have it, because that's what this guide is for. See the [list of alternatives](#alternatives "tutorials:electronics:ambilight-with-teensy-2 ↵") below if you have other plans.

### XBMC Plugin

Inside XBMC:
  - Go to `Videos`, then `Add-ons`
  - Select `Get More..`
  - Go up a dirctory by selecting `..`
  - Go to `Services`
  - Select `XBMC Boblight` and install!

You should see an alert saying `Cannot connect to boblightd!`, which is perfectly normal because we don't have the boblightd service installed just yet.

### BoblightD

We now need to grab the daemon which sits between XBMC and the Teensy, doing the legwork of processing the data and sending it via USB.

Hop on over to the [How to Setup Boblight for Windows thread](http://forum.xbmc.org/showthread.php?tid=151559 "http://forum.xbmc.org/showthread.php?tid=151559") and grab the latest Boblightd package.

I've mirrored the June 2013 releases of these files in case they become unavailable:

  - [BoblightD for Windows](/download/ambilight/boblightd.zip)
  - [BoblightD Configuration Tool](/download/ambilight/boblightconfigtool.zip)

Extract BoblightD and the Config Tool somewhere useful, like C:\BoblightD

Fire up the configuration tool. This tool is used to set what direction your LED strip light goes in, and how many LEDs are on each side. For my configuration I have 50 LEDs - a nice even setup uses 20 LEDs across the top, 10 at the sides, and two sets of 7 at the bottom, missing out a chunk in the middle where the TV stand is.

My LED string will also be starting from the bottom left going up, so the bottom left up-arrow should be selected in the configuration tool, to indicate the start position and direction of the LEDs.

Here's my setup:

[![BoblightD Configuration Tool for 50 LEDs](/assets/media/posts/2013-08-31-ambilight/configtool.jpg?w=600&tok=bfcc63 "BoblightD Configuration Tool for 50 LEDs")](/assets/media/posts/2013-08-31-ambilight/configtool.jpg "tutorials:electronics:adalight:configtool.jpg")

The number of LEDs you use is obviously down to personal preference. At the least, I'd suggest about one LED for every 6cm, which works out to roughly 50 LEDs for a 55” TV. You can increase the number of LEDs for increased resolution and brightness - there are 100 and 200 LED setups on YouTube - but I wouldn't space them further apart than 6cm.

Click in the center of the TV view to generate your boblight.conf. Save that to the same directory you installed BoblightD. We'll be coming back to edit this config shortly.

### USB Drivers

If you're going to be plugging the Teensy into a different PC to the one you used for the Arduino/Teensy IDE, you'll now need to go and get the Arduino IDE and Teensy IDE and install them on this PC (or at least the USB drivers). Without these drivers, the device can't connect to a USB serial port and boblight will give you errors.

Fire up the IDE once it's installed and go to `Tools` > `Serial Port`. Note down the com port used, eg. `com3`.

### Boblight Config

Crack open the BoblightD config file you created earlier; we'll need to modify the header slightly.

A few notes:

  - `output` is a linux-esq reference to the com port, like `/dev/com3` for com3.
  - `channels` is RGB (3) multiplied by number of LEDs (50) = 150.
  - `prefix` is a hexidecimal sequence to identify the number of LEDs in the SPI buffer.

Here's my config for 50 LEDs on `com3`:

<pre class="code">
[device]
name            ambilight
output          /dev/com3
channels        150
type            momo
interval        10000
prefix          41 64 61 00 31 64
rate            115200
</pre>

There's probably something wrong with this somewhere, as BoblightD info is scattered across various forums.

The `prefix` is an important part of working with Adalight on the Teensy, and you'll need to use a prefix suitable for the number of LEDs involved. Here are some additional prefixes for other numbers:

<pre class="code">
25 LEDs: 41 64 61 00 18 4D
50 LEDs: 41 64 61 00 31 64
75 LEDs: 41 64 61 00 63 66
100 LEDs: 41 64 61 00 63 36
</pre>

If you need to calculate your own prefix for another number of LEDs, check [this forum thread](http://forums.adafruit.com/viewtopic.php?f=47&t=23972 "http://forums.adafruit.com/viewtopic.php?f=47&t=23972") for additional info.

### Start Boblight

If you deployed BoblightD to C:\BoblightD, just run the start.bat and Boblight should start!

If you deployed the files anywhere else, crack that file open in an editor and change the paths as needed.

### Meanwhile, in XBMC...

Finally, head on over back to XBMC. You should see a new alert appear stating that `XBMC connected to boblightd`, and if you're extra lucky the LEDs will glow to indicate a successful startup!

### Alternatives

I'm using a low-wattage ATOM-based media PC, so there's not much processing power to go around which is why I opted to use the Boblight plugin for XBMC. If you've got a beefier PC or want to use this for more than just videos (eg. with games) you might want to give these a try instead:

  - [Adalight Processing Software](http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/running-the-software "http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/running-the-software")
  - [AmbiBox for Adalight](http://www.msevm.com/forum/index.php?topic=5974&showtopic=5974 "http://www.msevm.com/forum/index.php?topic=5974&showtopic=5974"), a windows application for Adalight

## 6. Mounting to your TV

There are a number of ways to mount the LEDs; some people have used cardboard and sticky tape, but my own personal preference was to create an aluminium bracket to go behind the TV, attached via the VESA mount points.

### Frame size and LED spacing

Having seen a few of these setups on YouTube I didn't want the LEDs to be easily visible from the side of the TV. It really detracts from the effect when you can see the LEDs themselves and you don't want to have to sit dead-centre for it to look good.

For this reason I designed the frame to be about 10 cm smaller than the TV. I'd need to miss a chunk out at the bottom due to the stand sticking out at the back, and I'd also need to be able to attach it to the VESA mounting points - 4 screw holes located 40 cm apart.

I also needed to confirm my LED spacing on the bracket itself. Boblight expects you to place an LED in each corner, so you'll have an LED for each corner (4 LEDs) plus 16 at the top, 9 on each side (18), and 6 each across the bottom (12), totalling 50 LEDs.

To calculate the LED spacing, take the length of a side (eg. 64cm) and divide it by the number of LEDs (not including the corder ones) plus one. The plus one is because you're actually calculating the spaces between LEDs. This works out as `64cm/(9 leds +1) = 6.4cm`.

### Build the frame

Here's the plan I drew up in Evernote:

![design for a an Adalight TV mounting bracket](/assets/media/posts/2013-08-31-ambilight/evernote.png "design for a an Adalight TV mounting bracket")

Blue is the aluminium frame, black are the measurements for each part in cm, while red is the number of LEDs for each side, plus one in each corner.

Next, you just need to buy sufficient aluminium angle from a hardware store (cost me around $40), cut each part to size (a hacksaw should work), then drill and pop-rivet them together. [Here's a handy guide on using a Pop Rivet tool by Ask the Builder](http://www.youtube.com/watch?v=onVeVwat_tg "http://www.youtube.com/watch?v=onVeVwat_tg"), but it's really easy.

Once that's complete, mark up the position of each LED, and drill holes for the them to poke through.

Finally, drill holes for your VESA mount points. Your TV might be different, but mine were 40cm apart and used m8 screws.

### Attaching the LEDs

The Boblight config tool expects your LED chain to start in a corner - mine starts in the bottom left, then goes up and around the frame. You might have to unsolder and resolder some longer wires onto your LEDs if you have a gap, like I do.

Now, glue-gun glue doesn't stick to aluminium, so rather than gluing the LEDs from the inside out, I pushed the LEDs through the aliminium from the inside, and then added a small amount of glue to the outside edge of the LED. This was just enough to keep it in place and not let it fall back through the hole.

[![Solding LEDs on the Adalight TV mounting bracket](/assets/media/posts/2013-08-31-ambilight/frame.jpg?w=600&tok=148bba "Solding LEDs on the Adalight TV mounting bracket")](/assets/media/posts/2013-08-31-ambilight/frame.jpg "tutorials:electronics:adalight:frame.jpg")

Just solder everything up, put insulation sheaths around any loose wires and plug everything into your TV.

Fire up BoblightD, XBMC, and play something!

If you run into any problems at this stage re-check the troubleshooting tips from earlier - chances are something's just connected incorrectly.

## 7. Configure XBMCs Boblight Plugin

The last thing to do is configure XBMC Boblight Plugin for a playback rate you're happy with.

Inside XBMC:

  - Go to `Videos`, then `Add-ons`
  - Select `Get More..`
  - Go up a dirctory by selecting `..`
  - Go to `Services`
  - Select `XBMC Boblight` and `Configure`
  - Go to the `Movie` tab.

I was happy with the following settings:

<pre class="code">
Preset:        Custom
Speed:         40
AutoSpeed:     0
Interpolation: off
Saturation:    1.4
Value:         0.5
Threshold:     40
</pre>

**Speed** and **AutoSpeed** relate to how frequently the LEDs are refreshed. Trying for too fast of a speed on a slow PC can make the LEDs appear “stuttery” to slow to update. A medium speed and low autospeed makes for a more gradual change which isn't distracting from the video.

**Interpolation** I still haven't found an explanation for.

**Saturation** and **Value** control the saturation and brightness of the LEDs relative to the colours from the video. Play with these until the LED light on the wall starts to match that of the video on the TV. If you have cream coloured walls, you might need to modify the RGB settings in the Boblight configuration tool, to offset the colour gamut.

**Threshold** is the bottom value of brightness required on the video before the LEDs will illuminate. We watch a lot of sci-fi, so I wanted a threshold high enough that a starfield wouldn't cause the LEDs to light the wall up grey. 40 seemed a pretty comfortable setting.

Check out the options on the Custom tab also - there are settings to always have the LEDs on at a preset colour, and disable the start-up glow, if you don't like it ruining the surprise for your visitors.

## 8. Enjoy!

Stop reading and go enjoy your new Adalight Ambilight system!

If you have any questions, run into any problems, or can think of ways I can improve this article, let me know in the comments below.

## Resources

  - [Adalight ambient lighting guide](http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/overview "http://learn.adafruit.com/adalight-diy-ambient-tv-lighting/overview")
  - [Teensy 2](http://www.pjrc.com/store/teensy.html "http://www.pjrc.com/store/teensy.html")
  - [Adalight on Github](https://github.com/adafruit/Adalight "https://github.com/adafruit/Adalight")
  - [XBMC](http://xbmc.org/ "http://xbmc.org/")
  - [How to Setup Boblight for Windows thread](http://forum.xbmc.org/showthread.php?tid=151559 "http://forum.xbmc.org/showthread.php?tid=151559")
