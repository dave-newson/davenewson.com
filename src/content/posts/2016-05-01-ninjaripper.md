---
layout:     post
title:      "Model extraction with NinjaRipper"
subtitle:   "Porting copyrighted material for fun and no profit"
date:       "2016-05-01 12:18:00"
author:     "Dave Newson"
thumb_img:  "/assets/media/posts/2016-05-01-ninjaripper/11-mesh.png"
header_img:
  url: "assets/media/posts/2016-05-01-ninjaripper/header.jpg"
  darken: 0.5
---

<blockquote>
Give a man a ripped model, and that's copyright infringement.
<br /><i>Teach</i> a man to rip models ..
</blockquote>

## Motivation

The HTC Vive finally arrived, and along with this new awesome toy came the desire to *see all the things* in Virtual Reality.

What things? Well, I've always wanted to be thrown off the end of an aircraft carrier in an F/A-18 Super Hornet,
strafe a convoy in an A-10, or just razz around in an M1 Abrams tank and wreck up the place.  There are a lot of options.

These lofty goals are easier to accomplish than you might think.

The [Unreal Engine 4](https://www.unrealengine.com/) is now free (mostly) and natively supports the HTC Vive, among others.
I already have modelling tools and enough knowledge to be dangerous, so all I need are some high-quality models to throw
into the environment.

## Face Punch

The goons over at [FacePunch have been doing this shit for years](https://facepunch.com/forumdisplay.php?f=40).

If there's a game you want the models from, chances are there's a thread for it.  Ask nicely and someone might even go
and extract the specific thing you're looking for.  They're just a nice bunch like that.

There are, of course, a few threads for Battlefield models:

 - [BF4 & MoH WG models](https://facepunch.com/showthread.php?t=1396674)
 - [Dice models V1](https://facepunch.com/showthread.php?t=1320985)
 - [Models BF4 and BFH](https://facepunch.com/showthread.php?t=1458438)
 - [Battlefield 3 Vehicle models](https://facepunch.com/showthread.php?t=1290750)

I found a few problems, however, in trying to use the models I found on FacePunch:

 - Not all the vehicles I wanted to play around with were available (at the time).
 - The normal maps were missing from a lot of the models.
 - Some of the textures were a bit.. weird, or the UVs looked a bit _off_. Some manual intervention had been required.

As per always, this is the point where I diverged from my original goal, and go down the rabbit hole of trying for perfection.

## Do it yourself

I tried a few different tools, and eventually settled on the dodgiest-looking one; [NinjaRipper](http://cgig.ru/ninjaripper/).

NinjaRipper has several advantages over things like [Intel GPA](https://facepunch.com/showthread.php?t=1438007),
like it would actually extract all the UV channels and have the normals orientated correctly.

The workflow for NinjaRipper was also a whole lot less awkward, with an immediate dump of all assets being made,
leaving you to sift through the rubble at a later date.

Where NinjaRipper kind of sucked however, was the MaxScript used to convert the `.rip` files into 3D Studio Max.

 - Extracting multiple rip files was very slow.
 - A single texture and UV map was extracted, even if multiple maps/textures were visible in the source of the `.rip`.
 - UVs were often flipped.
 - Dodgy UV map co-ords could result in 3D Studio crashing.

I found a [slightly improved ninja_importerb7_cl69.ms by Mark Ludwig](http://forum.xentax.com/viewtopic.php?p=83507&sid=9692c5110a4442150b8161d976205f22#p83507),
and this fixed a handful of the problems:

 - Added an option to flip the UVs
 - Added bulk imports
 - Sped up the import by 50-70%

But this still left lots of serious problems, with the biggest being that inability to extract both the diffuse texture
map, and the normal map, in a single pass.

_Sigh._

## A poor tool blames its workman

Conveniently I'm a programmer by trade, so I decided to lift the lid off this thing and make my own improvements.

 - Prevented bad UV map coordinate selection from cashing 3D Studio.
 - Added support to extract multiple UV channels at the same time.
 - Added ability to save materials as multi/sub-map.
 - Tweaked debug messaging, improved speed, split and restructured the code.

<div class="text-center">
 <a href="https://github.com/dave-newson/ninja-ripper-ms" class="btn btn-primary">View the source on GitHub</a>
</div>

Now that the ripper is capable of getting what I'm after, let's put together a workflow that allows us to get the
exact model we want, without lots of unpleasant cocking about.

## Rippin' stuff

You need to use the correct binary (`x64` or `x86`) for the game binary you're going to run.

In this example we're going to be using Battlefield 4, so let's go with the `x64/NinjaRipper.exe` binary.

### Attaching NinjaRipper to a game

![Ninja Ripper](/assets/media/posts/2016-05-01-ninjaripper/01-ninja-ripper.png)

Firstly, use the `Exe [...]` button to pick the executable you want to run, such as `bf4.exe`.

If you need to, you can specify optional arguments for the executable. This is necessary for Battlefield 4.

Secondly, pick where you want the Output files to be dumped using the `Dir [...]` button.

Thirdly, select the D3D wrapper DLL you wish to use. `Intruder inject` is the normal default, but I've had mixed experiences making that work.

Lastly, you can click the `Settings` button for some extended configuration options.

![Ninja Ripper extended settings](/assets/media/posts/2016-05-01-ninjaripper/02-settings.png)

It's not usually necessary to save the shaders, unless you really want to see how something works and intend to reproduce it completely.

Once you're all configured, hit `Run` to fire up the game, wrapped with NinjaRipper.

If you can't make the game run through NinjaRipper (eg. Battlefield likes to use the web UI), it sometimes still works provided you use 
the `Run` button, then launched the game through another mechanism. I believe this is to do with just ensuring the D3D Wrapper DLL was installed correctly.

### Ripping a model

NinjaRipper dumps whatever is in the Draw Call buffer at the time. If the model you're after is in a low-LOD state, you'll get the low LOD ripped.  
This basically means you'll want to get as close as you can to the model you want to extract, with the game in the highest quality settings.

Getting the target dead-center of your view is not necessary, nor of any particular help, so just go for whatever.

Once you're in position, hit the button you configured to the `All` option, which by default is `F10`. If that fails to do anything, try `F12`.

If it worked, you'll probably notice the game freeze and appear to hang. Give it a minute, as it's ripping the buffer.

Repeat this for all the things you want to rip. 

### What was the rip again?

Your output directory should now be full of rip folders. Each folder will be full of `.rip` and `.dds` files.

![Ninja Ripper Output](/assets/media/posts/2016-05-01-ninjaripper/03-output.png)

Using a program like [XnView](http://www.xnview.com/en/), you can quickly skim through the `.dds` files, and look for the skin of the model you want to extract.

Start from the *last* `Tex_xxxx_x.dds` file, and press (or hold) `Page Up` to skim backwards in XnView through the `.dds` files.   
As the files are in the same order as the draw calls were made, you'll find one of the larger files near the end of the `Tex_` list is the fully-rendered in-game view.

At worst, you should be able to find a G-buffer of the Ambient Occlusion pass, or similar.

![Ambient Occlusion Buffer for Battlefield 4 in XnView](/assets/media/posts/2016-05-01-ninjaripper/04-ao.jpg)

This doesn't help you find any models, but it's useful if you can't remember what it was you were trying to grab in the first place.

### Finding the .rip you want

Still using the `.dds` browsing method, skim through the texture files until you happen across one that looks like it's involved in the model you want to grab.

For instance, I'm after the 40mm Grenade Launcher. Skimming the files it's not long before I find something suspiciously 8-barrel lookin'.

![Battlefield 4 40mm Grenade Launcher Specular Map in XnView](/assets/media/posts/2016-05-01-ninjaripper/05-grenade-launcher-spec.jpg)

Now I have the texture name, I can search the `.rip` files for the same name, `Tex_0388_3`.

![](/assets/media/posts/2016-05-01-ninjaripper/06-grep.png)

*Shazam.* `Mesh_0071.rip` should contain our 40mm fun gun.

### Importing to 3d Studio

Once in 3D Studio Max, go to the main menu bar and select `Max Script` `>` `Run Script...`.
Browse to wherever your downloaded the [modified ninja_ripper_import.ms max scripts](https://github.com/dave-newson/ninja-ripper-ms), and select it to run the script.

![Ninja Ripper Max Script](/assets/media/posts/2016-05-01-ninjaripper/07-ninja-ripper.png)

Using the `Input .rip file [...]` button, browse to and select the file you wish to import.

To specify the specific UV byte index positions, you'll need to change the mode from `Auto` to `Manual`.

Quite a bit of trial-and-error is required for the UV index numbers. You may also need to flip the UV Vertical axis.

<table class="table table-bordered">
<tr>    <th>Item</th>                       <th>Diffuse UV</th> <th>Normals UV</th> <th>Flip Vertical Axis</th> </tr>
<tr>    <td>Battlefield 3 Objects</td>      <td>u12 / v13</td>  <td>u14 / v15</td>  <td>Yes</td>                </tr>
<tr>    <td>Battlefield 3 Vehicles</td>     <td>u15 / v16</td>  <td>u17 / v18</td>  <td>Yes</td>                </tr>
<tr>    <td>Battlefield 3 Characters</td>   <td>u24 / v25</td>  <td>u26 / v27</td>  <td>Yes</td>                </tr>
<tr>    <td>Battlefield 3 Heads</td>        <td>u20 / v21</td>  <td>u22 / v23</td>  <td>Yes</td>                </tr>
<tr>    <td>Battlefield 4 Weapons</td>      <td>u20 / v21</td>  <td>u22 / v23</td>  <td>Yes</td>                </tr>
</table>

Once imported, you may end up with something a little like this.

![Raw NinjaRipper Import to 3D Studio Max](/assets/media/posts/2016-05-01-ninjaripper/08-raw-import.jpg)

Even if it's showing with the wrong texture, providing your texture map looks _kind of mapped_ then you've probably picked the right UV numbers.

### Manual labour: Materials

Open up the `Material Editor`, and use the `Pick Material from Object` tool to obtain the Multi/Sub-Object map on the item.

![Raw NinjaRipper Import to 3D Studio Max](/assets/media/posts/2016-05-01-ninjaripper/09-materials.jpg)

This stage requires you to do some manual work; you'll have to set up the actual material and place the correct maps into the correct slots.

Some of the bitmaps won't even apply to the model; some of these are engine bitmaps (single pixel colours) or detail maps. You can discard or replace these as you see fit.

Below is an example of the material-fixing process.

![Raw NinjaRipper Import to 3D Studio Max](/assets/media/posts/2016-05-01-ninjaripper/10-materials.png)

### Manual labour: Fixing the mesh

You may have noticed, but the mesh isn't exactly in a good shape. Some of the pieces are way out of alignment.   

![Mesh misalignment on import](/assets/media/posts/2016-05-01-ninjaripper/11-mesh.png)

This is not related to the import; it's just how the mesh was stored for the draw call, and will always be the same.

Before you fix this, you should try using the `Edit Mesh` `>` `Select Element` tool to pick parts of the mesh. 
The mesh is usually split up by it's smoothing groups, and this gives you an opportunity to rebuild those groups.

Once this is done, you can weld all the vertices together at a very low tolerance (eg. `0.001`),
and use `Select Element` to pick and move the various parts of the model around.

Once all that's done, you can start to bone and skin the model, then animate, export to FBX, and bring it into UE4.

### That is a lot of work.

Yes, it is.

Still, totally worth it to get flung off an aircraft carrier at 176 miles an hour.

![](/assets/media/posts/2016-05-01-ninjaripper/12-ue4.jpg)









