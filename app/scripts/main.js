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
});