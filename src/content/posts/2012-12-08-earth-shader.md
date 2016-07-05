---
layout: post
title:      "Planet Earth Material Shader for UDK"
subtitle:   "Based on JavaHawk's original Earth / Planet Material Shader tutorial"
date:       "2012-12-08 12:00:00"
author:     "Dave Newson"
header_img:
  url: "assets/media/posts/2012-12-08-earth-shader/earth.jpg"
---

This is a fairly in-depth tutorial based on [JavaHawk's original Earth / Planet Material Shader tutorial](http://www.youtube.com/watch?v=xS8vDVCHF9c "http://www.youtube.com/watch?v=xS8vDVCHF9c"), aiming to improve upon the original concept and provide a more realistic looking planet.

[![UDK Planet Earth Material Shader](/assets/media/posts/2012-12-08-earth-shader/earth.jpg?w=600&tok=df5355 "UDK Planet Earth Material Shader")](/assets/media/posts/2012-12-08-earth-shader/earth.jpg "tutorials:udk:planet-earth:earth.jpg")

## Preface

I'm expecting you to have some experience with UDK already, so this tutorial won't detail how to import textures, models, or the UDK interface. If you haven't already, I would highly recommend watching [JavaHawk's original tutorial video for the Earth shader](http://www.youtube.com/watch?v=xS8vDVCHF9c "http://www.youtube.com/watch?v=xS8vDVCHF9c") as he covers some useful basics before he covers the shader itself.

## Find some assets

The first thing you're going to need are texture assets for your planet. I found mine, for Earth, by simply Googling “Planet Earth Shader” with the size option set to “Large”.

I personally ended up using a combination of [textures created by "Jestr" from The Celestia Motherlode repository](http://www.celestiamotherlode.net/catalog/show_creator_details.php?creator_id=5 "http://www.celestiamotherlode.net/catalog/show_creator_details.php?creator_id=5") (which had to be scaled down to reasonably fit in UDK - I'd suggest a _maximum_ of 2048×1024) and [Planet Earth Texture Maps from JHT's Planetary Pixel Emporium](http://planetpixelemporium.com/earth.html "http://planetpixelemporium.com/earth.html").

I saved everything out to 2048×1024 PNGs in 8bit RGB, then imported these to UDK, grouping them into a new “**PlanetEarth**” package.

## Create your planet

The first thing we need to do in UDK is set up our Earth object. Handily, UDK provides its own sphere object which we can use as our earth without any need to make our own just yet.

Locate the **Sphere** object in the **Content Browser** by simply searching for **Sphere**, then drag it from the Content Browser into your map.

[![Sphere object that comes with UDK](/assets/media/posts/2012-12-08-earth-shader/1.jpg?w=600&tok=b5ebaf "Sphere object that comes with UDK")](/assets/media/posts/2012-12-08-earth-shader/1.jpg "tutorials:udk:planet-earth:1.jpg")

Now right click in the Content Browser and **create a new material**. I called mine “**Earth**” and placed it in the same “**PlanetEarth**” group along with the imported textures.

Double click the material in the Content Browser to open it for editing.

Finally **drag and drop the Diffuse texture from the Content Browser into the Material**. Connect the black output to the Diffuse channel and you'll have a really basic texture map.

Save your changes and then *drag-and-drop the material onto your planet sphere* - voila, you have a really basic planet.

[![](/assets/media/posts/2012-12-08-earth-shader/2.jpg?w=600&tok=31a824)](/assets/media/posts/2012-12-08-earth-shader/2.jpg "tutorials:udk:planet-earth:2.jpg")

You'll notice the backside of the planet (highlighted in blue) which should be lying in complete shadow is actually still very visible. This is an aspect of the default Phong shading combined with global illumination.

In order to add night lights and an atmospheric halo, we'll need to use **Custom Lighting** on this material and not the default Phong shader.



## Custom Lighting

To use Custom Lighting, **click on empty space in the Material Editor** and the properties panel will show the settings for the material itself.

Under the “**Material**” group you should find an entry for “**Lighting Model**”. **Change this from MLM_Phong to MLM_Custom** to gain access to the Custom Lighting.

Remove the Diffuse material from the Diffuse node for now and move it aside.

Create a **Light Vector** node and a **Constant 3 Vector** node. **Set the Constant 3 Vector to 0,0,1**. This appears blue in the Material Editor, but that's simply UDK showing the three values as Red, Green and Blue. What this will actually represent is a vector in 3d space.

Create a **Dot Product** node and connect up your Light Vector and Constant 3 Vector to the Dot Product.

Finally **feed the result of the Dot Product to the Custom Lighting node** on the material.

What we've just done is create a material instruction which calculates the strength of the light as it hits each pixel of the material. The Dot Product instruction compares two vectors and outputs a scalar (float) value. The [0,0,1] vector represents “up” from the normal of the surface the light is hitting. Long story short, this gives us the strength of the light as it hits any surface on our model.

If you save this as it is now, you'll notice your Earth sphere in both the Material Preview and the Map will show with one side in complete white, and the other side in complete darkness. This, however, isn't the complete story.


## Light Vectors

**Double-click your earth sphere in the map** to open the object properties window.

Under **Static Mesh Actor** > **Static Mesh Component** > **Lighting** you'll find an option called **Accepts Dynamic Dominant Light Shadows**. Uncheck this option. (Note: you may need to uncheck **Cast Dynamic Shadow** depending on your lighting situation).

You should now notice that the back-side of your earth model in the map is now a “burnt orange” colour, and what you're seeing in the Material Editor Preview is no longer the same as what you're seeing in your map.

[![](/assets/media/posts/2012-12-08-earth-shader/3.jpg?w=600&tok=62f6a9)](/assets/media/posts/2012-12-08-earth-shader/3.jpg "tutorials:udk:planet-earth:3.jpg")

UDK's default settings will have objects cast Dynamic Shadows, which includes applying a back-side shadow to itself. In this particular instance, our Custom Lighting setup causes the backside to be lit, but this was hidden by the dynamic shadows. Now the shadows are disabled, we can see the effect.

So why the burnt orange colour? This is what you get when you light something in UDK with a negative value.

As the Light Vectors Dot Product produces a positive value on the side of the sphere which faces the light source, the same Dot Product produces a zero value at the equator where the light is exactly 90 degrees to the surface. For the faces which point away from the light source, a negative value is given.

[![An explaination of Light Vectors](/assets/media/posts/2012-12-08-earth-shader/5.jpg?w=600&tok=c562db "An explaination of Light Vectors")](/assets/media/posts/2012-12-08-earth-shader/5.jpg "tutorials:udk:planet-earth:5.jpg")

This is important as it'll give us a powerful tool to light the backside of the sphere later on when we implement night lights.



## Light Vectors and Emissive

As a warning, there is a point where many people have become stuck in the past with UDKs Light Vectors. People often attempt to feed the Dot Product of a Light Vector into the Emissive channel of a Phong texture, however this merely results in an over-lit object.

[![UDK Light Vector being fed to the Emissive channel of a Phong material](/assets/media/posts/2012-12-08-earth-shader/4.jpg?w=600&tok=7f1bf3 "UDK Light Vector being fed to the Emissive channel of a Phong material")](/assets/media/posts/2012-12-08-earth-shader/4.jpg "tutorials:udk:planet-earth:4.jpg")

My best guess at what's happening here is the Emissive channel actually counts towards the Light Vector, and this results in a kind of “feedback” where the result is the value always being 1.

Note that while the [Rim Lighting examples on the UDN](http://udn.epicgames.com/Three/MaterialExamples.html#Rim%20Lighting "http://udn.epicgames.com/Three/MaterialExamples.html#Rim%20Lighting") feed to the Emissive channel, they don't use Light Vectors but instead use a fixed world-space vector.

This, along with the Dynamic Shadow pitfall, is usually what prevents people from being able to put lights only on the dark side of their objects.



## Using the Light Vector

Ok, so we know what direction the light is coming from on our object, but it doesn't look pretty just yet. What we'll do now is combine the Light Vector Dot Product with the Diffuse Texture from before to create some actual lighting.

**Disconnect the Dot Product from the Custom Lighting channel**. You can do this by Ctrl-Clicking the Custom Lighting node.

**Add a “Constant Clamp”** node, select it, and set the **Min value to 0** and the **Max value to 1**.

**Connect the Dot Product to the Constant Clamp**. This lets us just get the value of the Light Vector Dot Product on the side which faces the light source.

Finally, bring back your diffuse texture and **add a Multiply node**. **Connect the Constant Clamp and the Texture to the Multiply**, then **feed the multiply to the Custom Lighting**.

By clamping the Dot Product we cap the value at 1 and 0, excluding all negative numbers from our calculations, and then we multiply the texture by these values. Essentially anything in darkness will be multiplied by 0, equalling 0 (or black) and anything in light is multiplied by 1, resulting in the fully lit texture.

[![](/assets/media/posts/2012-12-08-earth-shader/6.jpg?w=600&tok=0c792f)](/assets/media/posts/2012-12-08-earth-shader/6.jpg "tutorials:udk:planet-earth:6.jpg")

As highlighted above, you'll notice that the line between light and dark is very sharp. This is accurate in regards to our Light Vector, but it doesn't look right for a planet.

To add a bit more of a gradient at the light terminator, **detatch the Clamp from the Multiply** and then **add a Power node** between them.

**Create a Scalar Paramter node** and plug that into the **Exp** input for the Power Node, and then plug the Constant Clamp into the **Base**.

Click on the Scalar Parameter node and **set the name to “Light Gradient**” and give it a default value of **3**.

In the picture below, I've grouped the instructions (right-click in the Material Editor and select “new Comment”) to help explain what's doing what.

[![](/assets/media/posts/2012-12-08-earth-shader/7.jpg?w=600&tok=bcacde)](/assets/media/posts/2012-12-08-earth-shader/7.jpg "tutorials:udk:planet-earth:7.jpg")

What we've done here is multiply the Light Vector Dot Product by itself 3 times. While imperceivable before, the light-side of the sphere wasn't all set to absolute 1, it was just a value _very close_ to 1\. This means when we apply a Power (times itself by 3 of itself), it becomes reduced and looks like a gradual gradient change.



## Night Lights

Now that we have custom lighting in full swing, we can apply night-time lighting on the dark side of the planet.

This can be done by replicating the same structure as the daytime lighting, but with a subtle difference; we'll switch the Constant Clamp to be from -1 to 0\. This will give us the Light Vector for the dark side of the sphere instead of the light.

Once you've created the similar layout, we simply use an **Add** node to combine the day time and night time lighting into one, and feed it to the Custom Lighting.

[![Planet Earth shader with nighttime city lighting](/assets/media/posts/2012-12-08-earth-shader/9.jpg?w=600&tok=03ee93 "Planet Earth shader with nighttime city lighting")](/assets/media/posts/2012-12-08-earth-shader/9.jpg "tutorials:udk:planet-earth:9.jpg")

**Warning:** You must toggle the “Cast Static Shadow” on the object in order to see the Night Lights in your map. The Material Editor Preview will **always** omit the night lights as it has it's own self-cast dynamic shadow occluding them from view.

As you can see in the above shader, the Constant Clamp gives us the back-lighting of the sphere, and the Power instruction handily converts the 0 to -1 into 0 to 1 values (because -1 * -1 = 1).

[![](/assets/media/posts/2012-12-08-earth-shader/10.jpg?w=600&tok=5e6db4)](/assets/media/posts/2012-12-08-earth-shader/10.jpg "tutorials:udk:planet-earth:10.jpg")

Notice there's a gap between the night lights and the daytime area on the sphere - rather unrealistic to have a band of utter darkness where nobody has bothered to turn on the lights yet. This is because the gradient we added using the Power of 3 instruction is counting as much against the lights as it is the daytime.

To fix this, we need to offset the light vector calculations slightly and “push” the night lights towards the daylight.

Simply create an “Add” node between the Dot Product of the Light Vector and the Constant Clamp, and feed it a value of -0.5\. This will offset the result of the Dot Product in favour of the daytime area.

[![Offsetting the Light Vectors Dot Product](/assets/media/posts/2012-12-08-earth-shader/11.jpg?w=600&tok=27f1d7 "Offsetting the Light Vectors Dot Product")](/assets/media/posts/2012-12-08-earth-shader/11.jpg "tutorials:udk:planet-earth:11.jpg")

This results in much more realistic looking night lights which start at the point where it gets dark.

Below is a snapshot of our shader overall so far - simply diffuse lighting for the day time and night time lighting on the dark side of the planet.

[![Simply Earth Shader with day and night lighting](/assets/media/posts/2012-12-08-earth-shader/12.jpg?w=600&tok=226c2c "Simply Earth Shader with day and night lighting")](/assets/media/posts/2012-12-08-earth-shader/12.jpg "tutorials:udk:planet-earth:12.jpg")



## Atmospheric Glow

On the side of the Earth which faces into the sun we should see a blue atmospheric glow. This is the next thing we'll add to our Earth shader.

**Add a Fresnel node to your Material**.

The Fresnel is essentially the same as the Light Vector Dot Product, except the value isn't derived from the Light Vector, it's derived from the Camera Vector, and it's the inverse. This means faces pointing towards you will be 0, and those at a right angle will be 1\. Presumably those facing away from you will be -1.

Below I've simply added the Fresnel on top of the day time diffuse lighting to show what Fresnel does.

[![](/assets/media/posts/2012-12-08-earth-shader/13.jpg?w=600&tok=496193)](/assets/media/posts/2012-12-08-earth-shader/13.jpg "tutorials:udk:planet-earth:13.jpg")

This is a nice start, but we want to reduce the overall effect, colourise it, and have it so it's offset towards the Light Vector. To do this we'll need to re-juggle our shader slightly.

[![](/assets/media/posts/2012-12-08-earth-shader/14.jpg?w=600&tok=a4ec35)](/assets/media/posts/2012-12-08-earth-shader/14.jpg "tutorials:udk:planet-earth:14.jpg")

Here we've split the Diffuse Lighting and the Diffuse Texture off into two groups. This allows us to create our Diffuse texture and Halo, then multiply it by the Diffuse lighting so only the correct side is lit, with the halo.

The halo itself, highlighted in blue, is a Fresnel node which we power by 4 to _reduce_ the size of gradient for the Fresnel (remember, as it's 0 through 1 any Power application will reduce the effect). We then multiply the effect by 2,2,8 - which in this case _is_ an RGB value. This intesnifies the effect slightly and gives it a blue tint.

Beautiful.

[![](/assets/media/posts/2012-12-08-earth-shader/15.jpg?w=600&tok=1cd7d2)](/assets/media/posts/2012-12-08-earth-shader/15.jpg "tutorials:udk:planet-earth:15.jpg")



## Bonus Round: Atmospheric Thickness

This next section requires you to have some knowledge of a 3D modelling program that can export to FBX, such as 3D Studio Max.

If you zoom in close on our planetary sphere or blow it up to be utterly enormous (like a real planet), the atmospheric Fresnel effect starts to look a bit weak - the only bloom the atmosphere has is applied by the post-processing in UDK, and it doesn't look like the atmosphere fades into space at all.

As I wanted the planet to look as realistic as possible, I divised a way to make the atmosphere really have some thickness to it. This means a custom planet object.

Make two spheres - the inside one is the surface of your planet, while the other one should be slightoly larger (10-20%) and have its normals inverted so it's inside out. This is your atmosphere.

[![](/assets/media/posts/2012-12-08-earth-shader/16.jpg?w=600&tok=89c15c)](/assets/media/posts/2012-12-08-earth-shader/16.jpg "tutorials:udk:planet-earth:16.jpg")

To get these quickly into UDK from 3D Studio - create a Bone facing upwards and apply a Skin modifier to each sphere, selecting the Bone as the root node. Set a different Material ID to each sphere, and then apply a Multi/Sub-material to both, with two different material subchannels. If this didn't make sense, you'll need to read another tutorial.

Export to FBX and import into UDK - if created correctly then you should have a Skeletal Mesh on your hands. Drag-n-drop this into your map as this is your new planet object.

[![](/assets/media/posts/2012-12-08-earth-shader/17.jpg?w=600&tok=40cb2c)](/assets/media/posts/2012-12-08-earth-shader/17.jpg "tutorials:udk:planet-earth:17.jpg")

Crack open the rollouts for **Skeletal Mesh Component** > **Rendering** > **Materials** and **click the green plus** to add material slots on your object.

**Select the Earth material** in the Content Browser that we made earlier and **click the green arrow on the material slot numbered [0]**. This should drop your Earth material onto the innermost sphere.

Create a new Material in the Content Browser. I called mine “**Atmosphere**”. **Apply this material to the slot numbered [1]**, and then double click it in the Content Browser to edit it.

Under the **Material Properties** in the **Material Editor**, set the **Blend mode** to **BLEND_Additive**, and the **Lighting Model** to **MLM_Custom**

**Create a Fresnel node** and wire it to the Custom Lighting. Save the material to see the result.

[![](/assets/media/posts/2012-12-08-earth-shader/18.jpg?w=600&tok=f263e9)](/assets/media/posts/2012-12-08-earth-shader/18.jpg "tutorials:udk:planet-earth:18.jpg")

Hopefully you can see where we're headed from here. We need the inverse of the Fresnel, then to power it down a little.

**Add a “One Minus” node** (it will appear as “1-x”) and feed the Fresnel into it. This will invert the Fresnel effect and give us a gradient from the inside-out rather than the outside-in.

Now we want to reduce the gradient slightly, so **create a Power node** and **feed the OneMinus into the Base**, then **create a Scalar value, set it to 20** and **feed it into the Exp** of the Power.

[![](/assets/media/posts/2012-12-08-earth-shader/19.jpg?w=600&tok=680ebd)](/assets/media/posts/2012-12-08-earth-shader/19.jpg "tutorials:udk:planet-earth:19.jpg")

This gives us a halo around the entire Earth, which looks a little like a solar eclipse. Unfortunately we're still not quite there as only the side receiving light should have the atmospheric glow, and the dark side of the Earth should have none at all.

With all our work involving Light Vectors, I'm sure you know where we're headed next.

Even though we want the Halo to be on the side of the planet receiving light, because our sphere is inverted we'll need to get an inverse of the Light Vector. The quickest way to obtain that is to create a Dot Product of the Light Vector and Vector [0,0,1]. Clamp it to ”-1 to 0” which gives us the inverse, and then multiply it by itself to convert it from a negative figure to a positive one we can use (-1 * -1 = 1).

Then all you have to do is **Multiply** the Halo by the inverse Light Vector, and maybe even Multiply the halo by the colour value ([2,2,4] in my case), and you'll see the halo is only on the side of the earth which is lit!

[![Earth atmosphere shader](/assets/media/posts/2012-12-08-earth-shader/20.jpg?w=600&tok=81112b "Earth atmosphere shader")](/assets/media/posts/2012-12-08-earth-shader/20.jpg "tutorials:udk:planet-earth:20.jpg")


## The Advanced Earth Shader

In the version attached below, I've taken the Earth shader and included clouds, offset cloud shadows, and custom specular lighting. There are all items covered by JavaHawk's original tutorial, so there's no good reason to reiterate them here.

Note that we have to emulate the Phong shader (with specular lighting) due to the fact we're using Custom Lighting. How to do this is explained briefly in [Custom Lighting documentation on the UDN](http://udn.epicgames.com/Three/CustomLighting.html#Reconstructing%20the%20Phong%20lighting%20model%20for%20dynamic%20lighting "http://udn.epicgames.com/Three/CustomLighting.html#Reconstructing%20the%20Phong%20lighting%20model%20for%20dynamic%20lighting").

[![](/assets/media/posts/2012-12-08-earth-shader/earth-shader.png?w=600&tok=e9e509)](/assets/media/posts/2012-12-08-earth-shader/earth-shader.png "tutorials:udk:planet-earth:earth-shader.png")

[View a sample of the final Planet Earth shader here.](/assets/media/posts/2012-12-08-earth-shader/earth-final.jpg "tutorials:udk:planet-earth:earth-final.jpg (86.4 KB)")


## Future Improvements

There's an extremely insightful [post on the Eve Online Dev Insider blog regarding Awesome Looking Planets](http://community.eveonline.com/devblog.asp?a=blog&bid=724 "http://community.eveonline.com/devblog.asp?a=blog&bid=724"), which goes into detail about their methods for creating some really good looking unique planets with a limited number of resources.

The inside-out-sphere for the atmospheric halo could also double as “sky” if you were to fly down to the surface of the planet. Currently the halo is far too intense for this to work and simply blinds the camera, but careful tweaking of values and adjustment of the same method could result in a fairly realistic appearing atmosphere.
