define(['jquery', 'InfoBox', 'politicians'], function ($, InfoBox, Politicians) {
    var WIDTH = HEIGHT = 500;
    var PackChart = function (data) {
      this.infobox = new InfoBox($('#infoboxContent'), $("#infoboxTemplate"), $("#infoboxPlaceholder"));

      this.vis = initVis("#chart", WIDTH, HEIGHT);
      this.pack = configurePack();
      this.hilighted = [];
      this.update(data);
   }

    var initVis = function (selector, width, height) {
        return d3.select(selector).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "pack")
            .append("g")
            .attr("transform", "translate(2, 2)");
    }

    var configurePack = function () {
        return d3.layout.pack()
            .size([WIDTH - 4, HEIGHT - 4])
            .value(function(d) { return d.attendance; });
    }

    var getElement = function (d) {
      var personDatum = d, element;
      d3.selectAll('circle').each(function (d, i) {
        if (d.name === personDatum.name) {
          element = this;
          return false;
        }
      });
      return element;
    }

    PackChart.prototype.hilight = function (d, element) {
      // if no element was passed in, determine it
      // through the name
      if (!element) {
        element = getElement(d);
      }

      // if it's a leaf node, also hilight the party and show
      // an infobox
      var personDatum = d, that = this;
      if (!d.children && d.group) {
        d3.selectAll('.party circle').each(function (d, i) {
          if (d.name === personDatum.group) {
            that.hilight(d, this);
          }
        });
        this.infobox.show(d);  
      }
      d3.select(element).transition().duration(500)
        .style("stroke-width", 2)
        .style("fill-opacity", 1)
        .style("stroke", Politicians.getTertiaryColor(d));
      this.hilighted.push(element);
    }

    PackChart.prototype.unhilight = function (element) {
      // if no data passed in, unhilight everything
      if (!element) {
        var that = this;
        $.each(this.hilighted, function (idx, element) {
          that.unhilight(element);
        });
        return;
      }
      d3.select(element).transition().duration(500)
          .style("fill-opacity", "0.7")
          .style("stroke-width", 1);
      this.infobox.hide();
    }

    PackChart.prototype.update = function (data) {
      // update data
      var dataset = this.vis.data([data]);
      this.pack = configurePack();
      // remove all previous nodes
      this.vis.selectAll('circle').transition().duration(500)
          .attr("r", function (d) { return 0; });
      dataset.selectAll("g").data([]).exit().remove();
      var node = dataset.selectAll("g").data(this.pack.nodes);

      var that = this; 
      node.enter().append("g")
          .attr("class", function(d) { return d.children ? "party" : "person"; })
          .append("circle")
          .style("fill", Politicians.getPrimaryColor)
          .style("stroke", Politicians.getSecondaryColor)
          .on("mouseover", function (d, i) { that.hilight(d, this); })
          .on("mouseout", function (d, i) { that.unhilight(this); })
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      this.vis.selectAll('circle').transition().duration(1000)
          .attr("r", function(d) { return d.r; });

      // remove old elements
      node.exit().remove();

      return node;
    }

    return PackChart;
});
