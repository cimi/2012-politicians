define(['jquery', 'politicians'], function($, Politicians) {
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
    }
  }
});