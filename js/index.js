'use strict';
//
// particle system with toxiclibs.js
//
//
//
// * * *


var w = window.innerWidth
var h = window.innerHeight

var random = d3.random.normal(0)

var n_elements = 256

var svg = d3.select('body').append('svg')

svg.attr('width', w)
   .attr('height', h)
   .style('background-color', 'black')

var g_root = svg.append('g')
  .attr('transform', 'translate(' + (w*0.5) + ',' + (h*0.5) + ')')

var simplexNoise = toxi.math.noise.simplexNoise.noise

var particles = []
for (var i = 0; i < n_elements; i++){

  particles.push({
    pos: new toxi.geom.Vec2D(random()*w, random()*h),
    //vel: new toxi.geom.Vec2D(random(),random()),
    vel: new toxi.geom.Vec2D(0,0),
    r: (Math.random() * (w*0.02)) + 1,
    is_transitioned: false
  })

}

var circles = []

for(var i = 0; i < n_elements; i++){

  var particle = particles[i]

  var circle = g_root.append('circle')
    .attr('cx', particle.x)
    .attr('cy', particle.y)
    .attr('r', particle.r)

  circle.style('fill-opacity', 0.5)
    .style('fill', d3.rgb(Math.random()*255, Math.random()*255, Math.random()*255))
    .style('stroke', 'none')

  // data binding like a pro
  // duck-typing
  // objects without classes, javascript ftw
  circle.particle = particle
  circle.in_range = false

  circles.push(circle)

}

var mouse = {
  x: w*0.5,
  y: h*0.5
}

var voro = d3.geom.voronoi().x(function(d){ return d.x }).y(function(d){ return d.y })

var m  = voro(circles)

var center = new toxi.geom.Vec2D(0,0)
var force_vec = new toxi.geom.Vec2D(0,0)



var particle
var noise_multi = 0.3
var time_multi = 0.0003
var time = Date.now() * time_multi
var dampening
var svg_element
var distance_to_center
var i

tick()

function tick(){

  //console.profile()
  time = Date.now() * time_multi

  for(i = -1; ++i < circles.length;){

    svg_element = circles[i]

    particle = svg_element.particle

    particle.vel.x += noise_multi * simplexNoise(particle.pos.x/w,particle.pos.y/h,time)
    particle.vel.y += noise_multi * simplexNoise((h-particle.pos.y)/h,(w-particle.pos.x)/w,time)

    dampening = 0.991 - (particle.r * particle.r * 0.00001)

    particle.vel.x *= dampening
    particle.vel.y *= dampening

    particle.pos.x += particle.vel.x
    particle.pos.y += particle.vel.y

    if(particle.pos.x > w){
      particle.pos.x -= w * 2
    }
    if(particle.pos.x < -w){
      particle.pos.x += w * 2
    }
    if(particle.pos.y > h){
      particle.pos.y -= h * 2
    }
    if(particle.pos.y < -h){
      particle.pos.y += h * 2
    }

    svg_element.attr('cx', particle.pos.x).attr('cy', particle.pos.y)
    //svg_element.attr('cy', particle.pos.y)

    distance_to_center = Math.sqrt(particle.pos.x*particle.pos.x + particle.pos.y * particle.pos.y )
    force_vec.x = particle.pos.x
    force_vec.y = particle.pos.y

    force_vec.normalizeTo(distance_to_center*0.0001)


    particle.vel.x -= force_vec.x
    particle.vel.y -= force_vec.y


  }

  //console.profileEnd()
  // debugger;
  //
  return window.requestAnimationFrame(tick)

}

svg.on('mousemove', function(){
  //console.log(d3.event)
  mouse.x = d3.event.x
  mouse.y = d3.event.y
})
