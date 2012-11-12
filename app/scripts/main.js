require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min'
  }
});
 
require(['app'], function(app) {
  var politicians = app.getPoliticians()
    , width = 960
    , height = 960
    , format = d3.format(",d");

var pack = d3.layout.pack()
    .size([width - 4, height - 4])
    .value(function(d) { return d.attendance; });

var vis = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pack")
    .append("g")
    .attr("transform", "translate(2, 2)");

var data = politicians.getSenateByParty();
console.log(data);
var node = vis.data([data]).selectAll("g.node")
      .data(pack.nodes)
      .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.attendance)); });

  node.append("circle")
      .attr("r", function(d) { return d.r; });

  node.filter(function(d) { return !d.children; }).append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .text(function(d) { return d.name.substring(0, d.r / 3); });
    
});