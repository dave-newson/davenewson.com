// MaximumFish
// Maximum Fish Calculator Script
//
// Code by Dave Newson <vince@shiftrunstop.com>
// Based loosely on Virtual Max's floating Image Script
// http://www.dynamicdrive.com/dynamicindex4/flyimage.htm
//
// Images by Cara Skelsey <cara.skelsey@googlemail.com>
// Some of the fish designs base on those by Hayes Roberts
// http://www.bluebison.net/content/?cat=55


// ForEach prototype for IE
// This prototype is provided by the Mozilla foundation and is distributed under the MIT license.
// http://www.ibiblio.org/pub/Linux/LICENSES/mit.license

if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisp*/)
      {
      var len = this.length;
      if (typeof fun != "function")
      throw new TypeError();

      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
      {
        if (i in this)
        fun.call(thisp, this[i], i, this);
      }
    };
}


/*

var arVersion = navigator.appVersion.split("MSIE")
var version = parseFloat(arVersion[1])

if ((version >= 5.5) && (document.body.filters)) 
{
   for(var i=0; i<document.images.length; i++)
   {
      var img = document.images[i]
      var imgName = img.src.toUpperCase()
      if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
      {
         var imgID = (img.id) ? "id='" + img.id + "' " : ""
         var imgClass = (img.className) ? "class='" + img.className + "' " : ""
         var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
         var imgStyle = "display:inline-block;" + img.style.cssText 
         if (img.align == "left") imgStyle = "float:left;" + imgStyle
         if (img.align == "right") imgStyle = "float:right;" + imgStyle
         if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
         var strNewHTML = "<span " + imgID + imgClass + imgTitle
         + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
         + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
         + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
         img.outerHTML = strNewHTML
         i = i-1
      }
   }
}

*/

// IE compatability test
function iecompattest()
{
    return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}



// Config

var fish_turnaroundchance = 0.2;    // Chance fish will turn around
var tick_nochangelimit = 20;        // Number of ticks without more fish being added before dying
var tick_nochange = 0;              // No-change in fish, counter.
var tick_frames = 5;                // Frames per tick
var tick_num = 0;                   // Number of ticks
var frames_time;                    // Frame execution timer
var frames_num = 0;                 // Frames per tick counter
var frames_maxtime = 250;           // Maximum execution time befor we stop adding fish.
var bubbles_max = 20;               // Maximum weight of bubbles on screen
var resumed = false;                // Fish have been resumed from paying after maxfish reached?
var dev_showinfo = false;            // show development info - fish, ticks, exe time?
var tick_emptybenchmark = 0;        // Benchmark for the first, empty tick. Used to offset browser shittyness.

// Fish container object.
var fish_onscreen = new Array;      

// library of fish images
//  name   = [ src_l, src_r, w, h, move_min, move_max, move_range ];
var fish_a = ["images/fish_aqua_l.png",     "images/fish_aqua_r.png",   "50", "50", 1, 3, 1];
var fish_b = ["images/fish_black_l.png",    "images/fish_black_r.png",  "50", "50", 2, 4, 3];
var fish_c = ["images/fish_blue_l.png",     "images/fish_blue_r.png",   "50", "50", 3, 4, 4];
var fish_d = ["images/fish_brown_l.png",    "images/fish_brown_r.png",  "50", "50", 1, 5, 2];
var fish_e = ["images/fish_green_l.png",    "images/fish_green_r.png",  "50", "50", 3, 4, 1];
var fish_f = ["images/fish_orange_l.png",   "images/fish_orange_r.png", "50", "50", 2, 4, 2];
var fish_g = ["images/fish_pink_l.png",     "images/fish_pink_r.png",   "50", "50", 1, 3, 2];
var fish_h = ["images/fish_purple_l.png",   "images/fish_purple_r.png", "50", "50", 1, 2, 3];
var fish_i = ["images/fish_yellow_l.png",   "images/fish_yellow_r.png", "50", "50", 2, 5, 2];
var fish_j = ["images/stripes_l.png",       "images/stripes_r.png",     "80", "80", 1, 2, 1];
var fish_k = ["images/clown_l.png",         "images/clown_r.png",       "65", "65", 1, 3, 3];
var fish_l = ["images/new_blue_l.png",      "images/new_blue_r.png",    "50", "50", 2, 4, 4];
var fish_m = ["images/fish_light_l.png",    "images/fish_light_r.png",  "50", "50", 2, 2, 2];
var fish_n = ["images/tiny_fish_l.png",     "images/tiny_fish_r.png",   "38", "38", 4, 5, 1];
var fish_o = ["images/fancy_fish_l.png",    "images/fancy_fish_r.png",  "75", "75", 1, 3, 2];
var fish_library = [    fish_a, fish_b, fish_c, fish_d, fish_e, 
                        fish_f, fish_g, fish_h, fish_i,
                        fish_j, fish_k, fish_l, fish_m, fish_n, fish_o ];
                        
// bubble library
//  name =     [ src, w, h, weight
var bubble_a = ["images/bubbles_large_left.png",    "76", "166", 5];
var bubble_b = ["images/bubbles_large_right.png",   "87", "171", 5];
var bubble_c = ["images/bubbles_medium_left.png",   "60", "132", 3];
var bubble_d = ["images/bubbles_medium_right.png",  "68", "131", 3];
var bubble_e = ["images/bubbles_small_left.png",    "30", "65", 1];
var bubble_f = ["images/bubbles_small_right.png",   "32", "63", 1];
var bubble_library = [ bubble_a, bubble_b, bubble_c, bubble_d, bubble_e, bubble_f ];
                        
                        
// Webpage height, width, x and y.
var page = new Array;
page['x'] = 0;
page['y'] = 0;
page['h'] = 0;
page['w'] = 0;


// Page Start - Entry point.

function pagestart()
{

    // Get Page X Y H W.
    if (window.innerWidth || window.opera)
    {
        page['x'] = window.pageXOffset;
        page['w'] = window.innerWidth - 40;
        page['y'] = window.pageYOffset;
        page['h'] = window.innerHeight - 20;
    }
    else if (document.body)
    {
        page['x'] = iecompattest().scrollLeft;
        page['w'] = iecompattest().offsetWidth - 40;
        page['y'] = iecompattest().scrollTop;
        page['h'] = iecompattest().offsetHeight - 20;
    } 
    
    // Initialise bubbles on page
    initBubbles( bubbles_max );
    
	// Display modifications

    // Resize counter item to fill page better
    document.getElementById("fish").style.fontSize = (page['h'] / 5) * 3 +"px";

	// Transparent background for puffy
	document.getElementById('puffy_container').style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="images/puffy.png")';
	document.getElementById('puffy').style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';

    
    // Start timestamp stamp
    var d = new Date();
    thisframe_start = parseInt(d.getTime());

    // Begin fish pond.
    pond();
}
    
function pond()
{

        // Execution Time, Timestamp: end of this frame
        var d = new Date();
        thisframe_end = parseInt(d.getTime());
                                       
     
        // Execution Time, Timestamp: Length of frame render time?
        frames_time += ( thisframe_end - thisframe_start );
             
        // Execution time, Timestamp: Start of this frame
        var d = new Date();
        thisframe_start = parseInt(d.getTime());
    
        // move all fish
        if (fish_onscreen.length > 0)
        {
            fish_onscreen.forEach(moveFish);
        }
        
        // Ticks and Frames per Tick
        if (( frames_num >= tick_frames) )
        {
                        
            // Display execution time on dev screen.
            if (dev_showinfo)
            {
                document.getElementById("dev_frames_time").innerHTML = "Last Frame :"+(frames_time-tick_emptybenchmark)+"ms";
            }
            
            // Are we exceeding the maximum exe time limit yet?
            if ( (frames_time < tick_emptybenchmark + frames_maxtime) && (resumed == false) && (tick_num > 3) )
            {
                // Not exceeding - add more fish.
                fish_onscreen[ fish_onscreen.length ] = new fish( fish_onscreen.length );
                tick_nochange = 0;
            }
            // Too many fish
            else
            {
                tick_nochange++;
            }           
         
            // Another tick..
            tick_num++;
            
            // show devlopment info?
            if (dev_showinfo)
            {
                document.getElementById("dev_ticks").innerHTML = "Ticks: "+tick_num;
                document.getElementById("dev_fish").innerHTML = "Fish: "+fish_onscreen.length;
            }
            
            // Show max fish on screen
            document.getElementById("fish").innerHTML = fish_onscreen.length;
            
            // Apply empty benchmark if it doesn't exist (only happens on first tick)
            if (tick_num == 2)
            {
                tick_emptybenchmark = frames_time;
            }
            
            // Reset frame counters
            frames_time = 0;
            frames_num = 0;
            
        }
        else
        {
            frames_num++;
        }
     
        // if the fish stay the same for 50 cycles
        if ( (tick_nochange <= tick_nochangelimit) || (resumed == true) )
        {
                // render
                var ticker = setTimeout("pond()", 6);
        }
        else
        {   
              
                // Unhide container
                document.getElementById("maximumfish_container").style.visibility = "visible";


                // Display fish #
                var end_1 = setTimeout('document.getElementById("maximumfish").innerHTML = fish_onscreen.length', 500);                
                
                // Display puffy
                var end_2 = setTimeout('document.getElementById("puffy").style.visibility = "visible"', 1500);
                
                // Resume button
                var end_3 = setTimeout('document.getElementById("resume_button").style.visibility = "visible"', 2500);
        }

     
}

// Move Fish

var moveFish = function (fish_object, key)
{

    // if can move fish
    if (document.getElementById)
    {
    
        // Move the fish along their current vector
        fish_object.pos_x = fish_object.pos_x + fish_object.vector_x;
        fish_object.pos_y = fish_object.pos_y + fish_object.vector_y;
   
        // increase the speed of movement
        fish_object.vector_x += fish_object.move_range * (Math.random()-0.5);
        fish_object.vector_y += fish_object.move_range * (Math.random()-0.5);
        
        // SPEED LIMITS
        ///////////////
        
        // Too Fast +X
        if(fish_object.vector_x >  fish_object.move_max + fish_object.move_min)
        {
            fish_object.vector_x = ( fish_object.move_max + fish_object.move_min) * 2 - fish_object.vector_x;
        }
        
        // Too Fast -X
        if(fish_object.vector_x < -fish_object.move_max - fish_object.move_min)
        {
            fish_object.vector_x = (-fish_object.move_max - fish_object.move_min) * 2 - fish_object.vector_x;
        }
        
        // Too Fast +Y
        if(fish_object.vector_y > fish_object.move_max + fish_object.move_min)
        {
            fish_object.vector_y = ( fish_object.move_max + fish_object.move_min ) * 2 - fish_object.vector_y;
        }
        
        // Too Fast -Y
        if(fish_object.vector_y < - fish_object.move_max - fish_object.move_min)
        {
            fish_object.vector_y = ( - fish_object.move_max - fish_object.move_min ) * 2 - fish_object.vector_y;
        }

        
        // TURN AROUND CHANCE
        /////////////////////
        
        // Slow enough to turn +X
        if ( (fish_object.vector_x < 1) && (fish_object.vector_x > 0) )
        {
            if (Math.random() < fish_turnaroundchance)
            {
                // Begin moving -X
                fish_object.vector_x = -fish_object.move_max - fish_object.move_min * Math.random();
            }
        }
        
        // Slow enough to turn -X
        if ( (fish_object.vector_x > -1) && (fish_object.vector_x < 0) )
        {
            if (Math.random() < fish_turnaroundchance)
            {
                // Begin moving +X
                fish_object.vector_x = fish_object.move_max + fish_object.move_min * Math.random();
            }
        }
        
        // BOUNDARYS
        
        // Left boundary
        if(fish_object.pos_x <= page['x'])
        {
            fish_object.pos_x = page['x'];
            fish_object.vector_x = fish_object.move_max + fish_object.move_min * Math.random();
        }
        
        // Right boundary
        if(fish_object.pos_x >= (page['x']+page['w'] - fish_object.width))
        {
            fish_object.pos_x = page['x']+page['w'] - fish_object.width;
            fish_object.vector_x = -fish_object.move_max - fish_object.move_min * Math.random();
        }
        
        // Top Boundary
        if(fish_object.pos_y <= page['y'])
        {
            fish_object.pos_y = page['y'];
            fish_object.vector_y = fish_object.move_max + fish_object.move_min * Math.random();
        }
        
        // Bottom Boundary
        if(fish_object.pos_y >= page['y']+page['h'] - fish_object.height)
        {
            fish_object.pos_y = page['y']+page['h'] - fish_object.height;
            fish_object.vector_y = - fish_object.move_max - fish_object.move_min * Math.random();
        }
           

        // Move fish to new location.
        document.getElementById(fish_object.id).style.left = fish_object.pos_x+"px";
        document.getElementById(fish_object.id).style.top  = fish_object.pos_y+"px";
        
        // Calculate fish direction
        var fish_currentdirection = (fish_object.vector_x < 0 ) ? "left" : "right";
        
        // Direction changed?
        if (fish_object.direction !== fish_currentdirection)
        {

		var container = document.getElementById(fish_object.id);
		var image = document.getElementById(fish_object.id+"_image");

            // Change image to match direction
            if (fish_currentdirection == "left")
            {
                image.src = fish_object.src_l;
                container.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="'+fish_object.src_l+'")';
        ;
            }
            else
            {
                image.src = fish_object.src_r;
                container.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="'+fish_object.src_r+'")';
            }
        }
        
        // Store direction
        fish_object.direction = fish_currentdirection;
        
   }
}



// Fish Object

function fish(name)
{

    // name of the fish element
    this.id = "fish_"+name;
    
    // Load random fish image from library
    var new_fish = fish_library[ Math.round((fish_library.length-1) * Math.random()) ];
    
    // Fish Image
    this.src_l  = new_fish[0];  // image: moving left
    this.src_r  = new_fish[1];  // image: moving right
    this.width  = new_fish[2];  // width
    this.height = new_fish[3];  // height
    
    // Fish Personality
    this.move_min = new_fish[4];    // minimum movement speed
    this.move_max = new_fish[5];    // maximum movement speed
    this.move_range = new_fish[6];  // movement speed change frequency

    
    // Establish random movement vectors
    
    // X
    if (Math.random() < 0.5)
    {
        this.vector_x = (this.move_max + this.move_min) * Math.random();
    }
    else
    {
        this.vector_x = (-this.move_max - this.move_min) * Math.random();
    }
    
    // Y
    if (Math.random() < 0.5)
    {    
        this.vector_y = (this.move_max + this.move_min) * Math.random();
    }
    else
    {
        this.vector_y = (-this.move_max - this.move_min) * Math.random();
    }
    
    // Establish fish direction from movement vector
    this.direction = ( this.vector_x < 0 ) ? "left" : "right";
    
    // Establish random start location
    this.pos_x    = page['w'] * Math.random();
    this.pos_y    = page['h'] * Math.random();
    
    // Create element on page
    var newfish = document.createElement('div');
    newfish.setAttribute('id',this.id);         // name of element
    
    if (this.direction == "left")
    {
        newfish.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="'+this.src_l+'")';   // PNG support
    }
    else
    {
        newfish.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="'+this.src_r+'")';   // PNG support
    }
    
    newfish.setAttribute('width',this.width);   // image width
    newfish.setAttribute('height',this.height); // image height
    newfish.style.position = "absolute";        // positional CSS
    newfish.style.left = this.pos_x+"px";       // start pos X
    newfish.style.top = this.pos_y+"px";        // start pos Y
    newfish.className = "bubbles";

    document.body.appendChild(newfish);         // Create element on page


	// Image
	var newfish_img = document.createElement("img");
	newfish_img.setAttribute("id", this.id+"_image");	// name of element
	newfish_img.setAttribute('width',this.width);   // image width
	newfish_img.setAttribute('height',this.height); // image height

	if (this.direction == "left")
	{
		newfish_img.setAttribute('src',this.src_l); // image height
	}
	else
	{
		newfish_img.setAttribute('src',this.src_r); // image height
	}

	newfish_img.setAttribute('alt', '');
	newfish_img.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';

        document.getElementById(this.id).appendChild(newfish_img);         // Create element on page


    
}

// initialise static bubbles on page

function initBubbles(max)
{
    // weight of bubbles on screen
    var onboard_weight = 0;
    var i = 0;
    
    // until bubbles forfilled
    while (onboard_weight < max)
    {


        var new_bubble = bubble_library[ Math.round((bubble_library.length-1) * Math.random()) ];

	var newbubble_container = document.createElement("div");
	newbubble_container.className = "bubbles";
	newbubble_container.setAttribute('id', 'bubble_container'+i);                 // name of element
        newbubble_container.style.position = "absolute";              			// positional CSS
	newbubble_container.style.left =  (page['w'] * Math.random() ) +"px";      //  pos X
        newbubble_container.style.top =   (page['h'] * Math.random() ) +"px";      // pos Y
	newbubble_container.setAttribute('width', new_bubble[1] );    // image width
        newbubble_container.setAttribute('height', new_bubble[2] );   // image height
	newbubble_container.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",src="'+new_bubble[0]+'")';   // PNG support

	document.body.appendChild(newbubble_container);

        // get a random bubble from the library

        var newbubble = document.createElement('img');      // make element
        newbubble.setAttribute('id', 'bubble'+i);           // name of element
        newbubble.setAttribute('src', new_bubble[0]);       // src of image
	newbubble.setAttribute('width', new_bubble[1] );    // image width
        newbubble.setAttribute('height', new_bubble[2] );   // image height
	newbubble.setAttribute('alt', '');
	newbubble.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)';
        
        try
        {
            newbubble.style.opacity = 0.25+Math.random();
        }
        catch (error) {}

        
        document.getElementById("bubble_container"+i).appendChild(newbubble);               // Create element on page
    
        // add weight of bubble onto screen
        onboard_weight += new_bubble[3];
        i++;
    }
}


// Button press: Resume playing fish
function resume_fish()
{
    // Turn on the resume timer - add no more fish!
    resumed = true;
    
    // Hide maximum fish box
    document.getElementById("maximumfish_container").style.visibility = "hidden";
    document.getElementById("puffy").style.visibility = "hidden";
    document.getElementById("resume_button").style.visibility = "hidden";
    
    // Begin playing fish.
    var ticker = setTimeout("pond()", 1);
}


// Establish onload event

if (window.addEventListener)
{
	window.addEventListener("load", pagestart, false)
}
else if (window.attachEvent)
{
	window.attachEvent("onload", pagestart)
}
else if (document.getElementById)
{
	window.onload=pagestart
}
