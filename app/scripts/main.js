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

  app.setChart(chart);

  // create buttons to update the chart
  // and fill with members from only one
  // party
  var $btnGroup = $('#partyBtnGroup');
  $('<a href="#" class="btn">Orice partid</a>')
      .click(function (e) { 
        chart.update(data); 
      }).appendTo($btnGroup);
  $.each(data.children, function (idx, party) {
    var btn = $('<a href="#" class="btn" id="' + party.name + '">' + party.name + ' (' + party.children.length + ')</a>');
    btn.click(function (e) {
      chart.update(data.children[idx]);
    });
    $btnGroup.append(btn);
  });

  app.createTypeahead(politicians.getSenateList());
});
