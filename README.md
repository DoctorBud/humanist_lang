# Notebook Lang

Notebook Lang (final name TBD) is a humanist programming language for doing exploratory programming 
and visualizations.  It is reactive and organized around transforming and plotting of data. 
It is a humanist language, as its primary 
concern is providing a good experience for the human doing the programming. It does not focus on 
performance or typesafety, except where that would help the primary humanist concerns.
*Notebook Lang is a tool for thinking about things, not shipping production software.*

Note: __This language is currently theoretical (with implementation stubs), but the eventual goal is a web-based notebook interface that anyone can use and share.__

# Status

A note on notation. I'm still playing around with the symbols to use for pipeline vs lambda functions,
variable assignment vs equality test, named args vs maps, etc. There's *so* many different ways to do it, including partial and deferred evaluation, defaults, and more. Sheesh!

# Features

* heavy use of functional features like map and foreach with as few overhead variables as possible
* built in vis libs for drawing, graphs, random number generation, and vectors
* unit based numbers with conversions
* Reactive evaluation. When one dependency is updated the rest of the notebook will update automatically.
* pipeline operator to chain things together
* apis always try to do the right thing and be forgiving. ex: a graph label can take text or an image or URL
* assign variables only once (maybe?)
* very forgiving syntax, whitespace doesn't matter, case-insenstive, skip underlines, do it how you want.
    * `foo == FoO`
    * `f_o_o == foo`
    * `CoolFunc == cool_func`
    * `1_000_000 == 1000000`
    * `4ft == 4 ft == 4 feet == 4 foots == scalar(4,'feet')`
  
Notebook Lang takes inspiration from

* [Frink](https://frinklang.org/)
* [APL, J, Kerf](https://github.com/kevinlawler/kerf)
* [Jupyter & and Python](https://jupyter.org) and notebook programming
* [Mathematica](https://www.wolfram.com/mathematica/)
* [TallyCat](http://apps.josh.earth/tallycat/), an earlier unit based calculator I wrote.

# Unit Math

Supports numbers with units, conversion between them, and performing math on them.

```
8ft * 10ft * 10ft as gallons = 5984.42 gallons
8ft as cm = 243.84 centimeters
0xFF as decimal == 255
20% == 0.2
```

# operators

All operators are functions and most can be applied to scalars and lists. This makes
complex vector operations easier to represent compactly. Infix operators are just sugar
for the real functions underneath.

``` javascript
1+2 = add(1,2) = 3
3 + [1,2] = add(3,[1,2]) = [4,5]
[1,2]+[3,4] = [4,6]
+ across [1,2,3] = across(add,[1,2,3]) = 6
```

In addition to the built-in operators, new operators can be defined in libraries as functions with
metadata to treat it as operators (TBD).

Builtins:
* the usual: `+ - * /`
* power: `**` ex: pow(5,2) = `5**2`  sqrt(9) = `9**-2`
* modifying operators: `++` `+=` `--` `-=` `*=` `/=`
* remainder division: `mod`  __(% is used for the percent unit)__
* boolean: ``<= < == > >= and or not xor`  __(use ! for not or factorial?)__


# Functions

Functions can have indexed and named arguments as desired.  They can be combined with regular 
composition or the pipeline operator. Functions can be anonymous. 

The pipeline operator is sugar for function composition. The pipeline always maps to the first argument to the receiving function, thus:

`f() => g(42)` is the same as `g(f(),42)`.

Bigger example of pipelining

``` javascript
// load a table, pull out the second column, calculate a total

let data = load('table.csv')
let data2 = map(data,(row)=>row[1])
show(sum(data2))

// the same with pipeline operator

load('table.csv') => map( row => row[1]) => sum() -> show()

```

## Mixing indexed and named arguments:

``` javascript
let data = load('http://some.url/table.csv')
chart(data, type='bar', width='600')
```

Named arguments usually are optional and have defaults. Indexed arguments are usually
core to the use of the function. It is common to have a function with the first being
a required input indexed argument, and the rest being options to control how the function
behaves.

Some of the built in functions:

* __rand__: random numbers. `()->[0,1], (max)->[0,max], (min,max)->[min,max]`
* __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`
* __map__:  convert every element in a list using a lambda function: `(list, lam)`
* __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`
* __order__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")`
* __take__: take the first N elements from a list to make a new list `take(data, 10)`
* __pick__: take random elements from list `pick(data,5)` get five random elements
* __reverse__: return a list with the order reversed  `reverse(data)`
* __select__: select items from list using where: lambda function returning false. `select(data, where=(t)=>t.amount>0)`
* __sin__, __cos__, __tan__: the usual trig functions
* __point__: a two component vector `point(25,50) === [25,50]`
* __range__: produces a list of numbers. `(min?,max,step=1)`
* __draw__: draws lists/nested lists of shapes
* __circle__ : a circle shape with center, radius, and fill
* __rect__: a rect shape with width, height, position and fill `rect(width=100, height=50)`
* __pack_row__: packs shapes in a row, centered vertically
* __pack_col__: packs shapes in a column, centered horizontally
* __draw_geomap__: draws a geo map
* __histogram__: draws a histogram of the data 
* __address_to_geo__: converts a street address to a geo coordinate (US addresses only)

# comments

Use whatever you want.  `#` or `//` or `/* */`. Anything else?

# Standard Datasets

The language environment comes with several built in useful datasets

* EARTH: circumference, radius, mass, population
* PLANETS: radius, mass, orbital distance, albedo
* US_STATES: name, date entered union, abbrevation, capitol, current population, flag
* SCRABBLE: values of different letters


# Examples:

## Histogram of date states entered the union

``` javascript
    DATASETS.US_STATES =>
        histogram( item: (s)=>state.date_entered_union,
                  label: (s)=>state.abbreviation,
                  bin_size: 10yrs)
```


## How long would it take Superman to fly around the world
Let's assume he is [faster than a speeding bullet](https://en.wikipedia.org/wiki/.220_Swift). 
We need the circumference of the earth and the speed of the fastest bullet. Lets show it in hours.

`earth.circumference / 4_000 ft/s as hours`


## Show the relative sizes of the planets in the solar system as a row of circles
``` javascript
planet_to_circle <= (planet) => circle(
    radius = planet.radius,
    fill = color(hue=random(360))
    )

DATASETS.PLANETS
  => map(planet_to_circle)
  => pack_row()
  => draw()
```


## How many milliseconds is 15 minutes

``` javascript
  15 minutes as msec
```


  

## Plot all of my friends on a map by their addresses as user avatars
If we assume friends only have one mailing address

``` javascript
find(contacts, (a) => a.type == DB.person and a.category == DB.contacts)
  => for((f) => f.latlon = lookup_lat_lon(f.address))
  => draw_geomap( coord: (f)=> f.latlon, label: (f)=>f.avatar)
```

The `draw_map` function takes a list of objects. If the objects are themselves lat/lon pairs 
it will just draw them with default markers. If the objects are not GeoCoordinates 
it will need an accessor function to pull out the lat lon. You can also use a mapping 
function to pull out a label.

## Show the current position of the ISS on a map

```javascript
import ISS
find_position(now()) => draw_geomap( globe:true)
```


## Draw the relative height of a 6ft man and 40in child

``` javascript
  rect(width:1ft height:6ft) => man
  rect(width:1ft height:40in) => child
  pack_row([man,child]) => draw()
```

## Draw the relative thinness of every iphone

``` javascript
iphones = DATASETS.IPHONES
iphones 
  => map( p => rect(width:p.depth, height:p.height))
  => for( r => r.fill = color({hue:randi(360)}))
  => pack_row()
  => draw() 
```

## Plot the equation x^2 + 5x
``` javascript
fun eq = (x) => x^2 + 5x
plot(eq, range:[0,10])
```

## 10 tallest buildings in the world as table and diagram

``` javascript
order(DATASETS.BUILDINGS, by:'height', dir:'asc') => take(10) => buildings
show(buildings)
buildings => map(h => rect(height:h, width: h/10)) => pack_row() => draw()
```

## Chart atomic number vs year of discovery

``` javascript
let elements = DATASETS.ELEMENTS
chart(elements, 
  x_axis:(e)=>e.number, 
  y_axis:(e)=>e.discovery_date, 
  type:'scatter')
```

## Calculate scrabble value of the word EXIT

``` javascript
let word = 'EXIT'
let letters = DATASETS.SCRABBLE
word.map(l => letters[letter].score) => sum()
```

## Vector math for drawing points

``` javascript
// define some points
let A = [25,50]   // first point
let B = [100,50]  // second point

let AB = B-A   // subtract vectors to get the part between the two points
fun magnitude (A) => (A[0]**2+A[1]**2)**-2 
fun normalize (A) => (A/magnitude(A))
fun make_rot (Ø) => [ [cos(Ø), -sin(Ø)], 
                      [sin(Ø),  cos(Ø)] ]

fun dot (A,B) => + across (A*B)

fun cross (A,B) =>  [
    A[1]*B[2] - A[2]*B[1], 
    A[2]*B[0] - A[0]*B[2],
    A[0]*B[1] - A[1]*B[0],
]
fun angle (A,B) => arccos(dot(A,B)/(mag(A)*mag(B)))
// rotate by 90 degrees
let rotated = make_rot(PI/2) * AB
```


# Questions

* How can you show provenance? Include textual descriptions with links. Ex: [The 5 Fastest Rifle Cartridges](https://www.msn.com/en-us/news/us/the-5-fastest-rifle-cartridges/ar-BB17nLBQ)
* How to auto-complete the `earth.circumference` part?
* How to make sure the unit `ft/s` isn’t interpreted as actual division?

* define clamp to work on more than just scalars. could you clamp a color vector or a point vector?
* visualize vectors by drawing as arrows. how?  map list of vectors to arrows?
* how to let you work with components of vectors with xyz rgb etc when it's really just a list of two numbers underneath

[Eucliean Vector](https://en.wikipedia.org/wiki/Euclidean_vector)


* What's the shortest possible raytracer using vector math. 
    * Loop over every pixel
    * generate primary ray
    * intersect with list of objects
    * find normal at closest intersection
    * calculate shading using lights.
    * project secondary rays and recurse

  
* what's a good syntax for anonymous functions / lambdas?

``` javascript
double = @(x) x*2
double = |x|x*2|
double = (x)=>x*2
double = x => x*2
double = lambda x: x*2
double = {x:Number -> x*2}
double(x) = x+y
```


* equality vs setting variables and pipeline.  Can pipelining to a new identifier be the same as setting a variable? ex:

``` javascript
// set the foo variable to the 'bar' string
var foo = 'bar'  //assign foo
var foo := 'bar' //assign foo
'bar' => foo     //assign to foo
(foo=='bar')     //comparison

```



# MISC

Genuary 5:  a loop of translucent circles

```javascript
const rando = (min, max) => Math.random()*(max-min) + min
let c = document.querySelector(canvas_id).getContext('2d')
let w = 300
c.save()
c.translate(w,600-w)
c.scale(1,-1)
c.fillStyle = 'white'
c.fillRect(0,0,w*2,w*2)
for(let n=0; n<10000; n++) {
    let th = (n/50.0)
    let jit = r(-10,10)
    let s = 10+n/50
    let x = Math.sin(th*2+n/20)*s
    let y = Math.cos(th*3)*s
    c.fillStyle = `hsla(${((n/130)+0)%360},100%,${10+n/130}%,0.2)`
    c.beginPath()
    c.arc(x+jit,y+jit,r(5,10), 0, Math.PI*2)
    c.closePath()
    c.fill()
}
c.restore()
```

vs the note lang version

``` javascript
range(10_000) 
    -> map(n => {
        let Ø = n/50
        return circle (
            fill: hsla(n/130 % 360, 100%, (10+n/130)%,20%)
            center: vec2(  sin(Ø*2+n/20), cos(Ø*3) ) * (10+n/50) + rando(-10,10)
            radius: rando(5,10)
        )
    })
    -> draw()
```

## genuary 6

```javascript
    let tri1 = [pt(200,200), pt(400,200), pt(300,400)]
    let triangles = random_split(tri1)

    function draw_circle_triangle(c, t, fill) {
        let A = t[0], B = t[1], C = t[2]
        const circle_line = (A,B) => {
            let AB = B.minus(A)
            let D = AB.rotate(toRad(60)).add(A)
            let LEN = A.distance(B)
    
            c.fillStyle = `hsla(${100+randi(5)*40},100%,50%,0.05)`
            c.beginPath()
            c.arc(D.x,D.y, LEN, 0, Math.PI*2)
            c.fill()
            c.fill()
        }
        circle_line(A,B)
        circle_line(B,C)
        circle_line(C,A)
    }

    function random_split(t) {
        let side = 0//randi(3)
        const pp = (n) => t[(n%t.length)]
        let  p = pt( (pp(side).x + pp(side+1).x)/2, (pp(side).y + pp(side+1).y)/2)
        let t1 = [pp(side),p,pp(side+2)]
        let t2 = [p,pp(side+1),pp(side+2)]
        return [t1,t2]
    }
    
    ts.forEach(t => draw_circle_triangle(c,t,'red'))

```

vs notelang version

```notelang

    function split(t) {
        let [A,B,C] = t
        let D = (A+B)/2
        return [
            [A,D,C,
            [D,B,C]
        ]
    }

    function draw_circle_triangle(t) {
        const circle_line = (A,B) => {
            let D = Rot2D(60deg) * (B-A) + A
            let LEN = Magnitude(B-A)
            return circle(
                fill : hsla(100+randi(5)*40, 100%, 50%, 5%))
                center: D,
                radius: LEN,
            )
        }
        let [A,B,C] = t
        return [circle_line(A,B), circle_line(B,C), circle_line(C,A)]
    }
    
    let tri1 = [vec2(200,200), vec2(400,200), vec2(300,400)]
    let triangles = random_split(tri1)
    map(triangles, draw_circle_triangle) -> draw
    
```

## image manipulation

`coord` here is a vector of 2 numbers, (x,y)
`color` here is a vector of 3 numbers, rgb, 0->1.

```javascript
// mix each pixel w/ adjacent 50%/50
for(image, (coord, color) => {
    let adj = getPixel(image,coord+[1,0])
    return (color + adj)/2
})
```


# research

https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(list_comprehension)

Look at what LINQ does.

```csharp
var ns = from x in Enumerable.Range(0, 100)
         where x * x > 3
         select x * 2;
```

is sugar for

```csharp
var ns = Enumerable.Range(0, 100)
        .Where(x => x * x > 3)
        .Select(x => x * 2);
```

how about 
```javascript
range(100) => select(where= x=>x*x>3, map:x=>x*2)
```
or
```javascript
range(100) => filter(x=>x*x>3) => map(x=>x*2) => show()
```


turned into block language
```
|--------------|
| make 0 to 10 | 
|--------------------|
| include x where    |
|  x*x > 3           |
|--------------------|
| transform x to |
|  x * 2         |
|----------------|
```





# Philosophy

* build your code up in pieces, incrementally. always be able to see the steps along the way
* learn as you code. shortcuts are just sugar for plain stuff. learn the plain then learn the sugar
* make a separate function, then inline it.



https://writings.stephenwolfram.com/2016/09/how-to-teach-computational-thinking/