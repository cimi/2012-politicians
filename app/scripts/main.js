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
  $('#udmrBtn').click(function (e) {
    var allUdmr = data.children[0];
    chart.update(allUdmr);
  });
});
