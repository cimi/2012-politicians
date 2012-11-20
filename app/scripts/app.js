define(['jquery', 'politicians'], function($, Politicians) {
  "use strict"
  // read senate and chamber of deputies data

  return {
  	getPoliticians : function () {
      var prefix = 'data/'
        , sources = ['senate', 'deputies']
        , politicians = {};
      sources.forEach(function (source) {
        $.ajax({
            url : prefix + source + '.json', 
            success : function (data) {
                politicians[source] = data;
            }, 
            async : false,
            dataType : "json"
        });
      });
      return new Politicians(politicians);
    },
    createTypeahead : function (flatData) {
      // create a typeahead search box to hilight
      // certain candidates
      var labels, mapped, that = this;
      var typeaheadOptions = {
        source : function (query, process) {
          labels = []; mapped = {};
          $.each(flatData, function (idx, politician) {
            if (politician.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              labels.push(politician.name);
              mapped[politician.name] = politician;
            }
          });
          process(labels);
        },
        updater : function (name) {
          var politician = mapped[name];
          that.chart.unhilight();
          that.chart.hilight(politician);
          return name;
        }
      };
      $('#typeaheadSearch').typeahead(typeaheadOptions);
    },
    setChart : function (chart) {
      this.chart = chart;
    }
  }
});