---
draft:      true
layout:     post
title:      "Model extraction with NinjaRipper"
subtitle:   "Porting copyrighted material for entertainment purposes"
date:       "2016-05-01 12:18:00"
author:     "Dave Newson"
header_img:
  url: "assets/media/posts/2016-05-01-ninjaripper/heading.jpg"
  darken: 0.25
---

> Give a man a fish and that's copyright infringement. Teach a man to fish and you can write a blog post about it.

## Motivation

The HTC Vive finally arrived, and along with this new awesome toy came the desire to *see all the things* in VR.

What awesome things? Well I've always wanted to be thrown off the end of a runway in an F/A-18 Super Hornet,
strafe a convoy in an A-10, or razz around in an M1 Abrams and wreck up the place.

This is easier to accomplish than you might think; the [Unreal Engine 4](https://www.unrealengine.com/) is free (ish) and
natively supports The HTC Vive and Oculus CV1.
I already have modelling tools and enough knowledge to be dangerous, so all I needed were a few models to throw
into the environment.

## Face Punch

The dudes over at [FacePunch have been doing this kind of thing for years](https://facepunch.com/forumdisplay.php?f=40).
If there's a game you want the models from, chances are there's a thread for it.  Ask nicely and someone might even go
get the specific thing you're looking for.

There are a few threads for Battlefield models:
 - [BF4 & MoH WG models](https://facepunch.com/showthread.php?t=1396674)
 - [Dice models V1](https://facepunch.com/showthread.php?t=1320985)
 - [Models BF4 and BFH](https://facepunch.com/showthread.php?t=1458438)
 - [Battlefield 3 Vehicle modles](https://facepunch.com/showthread.php?t=1290750)

I found a few problems, however, in trying to use the models I found on FacePunch:
 - Not all the vehicles I wanted to play around with were available.
 - The normal maps were missing from lots of the models.
 - Some of the textures were a bit.. weird, or the UVs looked a bit _off_. Some manual intervention had already been made.

As per always, this is the point where I diverged from my original goal, and go down the rabbit hole of trying for perfection.

## Do it yourself

I tried a few different tools, and eventually settled on the dodgiest-looking one; [NinjaRipper](http://cgig.ru/ninjaripper/).

NinjaRipper has several advantages over things like [Intel GPA](https://facepunch.com/showthread.php?t=1438007),
like it would actually extract all the UV channels and have the normals orientated correctly.

The workflow for NinjaRipper was also a whole lot less awkward, with an immediate dump of all assets being made,
leaving you to sift through the rubble for each snapshot at a later date.

Where NinjaRipper kind of sucked however, was the MaxScript used to convert the `.rip` files into 3D Studio Max.

 - Extracting multiple rip files was very slow.
 - A single texture and UV map was extracted, even if multiple maps/textures were visible in the source of the `.rip`.
 - UVs were often flipped.
 - Dodgy UV map coords could result in 3D Studio crashing.

I found a [slightly improved ninja_importerb7_cl69.ms by Mark Ludwig](http://forum.xentax.com/viewtopic.php?p=83507&sid=9692c5110a4442150b8161d976205f22#p83507),
and this fixed a handful of the problems:

 - Added option to flip the UVs
 - Added bulk import method
 - Sped up the import by 50-70%

But this still left lots of serious problems, with the biggest being an inability to extract both the diffuse texture
map, and the normal map, in a single pass.

_Sigh._

## A poor tool blames its workman

Conveniently I'm a programmer by trade, so I decided to lift the lid off this thing and make my own improvements.

 - Prevented bad UV map coordinate selection from cashing 3D Studio.
 - Added support to extract multiple UV channels at the same time.
 - Added ability to save materials as multi/sub-map.
 - Tweaked debugging, speed, error reporting, file structure.

<a href="https://github.com/dave-newson/ninja-ripper-ms" class="btn btn-primary">View it on GitHub</a>

Now the ripper is actually capable of getting what I'm after, let's put together a workflow that allows me to get the
exact model I want, without lots of unpleasant cocking about.

## Rippin' stuff















