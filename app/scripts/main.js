require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min'
  }
});
 
require(['app', 'pack'], function(app, PackChart) {
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
});
