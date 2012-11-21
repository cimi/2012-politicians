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
 
require(['app'], function(app) {
  app.loadPoliticians();
  app.initChart();
  app.initToolbar();
  app.initTypeahead();
});
