---
layout: post
title:      "Conditional Aggregation on Arrays of Objects in MongoDB"
subtitle:   "A nifty (if hacky) way of conditionally aggregating an array of objects in MongoDB"
date:       "2013-10-29 12:00:00"
author:     "Dave Newson"
thumb_img:  "assets/media/posts/2013-10-29-mongo-aggregate/thumb.jpg"
header_img:
    url:
---

If you work with databases and haven't yet heard of MongoDB, take a few minutes and watch [MongoLab's Will Shulman talk about MongoDB for small applications](https://www.youtube.com/watch?v=b1BZ9YFsd2o "https://www.youtube.com/watch?v=b1BZ9YFsd2o"). If that sounds like your kind of tech, then maybe consider hopping over to [MongoDB University](https://education.mongodb.com/ "https://education.mongodb.com/") and sign up for M101 while the courses are still free!

I recently discovered a nifty (if slightly hacky) way of conditionally aggregating an array of objects in MongoDB, based on a value inside those objects. That's a bit of meaningless mouthful, so here's the Stack Overflow version.

I have an array of objects within my documents, and I want to aggregate individually across 3 of those fields, to create a graph. My data looks like this:

<pre class="code">{
     "_id" : ObjectId("5219ff9e8c6e167cb38d9257")
     "fields" : [
          {
               "field_id" : "alpha",
               "value" : 10
          },
          {
               "field_id": "bravo",
               "value" : 20
          },
          {
               "field_id": "charlie",
               "value" : ISODate("2012-12-19T06:01:17.171Z")
          },
          {
               "field_id": "delta",
               "value": 40
          }
     ]
}</pre>

I want to aggregate across the fields with `field_id` of _alpha_, _bravo_ and _charlie_; I want to group on _charlie_, get a sum of _alpha_ and a count of _bravo_ We don't care about _delta_. The overall aim is to get data for creating a graph with X and Y axis, grouping on Z (_alpha_, _bravo_ and _charlie_ respectively).

The problem is that we're trying to aggregate by a value rather than a field name. MongoDB's [Aggregation Framework](http://docs.mongodb.org/manual/aggregation/ "http://docs.mongodb.org/manual/aggregation/") is great working across _known_ field keys, but conditionally aggregating by a value is an entirely different story. Still, the twitch in the back of my brain tells me this can be done, so let's continue.

The obvious first step is to use [$unwind](http://docs.mongodb.org/manual/reference/operator/aggregation/unwind/ "http://docs.mongodb.org/manual/reference/operator/aggregation/unwind/") to explode `fields` into a set of individual documents. After this we can aggregate the individual records back together.

<pre class="code">{$unwind:'$fields'}</pre>

Now let's collapse our documents back together, which we can do by their unique `_id`, but more important we want to “pivot” the values for _alpha_, _bravo_ and _charlie_ so they become accessible under known keys, which we can then aggregate properly.

Checking out the documentation for the aggregation operator [$cond](http://docs.mongodb.org/manual/reference/operator/aggregation/cond/ "http://docs.mongodb.org/manual/reference/operator/aggregation/cond/"), the example uses $sum to aggregate conditionally on a field value. We can do a similar trick to get our individual field values onto known keys.

<pre class="code">{$group: {
     '_id': '$_id',
     'x': { $max: {$cond: [ $eq: ['$fields.field_id', 'alpha'], '$fields.value', null ] } },
     'y': { $max: {$cond: [ $eq: ['$fields.field_id', 'bravo'], '$fields.value', null ] } },
     'z': { $max: {$cond: [ $eq: ['$fields.field_id', 'charlie'], '$fields.value', null ] } }
}}</pre>

The above performs a conditional ($cond) check for equality ([$eq](http://docs.mongodb.org/manual/reference/operator/aggregation/eq/ "http://docs.mongodb.org/manual/reference/operator/aggregation/eq/")) of the `fields.field_id` against our `field_id` names _alpha_, _bravo_ and _charlie_. When the condition passes, the `fields.value` is passed back by _$cond_, and if nothing is matched, a _null_ value is passed back instead. [$max](http://docs.mongodb.org/manual/reference/operator/aggregation/max/ "http://docs.mongodb.org/manual/reference/operator/aggregation/max/") sifts these returned values, ensuring our data is returned and not _null_s. Each `field_id` has its own line and casts to the known field names `x`, `y` and `z`.

Why $max and not $sum? [$sum](http://docs.mongodb.org/manual/reference/operator/aggregation/sum/ "http://docs.mongodb.org/manual/reference/operator/aggregation/sum/") will try to aggregate the data in `$fields.value`, but you can't sum a _String, ISODate, ObjectId, Array_ or _Object_. $max on the other hand will return the highest single match (there should only be one match anyway as we're grouping by the unique `_id` field of our documents), and works across all possible data types. As _anything_ is seen to be higher than null, we'll always get the field data back instead of the nulls.

Magically, we now have our data in the following format:

<pre class="code">{
     "_id" : ObjectId("5219ff9e8c6e167cb38d9257")
     "x" : 10
     "y" : 20
     "z" : ISODate("2012-12-19T06:01:17.171Z")
}</pre>

From here we can go right ahead and write our regular aggregation query to do what we wanted in the first place; sum _alpha_ (now _x_), count _bravo_ (now _y_), and grouping by _charlie_ (now _z_).

<pre class="code">{$group:{
     _id: '$z',
     'x': {$sum: '$x'},
     'y': {$sum: 1}
}}</pre>

And here's our query in full:

<pre class="code">db.test.aggregate([
     {$unwind:'$fields'},
     {$group: {
          '_id': '$_id',
          'x': { $max: {$cond: [ $eq: ['$fields.field_id', 'alpha'], '$fields.value', null ] } },
          'y': { $max: {$cond: [ $eq: ['$fields.field_id', 'bravo'], '$fields.value', null ] } },
          'z': { $max: {$cond: [ $eq: ['$fields.field_id', 'charlie'], '$fields.value', null ] } }
     }},
     {$group:{
          _id: '$z',
          'x': {$sum: '$x'},
          'y': {$sum: 1}
     }}
]);</pre>

### More Magic!

This only partially solved our problem at the office - the kicker was needing to collate _a series_ of `field_id`s into one aggregate; that is to say, our data had several `field_id`s that meant the same thing, and needed to b counted as such.

#### How do we collapse a series of fields into one?

Easy! Use the [$or](http://docs.mongodb.org/manual/reference/operator/aggregation/or/ "http://docs.mongodb.org/manual/reference/operator/aggregation/or/") function:

<pre class="code">{$group:{
        '_id': '$_id',
        'x': { $max: {$cond: [ {$or: [
            {$eq:['$fields.field_id', 'alpha')]},
            {$eq:['$fields.field_id', 'alpha2')]}
            ]}
            , '$fields.data', null] } },
        'y': { $max: {$cond: [ {$or: [
            {$eq:['$fields.field_id', 'bravo')]},
            {$eq:['$fields.field_id', 'bravo2')]}
            ]}, '$fields.data', null] } }
}}</pre>

It's important to note that the list of `field_id`s above will never appear on the same document; eg. we never get one document with both _bravo_ and _bravo2_. We also can't use the $in operator inside $cond, because it's not available here. I believe there's already a ticket with MongoDB to resole this oversight.

#### What about data that don't appear inside the ''$fields'' array?

If you want to include data from your document that doesn't appear in your unwound array, simply use the [$first](http://docs.mongodb.org/manual/reference/operator/aggregation/first/ "http://docs.mongodb.org/manual/reference/operator/aggregation/first/") operator to only grab the first instance grouped. As a practical example, here we're including `_id` as a separate field in our aggregate:

<pre class="code">{$group:{
        '_id': '$_id',
        'my_id': {$first: '$_id'},
        'x': { $max: {$cond: [ {$or: [
            {$eq:['$fields.field_id', 'alpha')]},
            {$eq:['$fields.field_id', 'alpha2')]}
            ]}
            , '$fields.data', null] } }
}}</pre>

Using `$first` is a simple way to collapse the results to the first accepted item. If you don't use $first, you'll get an array in `my_id` which fills up with duplicates.

Hopefully that helps someone out. Go have fun - MongoDB is great for playing with data!