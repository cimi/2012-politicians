require.config({
  shim: {
    typeahead: {
      deps: ['jquery'],
      exports: 'jQuery.fn.typeahead'
    }
  },

  paths: {
    jquery: 'vendor/jquery.min',
    typeahead: 'vendor/bootstrap/bootstrap-typeahead'
  }
});
 
require(['app', 'pack', 'typeahead'], function(app, PackChart, typeahead) {
  var politicians = app.getPoliticians();
  var data = politicians.getSenateByParty();
  var chart = new PackChart(data);

  // create buttons to update the chart
  // and fill with members from only one
  // party
  var $btnGroup = $('#partyBtnGroup');
  $('<a href="#" class="btn">Total</a>').click(function (e) { chart.update(data); }).appendTo($btnGroup);
  $.each(data.children, function (idx, party) {
    var btn = $('<a href="#" class="btn" id="' + party.name + '">' + party.name + ' (' + party.children.length + ')</a>');
    btn.click(function (e) {
      chart.update(data.children[idx]);
    });
    $btnGroup.append(btn);
  });

  // create a typeahead search box to hilight
  // certain candidates
  var labels, mapped, flatData = politicians.getSenateList(); 
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
      chart.unhilight();
      chart.hilight(politician);
      return name;
    }
  };
  $('#typeaheadSearch').typeahead(typeaheadOptions);
});
