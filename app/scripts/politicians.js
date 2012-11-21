define(['jquery'], function ($) {
	var Politicians = function (rawData) {
        this._data = rawData;
    }

    // TODO: refactor this, it's ugly
    Politicians.prototype.getByParty = function (chamber, party) {
        if (!chamber) chamber = 'all';
        var result = { 'name' : chamber, 'children' : []}
          , populateResult = $.proxy(function (chamber, result) {
            $.each(this._data[chamber], function (idx, politician) {
                var present = false;
                $.each(result.children, function (idx, party) {
                    if (party.name === politician.group) {
                        party.children.push(politician);
                        present = true;
                    }
                });
                if (!present) {
                    var party = { name : politician.group, children : []};
                    party.children.push(politician);
                    result.children.push(party);
                }
            });
            result.children.sort(function (a, b) { return a.children.length < b.children.length; });
            return result;
        }, this);
        if (chamber != 'senate' && chamber != 'deputies') {
            populateResult('senate', result);
            populateResult('deputies', result);
        } else {
            populateResult(chamber, result);
        }

        if (party) {
            $.each(result.children, function () {
                if (this.name === party) {
                    result = this;
                    return false;
                }
            });
        }
        return result;
    };

    Politicians.prototype.getList = function (chamber, party) {
      var result = [];
      if (chamber != 'senate' && chamber != 'deputies') {
        return this.getList('senate', party).concat(this.getList('deputies', party));
      }
      $.each(this._data[chamber], function (idx, politician) {
        // just get the leaf nodes
        if (!politician.children) {
          if (!party || politician.group === party) {
            result.push(politician);  
          }
        }
      });
      return result;
    };

    var COLORS = { 
        'PD-L' : ['#fa720e', '#040b9a', 'white'],
        'PNL' : ['#fcdb00', '#015972', 'white'],
        'PSD' : ['#ce0013', '#fefefe', 'blue'],
        'UDMR' : ['#067622', '#fe0000', 'white'],
        'Independent' : ['#fefefe', 'brown', 'red'],
        'Minoritati' : ['#fefefe', 'brown', 'red'],
        'senate' : ['white', 'pink', 'white'],
        'deputies' : ['white', 'pink', 'white'],
        'all' : ['white', 'pink', 'white']
    }

    Politicians.getPrimaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][0] : COLORS[obj.name][1];
    }

    Politicians.getSecondaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][0] : COLORS[obj.name][1];   
    }

    Politicians.getTertiaryColor = function (obj) {
        return obj.group ? COLORS[obj.group][2] : COLORS[obj.name][2];
    }

    return Politicians;
});
