---
layout: post
title:      "Unity: coordinates and scales"
subtitle:   "Creating huge games in Unity's coordinate system"
date:       "2013-04-26 12:00:00"
author:     "Dave Newson"
---

Unlike UDK, Unity doesn't actively restrict your world size; you're free to expand and let your players stray until the engine literally runs out of digits and the maths falls apart.

From full size planets to a worm in an apple, Unity lets you work on any scale you like - however if you try to do both the tiny and the huge at the same time you might find yourself coming up against some serious difficulties.

This article covers how Unity's coordinate system works, the effect this has on your playable area, problems with the renderer and how we can make truly massive games actually work.

## Floating Point Accuracy

Unity allows you to place objects anywhere within the limitations of the float-based coordinate system. The limitation for the X, Y and Z Position Transform is 7 significant digits, with a decimal place anywhere within those 7 digits; in effect you could place an object at 12345.67 or 12.34567, for just two examples.

With this system, the further away from the origin (0.000000 - absolute zero) you get, the more floating-point precision you lose. For example, accepting that one unit (1u) equals one meter (1m), an object at 1.234567 has a floating point accuracy to 6 decimal places (a micrometer), while an object at 76543.21 can only have two decimal places (a centimeter), and is thus less accurate.

The degradation of accuracy as you get further away from the origin becomes an obvious problem when you want to work at a small scale. If you wanted to move an object positioned at 765432.1 by 0.01 (one centimeter), you wouldn't be able to as that level of accuracy doesn't exist that far away from the origin.

This may not seem like a huge problem, but this issue of losing floating point accuracy at greater distances is the reason you start to see things like camera jitter and inaccurate physics when you stray too far from the origin. Most games try to keep things reasonably close to the origin to avoid these problems.

## Space is not Infinite

Unity is still fairly forgiving about what it lets you do, even if it's a terrible idea. A warning will be raised if you place an object further away than 100000 units on any one axis, but it'll still let you do it. Similarly, the largest value I've been able to plug into the position transform in Unity 4 is 3e+38, which is a 3 with 38 zeros after it. While this in an impressively huge number, the floating point accuracy issue comes down like an anvil after 9999999, as the notation changes to 1e+07 (one million), and with this notation all you can do is control the number of zeros after the first digit.

Realistically speaking, it's a good idea to keep even scenery objects below the 100000 suggested maximum, ensuring you've at least one decimal place of floating point accuracy. For the player, it's a question of what level of floating point accuracy is needed to keep the gameplay acceptable, as camera movement and physics will start to become unreliable when the floating point accuracy is low.

## A Practical Example

Accepting that our scale is still one meter equals one unity unit (1m = 1u), for a human size object about 1m from the camera, you'll need accuracy down to the millimeter for smooth movement at slow speeds, otherwise you'll start to see juddering in motion. This means you'll need 3 decimal places of accuracy (10<sup>-3</sup> = millimeters).

As you'll always need 3 decimal places of floating point accuracy available for your player, with only 7 digits to work with overall this means you can only have 4 digits to represent whole meters (1234.567). As a result, the maximum playable area is now 9999.999; just shy of ten kilometers.

If your player isn't always going to be on foot however, accuracy down to the millimeter level at all times might not be a requirement. In my case, I'm looking to have the player pilot an aircraft, and only near the origin will there be somewhere for them to hop out and walk around. This means I only really need accuracy down to the centimeter level (0.00) at distant ranges. The result of this is I can make my playable area as big as 99999.99 - almost one hundred kilometers.

This still isn't the physical limit, just a sensible limit to encapsulate our player. As we pass the 100 kilometer mark we'll start to see the physics and rendering become unreliable, so we can just pop up a warning telling the player to “return to the battlefield” and kill them if they don't return within a timeout period. They can actually travel a further 900000 meters before we lose another decimal place and things get really whacky.

## Scaling; Can we take advantage of unused decimal places?

If we know we're not going to see our player on foot outside of 100 meters (99.99999), then you might think we can scale everything down to shift the floating point, giving us greater accuracy at greater distances, but this is unfortunately not the case.

If we scale everything down by 1000x, then our new scale is 1m = 0.001u. At this scale, one millimeter is represented as 0.000001\. Notice how we're no longer “wasting” any significant figures as the last decimal place now represents millimeters.

You might be inclined to think that this then allows us to have 1000x more play area, but you'd be wrong. In the table below I've underscored the “centimeter” digit, which is the minimum accuracy we need to keep things from going crazy. When we can't represent centimeters anymore, that's the limit of our play area.

<table class="table table-bordered block" style="font-family: monospace;">
<tbody>
<tr class="row0">
<td class="col0 rightalign">0.000_0_00</td>
<td class="col1">Origin</td>
</tr>
<tr class="row1">
<td class="col0 rightalign">0.0000_0_1</td>
<td class="col1">1 Millimeter</td>
</tr>
<tr class="row2">
<td class="col0 rightalign">0.0000_1_0</td>
<td class="col1">1 Centimeter</td>
</tr>
<tr class="row3">
<td class="col0 rightalign">0.0010_0_0</td>
<td class="col1">1 Meter</td>
</tr>
<tr class="row4">
<td class="col0 rightalign">0.1000_0_0</td>
<td class="col1">100 Meters</td>
</tr>
<tr class="row5">
<td class="col0 rightalign">1.0000_0_0</td>
<td class="col1">1 Kilometer</td>
</tr>
<tr class="row6">
<td class="col0 rightalign">10.0000_0_</td>
<td class="col1">10 Kilometers</td>
</tr>
<tr class="row7">
<td class="col0 rightalign">100.0000</td>
<td class="col1">100 Kilometers</td>
</tr>
</tbody>
</table>

Notice in the above table, as you pass 100 Kilometers, you lose the centimeter resolution. 100 Kilometers is still the maximum playable area, as the resolution is limited by the number of significant figures available, not the scale of your world.

This is entirely predictable too; as there are only 7 significant figures available, and our cap of 100km = 10,000,000cm = 10<sup>7</sup>cm (notice the 7 zeroes, and the power of 7). If your required accuracy is millimeters, you could have 10<sup>7</sup>mm = 10000000mm = 10km.

## Scaling; When is it actually useful?

While scaling the world for the sake of the playable area alone doesn't bring any benefit, there's still good reasons why you might want to scale the world down.

For instance, if you wanted to accurately represent the Earth and the Moon, with the Earth at the origin (0), the moon would need to be placed at 384,400,000 meters. As discussed above, Unity can't handle that kind of number, and you would end up with “3e+8” which is 300,000,000\. While the moon would initially be OK at this position, the renderer would be having an epileptic fit (for reasons covered later), and if you tried to make the Moon orbit the Earth the physics engine would have a panic attack also.

Instead, we can scale down the celestial bodies and bring their positions down to something Unity can easily handle. Below we'll try out this theory by making their scale 1:100000 (1u = 100km).

<table class="table table-bordered block" style="font-family: monospace;">
<tbody>
<tr class="row0">
<th class="col1">Actual Size</th>
<th class="col2">1:1 size in Unity</th>
<th class="col3">1:100000 size in Unity</th>
</tr>
<tr class="row1">
<td class="col0">Earth Diameter</td>
<td class="col1">12742000m</td>
<td class="col2">1e+7</td>
<td class="col3">12.74200</td>
</tr>
<tr class="row2">
<td class="col0">Moon Diameter</td>
<td class="col1">1737000m</td>
<td class="col2">1737000</td>
<td class="col3">1.737000</td>
</tr>
<tr class="row3">
<td class="col0">Distance from Earth to the Moon</td>
<td class="col1">384400000m</td>
<td class="col2">3e+8</td>
<td class="col3">384.0000</td>
</tr>
</tbody>
</table>

As you can see, the rescaled sizes bring the position transform values back to something Unity can easily handle, and these values won't freak out the physics engine. It should be noted however that we've lost resolution (floating point accuracy) by reducing the scale; the location of our Moon will only have resolution down to ten meters. This isn't a problem if you're working at a celestial scale (the moons orbital velocity is about 1.03 km/s), but obviously you can't just place a 1m player on these tiny planets and expect anything workable.

At this scale we still have a theoretical cap of 1,000,000,000,000m (1000000u) before things get crazy again, and at that distance our resolution is down to 1km. This still isn't far enough to reach Pluto, which at it's closest distance is some 4.2 billion km away from Earth. I'll let you decide if you want to shrink your scale further, or figure out a compound scaling solution for your game, or if you'd rather just give up.

## Camera issues on large scales

Cameras in Unity (and most other engines) have a Near and Far clipping plane, which defines the View Frustum. Everything which falls within the View Frustum will be rendered, and anything outside this range will not.

To render something really small like an apple you may want to be able to bring the camera really close to the object, perhaps as close as 1cm (0.01u) before clipping gets in the way. Conversely, to render something really huge like a planet, you'd set your far clipping plane to encompass the object, at whatever distance it is. For the sake of our example, let's say we want to render out to our maximum play area, 100km (100000u).

If you plug these two values into a Camera (near=0.01, far=100000), you'll notice a few issues. Firstly, polygons might start to intersect and flicker as they z-fight. If you're using Unity Pro with Screen Space Ambient Occlusion (SSAO) applied to the camera, you'll also notice the effect looks like muddy stripes. Finally, if you really do have an object placed out at 100000u you might also notice some oddities in the lighting, with dynamic shadows becoming poorly detailed, or flicking on and off at certain viewing angles.

This is all caused by a lack of z-buffer (depth) accuracy when using a camera frustum this large, and is basically the same issue we were having with our floating point accuracy on the coordinate system, but applied to a camera. A simple way to imagine the problem is the distance between the Near and Far clipping planes will be divided like slices in bread. The number of slices is always the same, but they need to be reasonably closely spaced for everything to work as expected. Setting such a long frustum on the camera results in the slices being spaced too far apart, and weird things start to happen.

The default Unity camera near and far clipping planes are 0.3 and 1000 respectively, so it's recommended to use a ratio similar to this (1:10000) when configuring your cameras to avoid the issues above. For more information, check the [MSDN Article "Common Techniques to Improve Shadow Depth Maps"](http://msdn.microsoft.com/en-us/library/windows/desktop/ee416324%28v=vs.85%29.aspx "http://msdn.microsoft.com/en-us/library/windows/desktop/ee416324%28v=vs.85%29.aspx") and Unity's [Camera Documentation](http://docs.unity3d.com/Documentation/Components/class-Camera.html "http://docs.unity3d.com/Documentation/Components/class-Camera.html")

## The solution; Multiple cameras

Now we're armed with an understanding of our scale and spacial limitations, and the knowledge that a single camera can only have a view frustum ratio of 1:10000, let's discuss the solution to our woes; multiple cameras.

Unity supports the ability to have more than one camera render to the players viewport, each camera layered one on top of the other. At its simplest, we can create two cameras at the same position, and set one with a view frustum of 0.01 to 1000, and the second to 1000 to 1000000\. This will give us full visibility from 0.01 through to 1000000 via two layered cameras, and overcomes the z-buffer depth limitations.

## 3D Skyboxes for huge scenery objects

If we want to have huge scenery objects that won't fit inside the coordinate system limitation at the players scale, we can use the scenery scaling method discussed earlier as well as having the standard player scale.

This arrangement essentially gives us a 3d skybox setup; one camera for the player, a second camera in our miniturised skybox with our “massive” scenery objects. Some code will be required to synchronise the miniture 3d skybox cameras relative (scaled) position and rotation to that of the player camera on every frame, and conveniently someone is already offering a [3D Skybox package on the Unity store for $5](http://u3d.as/content/power-up-studios/3d-skybox/49a "http://u3d.as/content/power-up-studios/3d-skybox/49a")

## Going beyond 3d Skyboxes

One solution the Kerbal Space Program uses is to centralise the camera at the origin, and rotate the world around it. The limited float space of our “world” is used purely for rendering, and the actual coordinates of objects in the world are stored elsewhere in a better - custom - system, and translated into world space on every frame.

KSP also uses the scaled skybox solution to represent distant celestial bodies. As the player gets closer to these objects they're hidden in the skybox and a realistically sized version is added in the player space which they can interact with.

You can read more about Kerbal Space Program's coordinate system in the 2012 developer blog post [Scaled Space: Now with 100% more Floating Origin!](http://forum.kerbalspaceprogram.com/entries/54-Scaled-Space-Now-with-100-more-Floating-Origin!?bt=764 "http://forum.kerbalspaceprogram.com/entries/54-Scaled-Space-Now-with-100-more-Floating-Origin!?bt=764")

These tricks maximise on the floating point accuracy and you're defining your own coordinate system so you should get a much larger playable area as a result, but they do come at a price; having to write your own coordinate system and translate those coordinates to world-space in the engine for rendering on every frame is no mean feat. You also lose a lot of assistance you would get from engine-native features, making AI or Multiplayer games a very difficult thing to do.

