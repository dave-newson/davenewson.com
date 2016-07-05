---
layout: post
title:      "UDK Dynamic Lights and Interp Actors"
subtitle:   "How to make shadows and doors play together"
date:       "2012-02-29 12:00:00"
author:     "Dave Newson"
header_img:
  url: "assets/media/posts/2012-02-29-udk-lights/4_1_.jpg"
  darken: 0.5
---

The other night I was having a good time with UDK – kicking back and prefab'ing a door or two, reminiscing about the good old days of doing game design rather than web development, but then I got onto the subject of dynamically lighting InterpActors and UDK suddenly stopped talking to me. When I went to Google and tried to find out what I'd done wrong, nobody could give me a straight answer – lots of people with the same issue, but no solution.

After a lot of reading on the UDN and afew hours of trial-and-error, I found a solution to all my problems; me and UDK could be friends once more and we could continue on our magical journey.

For all the other poor souls out there with the same issue, here's a run down of what I experiences, and how you too can fix those god damn phantom shadows bleeding through your static interpactors and CSG.


## The Big InterpActor Lighting Problem

Consider a scene where you have two nicely lit rooms connected by a doorway. In this doorway you place a Static Mesh (your “door”), and beside the door you place one blue light.

[![](/assets/media/posts/2012-02-29-udk-lights/0_1_.jpg?w=500&tok=e4f71e)](/assets/media/posts/2012-02-29-udk-lights/0_1_.jpg "tutorials:udk:intep-lighting:0_1_.jpg")

The StaticMesh, because it’s static, has it’s shadows/light occlusion computed as part of the static lighting. This Static object blocks the blue Static light rays being cast through the doorway.

Awesome, grand, we’re all on the same page.

Now, as doors have this nasty habit of being interactive, we can’t use a StaticMesh – instead we need an InterpActor (interpolated actor), which is an object that can move. As I’ve mentioned before, I’m not writing these things for absolute beginners, and there are about a hundred tutorials out there for [Getting To Know Kismet](http://www.youtube.com/watch?v=qJOWW4pVxoo "http://www.youtube.com/watch?v=qJOWW4pVxoo") and [How Do I Door 101](http://www.youtube.com/watch?v=XUOakBgNLoY "http://www.youtube.com/watch?v=XUOakBgNLoY"), so I’m not going to go through all that. Point is, you need an InterpActor.

Now, when you pop down an InterpActor as your door – infront of your lovely blue PointLight – something hideous happens.

[![](/assets/media/posts/2012-02-29-udk-lights/1_1_.jpg?w=500&tok=b64ffc)](/assets/media/posts/2012-02-29-udk-lights/1_1_.jpg "tutorials:udk:intep-lighting:1_1_.jpg")

“Oh my god, UDK, why would you do such a thing?” I hear you ask. For the un-aware, this is the view from the other room, with the blue light shining “through” the doorway.

As you can see, the bright blue StaticLight has been nicely occluded by our InterpActor door, so there’s no blue light coming through out doorway, but the Modulated Shadows are still being dynamically cast from the occluded light source, for the entire door, and they’re projected nastily across our CSG/BSP, and generally making a mess of the place. They’re presumably yellow because the light source is blue, but I honestly have no idea.

There’s another variation of this problem where you’ll see the Bounce/Radiance lighting from the StaticLight projected into the room, and the modulated shadows ontop of that lighting, but the shadow will never make the lighting go to pitch-black, and will always be obviously transparent. When the door is closed, the bounce/static light is still present and the Modulated shadow just exists ontop of the static lighting.



## How can we fix it

There are a few methods we can use to fix this little problem. The most common and highly recommended method is to use a Dominant light source, such as **DominantPointLight**.

Using the Dominant Lights is _highly recommended_ for outdoor area, or anywhere you can fit them. Their object shadows as fully dynamic, and they can also make use of [distance field shadows](http://udn.epicgames.com/Three/DistanceFieldShadows.html "http://udn.epicgames.com/Three/DistanceFieldShadows.html") for the environment which are a cheaper shadow solution for large-scale lighting (though they don’t support penumbra size, ambient occlusion or transparent shadowing).

Dominant lights will work for this purpose right off the bat, and they’re fairly inexpensive as you can only have the one dominant light casting into one spot at any time. You can put multiple dominant lights into the same level (eg. DominantSpotLight), but they can never overlap (I think the overlap radius is a combination of light radius and the size of the polygons they’re cast onto).



## But if you need multiple lights...

Ok, so I thought DominantSpotLights would be an awesome solution to this problem, but then I had two light sources casting into the same space, and only one dominant light cast it’s rays (which is the expected behaviour), so this ruled out the use of Dominant lights. Now what do we do?

Well, with a little bit of reconfiguring, you can use a Movable light to cast dynamic lights/shadows.

First, Pop down a **Movable light**, such as a **SpotLightMovable** or **PointLightMovable**. A regular point light won’t work, and I’ve had mixed (read: bad) results with a Toggleable lights. The also tend to inflate the Light Build time significantly.

Ensure **LightComponent.CastStaticShadows** is **off** for your Movable Light, otherwise the light will kick out static light that’ll penetrate your interpActor.

Also make sure **LightComponent.LightShadowsMode** is set to **LightShadow_Normal**, otherwise the shadows cast will be _Modulated_, and you’ll have the same shadow problem you started with.

[![](/assets/media/posts/2012-02-29-udk-lights/2-1024x410_1_.jpg?w=500&tok=75e8cd)](/assets/media/posts/2012-02-29-udk-lights/2-1024x410_1_.jpg "tutorials:udk:intep-lighting:2-1024x410_1_.jpg")

Now take your interpActor and toggle **DynamicSMActor.StaticMeshComponent.Lighting.UsePrecomputedShadows** to **on**. I know, this seems totally counter-intuitive, right?

From my best estimation, this appears to both push the InterActor into affecting Static lights (occluding static light rays), but also invalidates the interpActors lighting for the Movable light, requiring it to always have dynamic shadows.

Again, this is likely the most expensive way possible to achieve this, so if you can avoid using dynamic lighting – do so!

![](/assets/media/posts/2012-02-29-udk-lights/4_1_.gif)

Rebuild your lighting, which should be instantaneous for the “Emitting Photons” phase, as dynamic lights never bake their lighting, and you’ll see something like the above when you animate your door. A fully dynamic light, with fully dynamic shadows.

Fully dynamic lights have some cosmetic disadvantages mind you; they have harsh shadows (no penumbra) and don’t have any radiosity (the light doesn’t bounce) – so no Ambient Occlusion or Soft Shadowing.



## How does this affect my static lights?

UDK can do some beautiful things with it’s baked lighting, and dynamic lighting is very expensive, so we want to know how well the InterpActors and Dynamic Lights actually behave with normal baked lighting. Where possible, we’ll want to have baked static lights, and only where lights cast on InterpActors do we want a dynamic light.

As the above image doesn’t show you how our white Static PointLight interacts with the interpActor door, I’ve blown out the brightness/radius of the white Static Light in the following picture. The screen shot shows the door mid-animation, where it’s idle position would be closed.

[![](/assets/media/posts/2012-02-29-udk-lights/4_1_.jpg?w=500&tok=dce979)](/assets/media/posts/2012-02-29-udk-lights/4_1_.jpg "tutorials:udk:intep-lighting:4_1_.jpg")

As you can see, the Static light doesn’t bleed into the adjacent room and stops abruptly at the bounds of the interpActor. This is a good thing as you can use dim static lights on one side of the door and not have to worry about the light “seeping” out under the edges of the door itself. You can safely light the room with static lights that barely reach the door frame, and use Movable dynamic lighting for anything light that would cast through the door frame.

You can just make out the blue dynamic light being cast on the floor through the doorway, so it’s nice to know the Dynamic and Static lights will overlay and play well together.

