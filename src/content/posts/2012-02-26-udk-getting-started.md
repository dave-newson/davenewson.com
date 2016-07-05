---
layout: post
title:      "Starting out with UDK"
subtitle:   "The things they forget to tell you"
date:       "2012-02-26 12:00:00"
author:     "Dave Newson"
---

![](/assets/media/posts/2012-02-26-udk-getting-started/udk3logo.png)

I’ve been tinkering with Unreal Development Kit (UDK) for Unreal Engine 3 (UE3) for the last few hours, and while this isn’t my first foray with the editor, it’s certainly the first time I’ve really tried to do something with it.

All I really wanted to achieve today was the simple goal of adding a working door to my level in UDK. Now, despite having read the ample [UDK Documentation over at the Unreal Developer Network](http://udn.epicgames.com/Three "http://udn.epicgames.com/Three") – something I would highly recommend to anyone – there were still a lot of black-holes in my “how do I do this basic task” knowledge. A few things I had to go hunting for, and to that end, here’s a not-quite-a-beginners-guide to getting started in UDK.


## Setting up 3D Studio MAX for working with UDK

While the UDK documentation bangs on about all things UDK, they did seem to forget to mention how to set up 3d Studio MAX so your workspace/exports resemble what they would in UDK. This basically means grids and scales.

The [UDK Community site have a lovely guide on 3D Studio Max settings for Exporting to UDK](http://udkc.info/index.php?title=Tutorials:3Ds_Max_-_Settings_for_exporting_to_UDK "http://udkc.info/index.php?title=Tutorials:3Ds_Max_-_Settings_for_exporting_to_UDK"), which covers all the basic points, which can be summed up as:

  - Under the **“Units Setup”**, set the type to **“Generic”**

  - Set the **“System unit scale”** to **“1.0”** and **“Centimeter”**, however as 16 Unreal units is approximately 1 foot, you might want to pick inches or feet, depending on how you like to work.

  - Go to **“Grid and Snap Settings”**. Flip over to the **“Home Grid”** tab, and set the **“Grid Spacing”** to **“0.001”**.

One significant thing they missed however:

  - Go to **“Grid and Snap Settings”** and set the **“Major Lines every Nth Grid Line”** to **8**.

UDKs grid works on powers on 2, and it's default grid snap is every 4 units. If you work in 3DS Max with the Major Grid Lines set to 10 then you’ll be scratching your head when you import to UDK and nothing but the origin appears to be on the grid snaps.



## Multi/Sub-object materials from MAX 2010 to UDK

90% of the model-importing process is explained on the [UDN’s FBX Static Mesh Pipeline walkthrough](http://udn.epicgames.com/Three/FBXStaticMeshPipeline.html "http://udn.epicgames.com/Three/FBXStaticMeshPipeline.html") so the basics are aready covered, however I had a lot of problems when I tried to export an FBX from 3D Studio Max 2010 and import that FBX into UDK; the export would “forget” it had more than one material when I’d used a Multi/sub-object material.

The solution turned out to be fairly simple; [3D Studio 2010′s FBX exporter needs updating](http://forums.epicgames.com/threads/726374-UDK-not-importing-material-IDs?p=27272258&viewfull=1#post27272258 "http://forums.epicgames.com/threads/726374-UDK-not-importing-material-IDs?p=27272258&viewfull=1#post27272258"). Simply go to the [Autodesk FBX page](http://www.autodesk.com/fbx "http://www.autodesk.com/fbx") and grab the update.

Once updated, export your FBX with it’s multi/sub-object material applied, and import it into UDK.

To apply the materials in UDK, open up the mesh in the **Mesh Editor** in UDK and expand the **LODInfo rollout**. For each LOD you’ll find an **Elements list**, with a numerical array of **Materials**. Simply pop your UDK materials into those params.



## Mass-Texture Import

I can’t help but feel there must be some kind of awesome method for mass texture imports that I’ve missed, however my workflow for importing textures is the following:

  - Prep a directory full of images, which are your base textures. All mine were PCX files (don’t judge me).

  - In UDK, go to your **Content Browser** and click the **“Import…”** button.

  - Pick all your texture files from the file browser.

  - In the texture import window, specify your **Package** (eg. “SciComplex”) and **Group** (eg. “Lab”) as normal.

  - **Ensure to tick “Create Material”**.

A word on material creation; If you have a texture in your Content Browser and want to make it a material, you can right click on it and select “Create Material”, which will make a material (duh), only the Diffuse node won’t be connected to the Texture Param node if you use this method, and you’ll need to edit the Material and connect the node yourself. If you’re importing hundreds of raw textures, this is a royal pain in the bum.

Alternatively, if you specify “Create Material” at import time, that diffuse node mapping is created, and you won’t need to edit the material just to get the Diffuse connected.



## Simple Collision

When I imported my simple box doors, none of them initally had collision. [There’s a whole section on collision over at the UDN](http://udn.epicgames.com/Three/FBXStaticMeshPipeline.html#Collision "http://udn.epicgames.com/Three/FBXStaticMeshPipeline.html#Collision"), but I didn’t want to know how it worked, I just wanted some really fast per-poly or box collision while I fiddled with my meshes.



### Box Collision

Feeling lazy and just want box collision for your placeholder door mesh? Open the mesh in the UDK **Mesh Editor**, click the **“Collision”** menu item, and select **“Auto Convex Collision”**. Hit OK and you should end up with an auto-generated green box. This is your new collision.



### Per-Polygon Collision

If you want to go per-poly, perhaps for a roughed out level layout import from MAX, you’ll need to do a few things:

  - In Max, duplicate your static mesh and rename the duplicate to have a prefix of “UCX_”. For instance, “MyMesh” becomes “UCX_MyMesh”, and you’ll have two of the same object ontop of eachother.

  - Open up the mesh in the UDK **Mesh Editor**, and in the top-right pane, scroll down to the bottom. Uncheck:

      - Use Simple Box Collision

      - Use Simple Line Collision

      - Use Simple Rigid Body Collision

  - After placing your mesh, double click it to open the **Properties dialog**. Open up the **“Collision”** section, and tick **“Collide Complex”**.



## Prefabs

Prefabrications (prefabs) are the LEGO sets of UDK; your models, lights, triggers, etc, are the basic bricks you piece together, then you can save your constructions as Prefabs and drop semi-instanced clones of them all around your level.

What do I mean by semi-instanced? And how does this differ from copy/pasting a group? Well again [the UDN has detailed page on Using Prefabs](http://udn.epicgames.com/Three/UsingPrefabs.html "http://udn.epicgames.com/Three/UsingPrefabs.html"), but to put it simply;

  - Prefab instances are stored in Packages (UPK), so are easily accessible and appear in the Content Browser.

  - The stored prefab instance can be updated, and then the ones already dotted about your level can be updated from any instance at any time.

  - As well as updating from instances, Prefabs will selectively update, so if you’ve made unique changes to a single prefab instance, updating it won’t overwrite those special changes.

While I, and probably you, already know all this about prefabs, this is just my preface to the following section:



## Things you should really know about prefabs

### Prefab Kismet and Matinee

ne of the things that wasn’t mentiond anywhere obvious, is Matinee data is contained in a Kismet node, and Kismet instances can be put into Prefabs. **This means you can prefab Kismet and Matinee**, and it’s like the best way to make a door.

That being said, if you build two doors at once in Kismet and go to Create Prefab, you’ll probably get a warning about the Kismet sequence containing external references, and the creation will fail. This is because when you load up Kismet you’re essentially working in a single “Kismet Sequence”, and “Create Prefab” really wants to just take the sequence your trigger/object resides in and copy that straight out into its own prefab’d version. If it can’t have the entire Kismet Sequence, it’ll bail out.

So how do we get our complicated Kismet Node setup away from all the other things in our level and into a single Kismet Sequence we can use with our Prefab?

Just Ctrl-select all your Kismet Nodes that are pertinent to your sequence, right click anywhere in the blank space and hit “Create Sequence from Group (X)“. This will make the selected items into their own sequence, and Prefab Create will stop moaning at you.



### Prefab Pivot Points

The pivot point (origin) of the prefab should be taken from the _last_ object selected just before you hit “Create Prefab…” ([pointed out in this post](http://www.worldofleveldesign.net/forums/showthread.php?1618-UDK-Pirate-Challenge-TheEnemyWithin&s=fc83eaeee7683f441da14ab014a9ce19&p=14752&viewfull=1#post14752 "http://www.worldofleveldesign.net/forums/showthread.php?1618-UDK-Pirate-Challenge-TheEnemyWithin&s=fc83eaeee7683f441da14ab014a9ce19&p=14752&viewfull=1#post14752")), however sometimes this doesn’t work and when you drop the prefab into your level it’ll use the origin pivot of the Trigger/light/something annoying which isn’t on the grid.

To get around this, while the Prefab tries to have a pivot point of its own, you can still select the sub-objects of the prefab anyway, and their pivot will become accessible for use with the entire prefab instance.

We’re still screwed if your sob-object isn’t on the grid though, so ensure when you’re building your prefab to select the item you want to be on the grid and hit the Ctrl+End shotcut. This will snap the pivot point back to the nearest grid major line in UDK ([see the UDK Hotkeys reference by Darren Mckinsey](http://sites.google.com/site/lessonsdarrenmckinsey/udk-hotkeys "http://sites.google.com/site/lessonsdarrenmckinsey/udk-hotkeys") for more incredibly usful UDK keyboard shortcuts).

Rather than rebuild the Prefab a hundred times to try and get the pivot right, or having to compromise on the placement of your sub-objects, Ctrl+End is the way to fly.

Well, that’s all for a few hours on UDK, discovering all manner of weird, wonderful, handily cool features. I’ve decked out my level with 3 different types of door and completed all 20-something door placements in just a couple of hours.


