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
  console.log(data);
  var $btnGroup = $('#partyBtnGroup');
  $.each(data.children, function (idx, party) {
    var btn = $('<a href="#" class="btn" id="' + party.name + '">' + party.name + '</a>');
    btn.click(function (e) {
      chart.update(data.children[idx]);
    });
    $btnGroup.append(btn);
  });
});
