//
// particle system with toxiclibs.js
//
//
//
// * * *



var w = window.innerWidth
var h = window.innerHeight

var n_elements = 256

var svg = d3.select('body').append('svg')

svg.attr('width', w)
   .attr('height', h)
   .style('background-color', 'black')

var simplexNoise = toxi.math.noise.simplexNoise.noise

var particles = []
for (var i = 0; i < n_elements; i++){
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.random()-0.5,
    vy: Math.random()-0.5
  })
}

var circles = []

for(var i = 0; i < n_elements; i++){

  var particle = particles[i]

  var circle = svg.append('circle').attr('cx', particle.x).attr('cy', particle.y).attr('r', Math.random()*3+1)
  circle.style('fill-opacity', 0.8)
  circle.style('fill', 'black')
  circle.style('stroke',d3.rgb(Math.random()*255, Math.random()*255, Math.random()*255))


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


tick()

function tick(){
  circles.forEach(function(svg_element,index){

    var particle = svg_element.particle



    var noise_multi = 0.1

    var time = Date.now() * 0.0001

    particle.vx += noise_multi * simplexNoise(particle.x/w,particle.y/h,time)
    particle.vy += noise_multi * simplexNoise((h-particle.y)/h,(w-particle.x)/w,time)

    var dampening = 0.991
    particle.vx *= dampening
    particle.vy *= dampening

    particle.x += particle.vx
    particle.y += particle.vy

    if(particle.x > w){
      particle.x -= w
    }
    if(particle.x < 0){
      particle.x += w
    }
    if(particle.y > h){
      particle.y -= h
    }
    if(particle.y < 0){
      particle.y += h
    }

    svg_element.attr('cx', particle.x)
    svg_element.attr('cy', particle.y)

    if(true){
      var distance = Math.sqrt(Math.pow(particle.x-mouse.x,2)+Math.pow(particle.y-mouse.y,2))

      if(distance<100){
        if(!svg_element.in_range){
//          svg_element.transition().attr('r', Math.random()*50+10).ease('bounce').duration(1000)
          svg_element.transition()
            .duration(1000)
            .ease('bounce')
            .style('stroke', d3.rgb(Math.random()*255, Math.random()*255, Math.random()*255))
            .attr('r', 100)
        }
        svg_element.in_range = true
      } else {
        if(svg_element.in_range){

          svg_element.transition()
            .ease('bounce')
            .delay(500)
            .duration(Math.random()*3000+1000)
            .attr('r', Math.random()*3+1)

        }
        svg_element.in_range = false
      }
    }


  })

  window.requestAnimationFrame(tick)

}

svg.on('mousemove', function(){
  //console.log(d3.event)
  mouse.x = d3.event.x
  mouse.y = d3.event.y
})
