define(['Tooltip'], function (Tooltip) {
    var WIDTH = HEIGHT = 960;
    
    var PackChart = function (data) {
      this.tooltip = new Tooltip(Handlebars.compile($("#tooltipTemplate").html()));

      var vis = initVis("#chart", WIDTH, HEIGHT);
      var pack = configurePack(WIDTH - 4, HEIGHT - 4);
      var node = configureNodes(vis, data, pack);


      node.append("title")
          .text(function(d) { 
            return d.name + (d.children ? "" : ": " + d3.format(",%")(d.attendance / 100)); 
          });

      // pass the context to the event handling functions
      var that = this;
      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .on("mouseover", function (d, i) { that.showDetails(d, i, this); })
          .on("mouseout", function (d, i) { that.hideDetails(d, i, this); });

      node.filter(function(d) { return !d.children; }).append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".3em")
          .text(function(d) { return d.name.substring(0, d.r / 3); });
    }

     var initVis = function (selector, width, height) {
        return d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "pack")
            .append("g")
            .attr("transform", "translate(2, 2)");
    }

    var configurePack = function (width, height) {
        return d3.layout.pack()
            .size([width, height])
            .value(function(d) { return d.attendance; });
    }

    var configureNodes = function (vis, data, pack) {
        return vis.data([data]).selectAll("g.node")
            .data(pack.nodes)
            .enter().append("g")
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    PackChart.prototype.showDetails = function (d, i, element) {
      d3.select(element).select("circle")
        .style("stroke", "black")
        .style("stroke-width", 2);
      // this refers to the 
      this.tooltip.show(d);
    }

    PackChart.prototype.hideDetails = function (d, i, element) {
      d3.select(element).select("circle")
          .style("stroke", "blue")
          .style("stroke-width", 1);
      this.tooltip.hide();
    }

    return PackChart;
});